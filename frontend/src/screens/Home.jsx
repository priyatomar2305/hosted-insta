import React, { useEffect, useState } from "react";
import "../css/home.css";

import { useNavigate } from "react-router-dom";
export default function Home() {
  const [data, setData] = useState([]);
  const [item, setItem] = useState([]);
  const[comment,setComment]=useState({})
  const [showComments, setShowComments] = useState(false); // Track visibility per post
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));


  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("/signup");
    }
    //fetching all posts
    fetch("/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((err) => console.log(err));
  }, []);

  const likePost = async (id) => {
    await fetch("/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newdata = data.map((post) => {
          return post._id === result._id
            ? { ...post, likes: result.likes }
            : post;
        });
        setData(newdata);
      });
  };
  const unlikePost = async (id) => {
    await fetch("/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newdata = data.map((post) => {
          return post._id === result._id
            ? { ...post, likes: result.likes }
            : post;
        });
        setData(newdata);
        console.log(result);
      });
  };
  const makeComments = async (comment, id) => {
    await fetch("/comments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        comment: comment,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newdata = data.map((post) => {
          return post._id === result._id
            ? { ...post, comments: result.comments }
            : post;
        });
        setData(newdata);

        // Update the item state if the current item is the post being commented on
        if (item._id === result._id) {
          setItem({ ...item, comments: result.comments });
        }

        // Ensure comments section remains visible after posting a comment
      });
    setComment("");
  };

  const toggleComments = (posts) => {
    if (showComments) {
      setShowComments(false);
      console.log("false");
    } else {
      setShowComments(true);
      setItem(posts);
      console.log("true");
    }
  };
  return (
    <>
      {" "}
      <div className="home">
        {data.length > 0 ? (
          data.map((posts) => {
            return (
              <div className="card" key={posts._id}>
                <div
                  className="card-headerr"
                  onClick={() => {
                    if (user._id == posts.postedBy._id) {
                      navigate(`/myprofile`);
                    } else {
                      navigate(`/userprofile/${posts.postedBy._id}`);
                    }
                  }}
                >
                  <img
                    className="profile-img"
                    src={
                      posts.postedBy.Photo
                        ? posts.postedBy.Photo
                        : "https://cdn-icons-png.flaticon.com/128/3033/3033143.png"
                    }
                    alt=""
                  />
                  <h3>{posts.postedBy.name}</h3>
                </div>
                <div className="card-img">
                  <img src={posts.photo} alt="" />
                </div>
                <div className="card-content">
                  {posts.likes.includes(
                    JSON.parse(localStorage.getItem("user"))._id
                  ) ? (
                    <span
                      onClick={() => {
                        unlikePost(posts._id);
                      }}
                      className="material-symbols-outlined red"
                    >
                      favorite
                    </span>
                  ) : (
                    <span
                      onClick={() => {
                        likePost(posts._id);
                      }}
                      className="material-symbols-outlined"
                    >
                      favorite
                    </span>
                  )}

                  <p>
                    {posts.likes.length} like
                    {posts.likes.length !== 1 ? "s" : ""}
                  </p>

                  <p>{posts.body}</p>
                </div>
                <div className="viewcom" onClick={() => toggleComments(posts)}>
                  view all comments
                </div>
                <hr />
                <div className="comment">
                  <span className="material-symbols-outlined ">
                    add_comment
                  </span>
                  <input
                    type="text"
                    value={comment[posts._id] || ""}
                    placeholder="add a comment"
                    onChange={(e) => {
                      setComment({
                        ...comment,
                        [posts._id]: e.target.value,
                      });
                    }}
                  />
                  <button
                    onClick={() => {
                      makeComments(comment[posts._id], posts._id);
                    }}
                  >
                    post
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>no posts </p>
        )}{" "}
        {showComments && (
          <div
            className="com-hom"
            onClick={() => {
              if (showComments) {
                setShowComments(false);
              }
            }}
          >
            <div className="over-lay">
              <div
                className="com-sec-1"
                onClick={() => {
                  setShowComments(false);
                }}
              >
                <div className="com-img-full">
                  <img src={item.photo} alt="" />
                </div>
              </div>

              <div className="com-sec-2">
                <div
                  className="card-headerr"
                  onClick={() => {
                    setShowComments(false);
                  }}
                >
                  <img
                    className="profile-img"
                    src={
                      item.postedBy.Photo ||
                      "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                    }
                    alt=""
                  />
                  <h3>{item.postedBy.name}</h3>
                </div>
                <div className="comment-card">
                  {item.comments.map((data) => {
                    return (
                      <div className="comments-sec" key={data._id}>
                        <div className="com-header">
                          <img
                            className="com-img"
                            src={
                              data.postedBy.Photo ||
                              "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                            }
                            alt=""
                          />
                          <h4> {data.postedBy.name}</h4>
                        </div>
                        <div className="comm-header">
                          <p>{data.comment}</p>
                          <div className="like-sec">
                            <span className="material-symbols-outlined com-h">
                              favorite
                            </span>

                            <p>
                              {item.likes.length} like
                              {item.likes.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <hr />
                <div className="comment">
                  <span className="material-symbols-outlined ">
                    add_comment
                  </span>
                  <input
                    type="text"
                    value={comment[item._id] || ""}
                    placeholder="add a commets"
                    onChange={(e) => {
                      setComment({
                        ...comment,
                        [item._id]: e.target.value,
                      });
                    }}
                  />
                  <button
                    onClick={() => {
                      makeComments(comment[item._id], item._id);
                    }}
                  >
                    post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
