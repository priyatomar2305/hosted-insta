import { useState, useEffect } from 'react';
import '../css/Createpost.css';

import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
  const user = JSON.parse(localStorage.getItem("user"));

const notifyA = (x) => toast.success(x);
const notifyb = (x) => toast.error(x);

export default function Createpost() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
const token = localStorage.getItem("jwt");
  const loadFile = (event) => {
    const output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); 
    }
  }

  useEffect(() => {
    if (!token) {
  navigate('/login')
}
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization":"Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          body,
          image: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notifyb(data.error
            );
            navigate('/login')

          } else {
            notifyA(data.success);
            navigate("/myprofile");
            setBody("");
            setImage(null);
            setUrl("");
          }
        })
        .catch((err) => {
          notifyb("An unexpected error occurred.");
          console.error(err);
        });
    }
  }, [url]);

  const postData = () => {
    if (!image || !body) {
      notifyb("Please add all fields");
      return;
    }

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "cantacloud22");

    fetch("https://api.cloudinary.com/v1_1/cantacloud22/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setUrl(data.url);
        } else {
          notifyb("Image upload failed. Please try again.");
        }
      })
      .catch((err) => {
        notifyb("Image upload failed. Please try again.");
        console.error(err);
      });
  }
  

  return (
    <div className="create-post">
      <div className="create-post-child">
        <div className="p-header">
          <h1>Create post</h1>
          <button id="post-btn" onClick={postData}>
            Share
          </button>
        </div>
        <div className="main-div">
          <div>
          
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwclUsgwYCVKHAEMT8jd8FrlETTObKcGwdN86QiPr_ftbnpEIVNE7iNZLwr4WrFh2BFLo&usqp=CAU"
            alt=""
            id="output"
          />  </div>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              loadFile(event);
              setImage(event.target.files[0]);
            }}
          />
        </div>
        <div className="details">
          <div className="card-header">
            <div className="card-pic">
              <img
                src="https://media.istockphoto.com/id/1496077442/photo/american-flag-with-sparkler-4th-of-july-and-memorial-day-abstract-defocused-lights.webp?b=1&s=170667a&w=0&k=20&c=V83se1BvK841YVN6Dbm36kG5a4W5nq4ngPehpm5M4ME="
                alt=""
              />
            </div>
            <h2>{user.name}</h2>
          </div>
          <textarea
            placeholder="write a caption"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
