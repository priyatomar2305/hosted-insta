const express = require('express');
const router = express.Router()
var Jwt = require('jsonwebtoken');
const User=require('../models/signup')
const{Jwt_secret}=require('../keys')


const mongoose = require('mongoose');
const requiredlogin = require('../middlewares/requiredlogin');




router.post('/signup', async(req, res)=> {


    const { name, username, password, email } = req.body;

  
  if (!name || !username || !password || !email) {
    
    res.status(422).json({"error":'please add the fields'})
  } else {
    
    await User.findOne({ $or: [{ username: username }, { email: email }] } ).then(
      (saveduser) => {
        if (saveduser) {
          res.status(422).json({"error":'username or email alerady exists'})

        } else {
          
 let  data = new User(
        
        {

name, username, password, email

        }
    )

          data.save().then(dat => {
            
             res.status(200).json({"success":'data saved succesfully'})
            
          }).catch(err => {
              res.status(422).json({"error":'some err occured'})
          })

        }

  }

)

  }
  
})

router.post('/signin', (req, res) => {
  
  let { username, password } = req.body;

  User.findOne({$and:[{ username: username },{password:password}]}).then((e) => {
    
    if (!e) {
       
    res.status(422).json({error:'invalid username or password'})
    } else {
      const token = Jwt.sign({ _id: e.id }, Jwt_secret)
      const { _id, name, username, email } = e;
       res.json({token,user:{_id, name, username, email}})

    }
  })}

)


//to follow

router.put('/follow', requiredlogin, async (req, res) => {
    try {
        const tofollow = await User.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.User.id }
        }, { new: true });

        if (!tofollow) {
            return res.status(422).json({ error: 'Could not follow the user' });
        }

        const mainuser = await User.findByIdAndUpdate(req.User.id, {
            $push: { following: req.body.followId }
        }, { new: true });

      res.json({tofollow,mainuser});
    } catch (err) {
        res.status(422).json({ error: 'Something went wrong' });
    }
});

//to unfollow
router.put('/unfollow', requiredlogin, async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(req.body.followId, {
            $pull: { followers: req.User.id }
        }, { new: true });

        if (!result) {
            return res.status(422).json({ error: 'Could not unfollow the user' });
        }

        const updatedUser = await User.findByIdAndUpdate(req.User.id, {
            $pull: { following: req.body.followId }
        }, { new: true });

        res.json(updatedUser);
    } catch (err) {
        res.status(422).json({ error: 'Something went wrong' });
    }
});



router.put('/updateprofile', requiredlogin, async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.User.id, {
      $set: { Photo: req.body.Photo }
    }, { new: true })

     if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result);
  }
  catch (err) {
    
    res.status(422).json({ error: 'Something went wrong' });


  }
})



module.exports = router;