import React, { useEffect, useRef, useState } from "react";
import "../css/profilepic.css";
import toast from "react-hot-toast";

const UpdateProfilePic = ({ ShowModal, setShowModal }) => {
  const [image, setImage] = useState();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const userr = JSON.parse(localStorage.getItem("user"));

  const notifyA = (x) => toast.success(x);
  const notifyb = (x) => toast.error(x);

  useEffect(() => {
    if (image) {
      postData();
    }
  }, [image]);

  useEffect(() => {
    if (url) {
     postImg()
    }
  }, [url]);

  const hiddenfile = useRef(null);

  const handleclick = () => {
    hiddenfile.current.click();
  };

  const postData = () => {
    if (!image) {
      notifyb("Please add an image");
      return;
    }
    setLoading(true);
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
      });
  };
  const postImg = () => {
   fetch("/updateprofile", {
     method: "put",
     headers: {
       "Content-Type": "application/json",
       Authorization: "Bearer " + localStorage.getItem("jwt"),
     },
     body: JSON.stringify({
       Photo: url,
     }),
   })
     .then((res) => res.json())
     .then((data) => {
       setShowModal(false);
       setLoading(false);
       if (data.error) {
         notifyb(data.error);
       } else {
         notifyA("Profile updated");
         setImage(null);
         setUrl("");
         window.location.reload();
       }
     })
     .catch((err) => {
       notifyb("An unexpected error occurred.");
       console.error(err);
     });
}
  return (
    <>
      <div className={`profile-pic-container`}>
        {loading ? (

          <div className="modal-overlay">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Change Profile Photo</h3>
              </div>
              <div className="modal-buttons">
                <button onClick={handleclick} className="modal-button primary">
                  Upload Photo
                </button>
                <input
                  type="file"
                  id="fileInput"
                  ref={hiddenfile}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => {
                    console.log("inp handle working");
                    setImage(e.target.files[0]);
                  }}
                />
                  <button className="modal-button danger" onClick={() => {
                    
                    setUrl("")
                    postImg();
                  }}
                  >
                  Remove Current Photo
                </button>
                <button
                  onClick={() => ShowModal()}
                  className="modal-button cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateProfilePic;
