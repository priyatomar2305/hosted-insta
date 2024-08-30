import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import { Toaster } from "react-hot-toast";
import { createContext, useState } from "react";

import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Profile from "./screens/Profile";
import UserProfile from "./components/UserProfile";
import Modal from "./components/Modal";
import Createpost from "./screens/Createpost";
import { LoginContext } from "./context/LoginContext";
import Myfollowing from "./screens/Following";
import UpdateProfilePic from "./components/Profilepic";

function App() {
  const [userLogin, setuserLogin] = useState(false);

  const [showlogout, setshowLogout] = useState();
  return (
    <BrowserRouter>
      <LoginContext.Provider value={{ setuserLogin }}>
        <Navbar login={userLogin} setshowLogout={setshowLogout} />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/myprofile" element={<Profile />}></Route>
          <Route path="/updateprofile" element={<UpdateProfilePic />}></Route>

          <Route path="/userprofile/:postId" element={<UserProfile />}></Route>
          <Route path="/myfollowing" element={<Myfollowing />}></Route>

          <Route path="/createpost" element={<Createpost />}></Route>
        </Routes>

        {showlogout && <Modal setshowLogout={setshowLogout}></Modal>}
        <Toaster />
      </LoginContext.Provider>
    </BrowserRouter>
  );
}

export default App;
