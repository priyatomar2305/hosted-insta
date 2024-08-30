import { useState,useContext } from "react";
import Insta from "../img/insta.png";
import "../css/Signup.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { LoginContext } from "../context/LoginContext";
export default function Login() {
  const { setuserLogin } = useContext(LoginContext);

        const navigate = useNavigate();

  const notify = (x) => toast.success(x);
  const notifye = (x) => toast.error(x);


let [username,setUsername]=useState("")
  let [password, setPassword ] = useState("")
 

  let Submit = () => {
    fetch("/signin", {
      method: "post",
      headers: {
      
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
  
        {
       username: username, password: password

        }
      )
    }

    ).then(res => res.json()).then(data => {
      
      if (data.error) {
                  notifye(data.error);

      } else {
        
        
         notify("login successfully");
        localStorage.setItem("jwt", data.token);
                localStorage.setItem("user",JSON.stringify(data.user));

        setuserLogin(true)
         navigate("/");

         setPassword("");
         setUsername("");
       }
    })

  }


  return (
    <div className="signup">
      <div className="form-container">
        <img src={Insta} alt="Instagram" />
        <p>Login, to see photos and videos from your friends and family.</p>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username}
        />

        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
        />
        <p>By logging in, you agree to our terms and conditions</p>
        <button type="submit" onClick={() => Submit()} className="signup-btn">
Login        </button>

        <div className="linkk">
          <p id="para">Don&apos;t have an account ?</p>
          <Link to="/signup">SignUp</Link>
        </div>
      </div>
    </div>
  );
}
