import { useContext, useState } from "react";
import Insta from "../img/insta.png";
import "../css/Signup.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { LoginContext } from "../context/LoginContext";
LoginContext

const notify = (x) => toast(x);
const notifyb = (x) => toast.error(x);



export default function SignUp() {
  const { setuserLogin } = useContext(LoginContext);

        const navigate = useNavigate();

const [name ,setName]=useState("")

const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
  const Data = () => {
    


    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        username: username,
        password: password,
        email: email,
      }),
    })
      .then(res => res.json())
      .then((data) => {

        if (data.success) {
          notify(data.success);
                navigate("/login");

        }else
               { notifyb(data.error);}

      });


    setEmail("")
    setName("")
    setPassword("")
  setUsername("")
  }
  

  


  return (
    <div className="signup">
      <div className="form-container">
        <img src={Insta} alt="Instagram" />
        <p>Signup to see photos and videos from your friends and family.</p>
        <input
          type="text"
          id="username"
          name="username" value={username}
         onChange={(e)=>{setUsername(e.target.value)}}  placeholder="Username" required
        />
        <input type="text" id="name" name="name" value={name} onChange={(e)=>{setName(e.target.value)}} required placeholder="full name" />

        <input type="email" id="email" required  value={email}onChange={(e)=>{setEmail(e.target.value)}}  placeholder="Email" />
        <input
          type="password"
          id="password"
      required
          name="password" value={password}
         onChange={(e)=>{setPassword(e.target.value)}}  placeholder="Password"
        />
        <p>By signing up, you agree to our terms and conditions</p>
        <button type="submit" onClick={()=>{Data()}} className="signup-btn">
          Signup
        </button>

      <div className="linkk">
        <p id="para">Already have an account ?</p>
        <Link to="/login">login</Link>
      </div>
    </div>      </div>

  );
}
