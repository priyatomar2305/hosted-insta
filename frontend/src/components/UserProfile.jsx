import { useEffect } from "react";
import "../css/profile.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
export default function UserProfile() {
      const { postId } = useParams();
  const [data, setData] = useState([]);
  const [user, setuser] = useState([])
  const[Isfollow,setIsfollow]=useState()
  const [showpost, setshowPost] = useState(false);
  const [comment, setComment] = useState({});

  const [postt, setPostt] = useState("");
  const navigate = useNavigate();
  const loguser = JSON.parse(localStorage.getItem("user"));
  
  
  
  
  const follow = (id) => {
    fetch("/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      });
    setIsfollow(true);
  };
  const unfollow = (id) => {
    fetch("/unfollow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      });

    setIsfollow(false);
  };

  
  
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signup");
      return;
    }
    //fetching all posts
    fetch(`/userprofile/${postId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      }
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts)
        setuser(result.userd)
        if (result.userd.followers.includes(loguser._id)) {
  setIsfollow(true)
        }

      })
      .catch((err) => console.log(err));
  }, [Isfollow]);
  

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
         if (postt._id === result._id) {
           setPostt({ ...postt, comments: result.comments });
         }

         // Ensure comments section remains visible after posting a comment
       });
     setComment("");
   };
  const displayImg = (post) => {
    setshowPost(true);
    setPostt(post);
  };


  return (
    <div className="profile">
      <div className="sec-1">
        <div className="p-frame">
          <div className="p-pic">
            {user.Photo ? (
              <img src={user.Photo} alt="Profile" />
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/128/3033/3033143.png"
                alt=""
              />
            )}
          </div>
          <div className="p-head">
            <div className="follow">
              {user && user.name ? (
                <h1>{user.name}</h1>
              ) : (
                <h1>no username found</h1>
              )}

              {Isfollow ? (
                <button
                  onClick={() => {
                    unfollow(user._id);
                  }}
                >
                  following
                </button>
              ) : (
                <button
                  onClick={() => {
                    follow(user._id);
                  }}
                >
                  follow
                </button>
              )}
            </div>
            <div className="p-info">
              <p>posts {data.length}</p>
              <p>followers {user.followers ? user.followers.length : "0"}</p>
              <p>following {user.following ? user.following.length : "0"} </p>
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
                  <img
                    className="profile-img"
                    src={
                      postt.postedBy.Photo ||
                      "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                    }
                    alt=""
                  />
                  <h3>{user.name}</h3>
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
    </div>
  );
}
