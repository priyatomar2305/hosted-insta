import { useEffect } from "react";
import "../css/profile.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
import UpdateProfilePic from "../components/Profilepic";

export default function Profile() {
  const [data, setData] = useState([]);
  const [showpost, setshowPost] = useState(false);
  const [comment, setComment] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [user, setuser] = useState("");
  const [postt, setPostt] = useState("");
  const navigate = useNavigate();
  const userr = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signup");
    }
    //fetching all posts
    fetch(`/userprofile/${userr._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
        setuser(result.userd);
      })
      .catch((err) => console.log(err));
  }, []);

  const deletepost = async (id) => {
    await fetch("/deletepost", {
      method: "delete",
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
        console.log(result);
        console.log("postdele");
        setData(data.filter((post) => post._id !== id));
        setshowPost(false);
      });
  };

  const ShowModal = () => {
    if (showModal) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
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

         if (postt._id === result._id) {
           setPostt({ ...postt, comments: result.comments });
         }
       });
     setComment("");
   };
  const displayImg = (post) => {
    setshowPost(true);
    setPostt(post);
  };

  return (
    <div className="profile" 
   >
      <div className="pro-child">
        <div className="sec-1">
          <div className="p-frame">
            <div
              className="p-pic"
              onClick={() => {
                setShowModal(true);
              }}
            >
              {user.Photo ? (
                <img src={user.Photo} alt="Profile" />
              ) : (
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                  alt=""
                />
              )}
            </div>
            <div className="p-head">
              <h1>{user.name}</h1>

              <div className="p-info">
                <p>
                  {" "}
                  <b>Posts</b> {data ? data.length : "0"}
                </p>
                <p>
                  <b>followers</b>{" "}
                  {user.followers ? user.followers.length : "0"}
                </p>
                <p>
                  {" "}
                  <b>following</b>{" "}
                  {user.following ? user.following.length : "0"}
                </p>
              </div>
            </div>
          </div>
          <hr />
          <div className="p-gallery">
            {data.length > 0 ? (
              data.map((post) => (
                <img
                  onClick={() => {
                    displayImg(post);
                  }}
                  key={post._id}
                  src={post.photo}
                  alt="Post"
                />
              ))
            ) : (
              <p> no posts available</p>
            )}
          </div>
        </div>

        <div>
          {showpost && (
            <div className="com-hom">
              <div className="over-lay">
                <div className="com-sec-1">
                  <div className="com-img-full">
                    <img
                      src={postt.photo}
                      alt=""
                      onClick={() => setshowPost(false)}
                    />
                  </div>
                </div>

                <div className="com-sec-2">
                  <div className="card-headerr">
                    <img className="profile-img" src={postt.postedBy.Photo} alt="" />
                    <h3>{postt.postedBy.name}</h3>
                    <button
                      className="dbtn"
                      onClick={() => {
                        deletepost(postt._id);
                      }}
                    >
                      delete
                    </button>
                  </div>
                  <div className="comment-card">
                    {postt.comments.map((data) => {
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
                                {postt.likes.length} like
                                {postt.likes.length !== 1 ? "s" : ""}
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
                      value={comment[postt._id] || ""}
                      placeholder="add a commets"
                      onChange={(e) => {
                        setComment({
                          ...comment,
                          [postt._id]: e.target.value,
                        });
                      }}
                    />
                    <button
                      onClick={() => {
                        makeComments(comment[postt._id], postt._id);
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
        {showModal && (
          <UpdateProfilePic ShowModal={ShowModal} setShowModal={setShowModal} />
        )}
      </div>
    </div>
  );
}
