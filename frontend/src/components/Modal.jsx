import React, { useContext } from "react";
import "../css/Modal.css";
import { LoginContext } from "../context/LoginContext";
import { Navigate, useNavigate } from "react-router-dom";
LoginContext;
export default function Modal({ setshowLogout }) {
  const { setuserLogin } = useContext(LoginContext);
     const navigate = useNavigate();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Are you sure you really want to logout?</p>
        <div className="modal-btn">
          <button
            className="modal-buttoprimary"
            onClick={() => {
              setshowLogout(false);
              setuserLogin(false);
              localStorage.clear();
              navigate("/login");
            }}
          >
            yes
          </button>

          <button
            onClick={() => {
              setshowLogout(false);
            }}
            className="btn btn-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
