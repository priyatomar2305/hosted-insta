const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/createPost');
const User = require('../models/signup');
const requiredlogin = require('../middlewares/requiredlogin');

router.get('/allposts', async (req, res) => {
  try {
    const posts = await Post.find()
    .populate("postedBy", '_id name Photo')
      .populate("comments.postedBy", '_id name Photo')
      .sort("-createdAt")
        .lean()
    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/deletepost', async (req, res) => {
  try {
    const result = await Post.findByIdAndDelete(req.body.postId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: "An error occurred while deleting the post" });
  }
});

router.get('/profile', requiredlogin, async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.User._id })
      .populate("postedBy", '_id name Photo')
      .populate("comments.postedBy", '_id name Photo')
      .sort("-createdAt")

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/userprofile/:postId', requiredlogin, async (req, res) => {
  const { postId } = req.params;
  try {
    const userd = await User.findById(postId).select("-password");
    if (!userd) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ postedBy: postId })
      .populate("postedBy", '_id name Photo')
      .populate("comments.postedBy", '_id name Photo')
      .sort("-createdAt")


    res.json({ userd, posts });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/like', requiredlogin, async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {  $addToSet: { likes: req.User._id } },
      { new: true }
    )
    res.json(result);
  } catch (err) {
    res.status(422).json({ error: "some err" });
  }
});

router.put('/unlike', requiredlogin, async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.User._id } },
      { new: true }
    ) 
    res.json(result);
  } catch (err) {
    res.status(422).json({ error: "some err" });
  }
});


router.put('/comments',requiredlogin,async (req, res) => {
 
 try{
  const comment = {
    comment: req.body.comment,
      postedBy: req.User._id

  }
 const data = await Post.findByIdAndUpdate(
    req.body.postId,
   { $push:{comments:comment}}
,{new:true}
 ).populate("comments.postedBy", '_id name Photo') // .lean() to get plain objects
    res.json(data);
  } catch (err) {
    res.status(422).json({ error: "some err" });
  }
  
})

router.post('/createpost', requiredlogin, async (req, res) => {
  const { body, image } = req.body;
  if (!body || !image) {
    return res.status(422).json({ error: 'pls add all fields' });
  }
  const newPost = new Post({
    body,
    postedBy: req.User._id,
    photo: image
  });
  try {
    const data = await newPost.save();
    res.status(200).json({ success: 'post saved successfully', data });
  } catch (error) {
    res.status(500).json({ error: 'pls try again' });
  }
});

router.get('/myfollowing', requiredlogin, async(req, res) => {
  
 const posts= await Post.find({ postedBy: { $in: req.User.following } })
    .populate("postedBy", '_id name Photo')
    .populate("comments.postedBy", '_id name Photo')
  if (!posts) {
        res.status(422).json({ error: "posts are not found" });


  } 
      res.json(posts);



})

module.exports = router;
