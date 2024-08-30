import Insta from '../img/SH.png';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import "../css/Navbar.css";
import { useState } from 'react';
import { LoginContext } from '../context/LoginContext';
LoginContext


export default function Navbar({login,setshowLogout}) {
     const navigate= useNavigate();

  
  
 const loginStatus = () => {
 const token = localStorage.getItem("jwt")
  const user = JSON.parse(localStorage.getItem("user"));



   if (login || token) {
    return (
      <>

        <Link to={`/myprofile`}>
          <li>Profile</li>
        </Link>

        <Link to={"/myfollowing"}>
          <li>following</li>
        </Link>
        <Link to="/createpost">
          {" "}
          <li>createpost</li>
        </Link>
        <button className='logout'
          onClick={() => {
setshowLogout(true)
          }}
        >
          logout
        </button>
      </>
    );
   } else {
     
     
     return <>
   <Link to="/signup">
            {" "}
            <li>SignUp</li>
          </Link>
          <Link to="/login">
            {" "}
            <li>Login</li>
       </Link>
       
     
   </>
      
}
 }
  
 const loginMobile = () => {
   const token = localStorage.getItem("jwt");
   const user = JSON.parse(localStorage.getItem("user"));

   if (login || token) {
     return (
       <>
         <Link to={"/"}>
           <span className="material-symbols-outlined">home</span>
         </Link>

         <Link to={`/myprofile`}>
           <span className="material-symbols-outlined">person</span>{" "}
         </Link>

         <Link to={"/myfollowing"}>
           <span className="material-symbols-outlined">explore</span>{" "}
         </Link>
         <Link to="/createpost">
           {" "}
           <span className="material-symbols-outlined">add_box</span>{" "}
         </Link>

         <span
           className="material-symbols-outlined log"
           onClick={() => {
             setshowLogout(true);
           }}
         >
           logout
         </span>
       </>
     );
   } else {
     return (
       <>
         <Link to="/signup">
           {" "}
           <li>SignUp</li>
         </Link>
         <Link to="/login">
           {" "}
           <li>Login</li>
         </Link>
       </>
     );
   }
 };
  return (
    <>
      <div className="nav-bar">
       
        <img className='nav-logo' src={Insta} onClick={() => {
          navigate('/')

      }} alt="" /> 

        <ul className="nav-menu">
{           loginStatus()
}
        </ul>
              </div>

        <ul className='nav-mobile'>
 {
            loginMobile()
    }  

        </ul>
     
    </>
  );
}
