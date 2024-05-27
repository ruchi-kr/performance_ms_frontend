import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "antd";
import { useDispatch } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { persistStore } from "redux-persist";
import { persistor } from "../redux/store";

const Header = () => {
  let [username, SetUserName] = useState("");
  useEffect(function () {
    const name = JSON.parse(sessionStorage.getItem("email_id"));
    SetUserName(name);
  }, []);

  var initial = username.charAt(0).toUpperCase();
  console.log("i m initial", initial);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // const name = sessionStorage.getItem('username');
  const role = JSON.parse(sessionStorage.getItem("role"));
  const user_type = JSON.parse(sessionStorage.getItem("user_type"));

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    sessionStorage.clear();
    localStorage.clear();

    setTimeout(function () {
      window.location.reload();
      console.log("reload");
    }, 100);
    navigate("/login");
  };
  return (
    <>
      {/* Navbar */}
      <nav
        className={`main-header navbar navbar-expand d-flex align-items-center bg-dark ${
          window.location.pathname === "/projectplan" ? "navbar-collapse" : ""
        }`}
      >
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link text-white"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars" />
            </a>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto ">
          {/* Navbar Search */}
          <li className="user-panel d-flex nav-item mx-lg-1 mx-0 align-items-center ">
            {/* <div className=""> */}
            {/* <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" /> */}
            {/* <Avatar
              siez={{ xs: 16, sm: 24, md: 32, lg: 32, xl: 40, xxl: 40 }}
              icon={<UserOutlined />}
              className="d-lg-block d-md-none d-none bg-secondary"
            /> */}
            <Avatar
              size={{ xs: 16, sm: 24, md: 32, lg: 32, xl: 40, xxl: 40 }}
              className="d-lg-block d-md-none d-none bg-info"
            >
              {/* Display the first letter of the user's name as the avatar */}
              {initial}
            </Avatar>
            {/* </div> */}
            <div className="info" style={{ lineHeight: "0.2" }}>
              <p className="text-white">{username}</p>
              {role !== "" ? (
                <>
                  <p className="text-dark bg-white p-2 text-sm rounded-2 mb-0 text-capitalize">
                    {role}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-dark bg-white p-2 text-sm rounded-2 mb-0 text-capitalize">
                    {user_type === 1 ? "Admin" : "General"}
                  </p>
                </>
              )}
            </div>
          </li>
          <li className="nav-item ">
            <Tooltip title="logout" color="grey">
              <button className="nav-link text-white" onClick={() => logout()}>
                <FontAwesomeIcon
                  className="nav-icon"
                  icon={faArrowRightFromBracket}
                />
              </button>
            </Tooltip>
          </li>

          <li className="nav-item ">
            <a
              className="nav-link text-white"
              data-widget="fullscreen"
              href="#"
              role="button"
            >
              <i className="fas fa-expand-arrows-alt" />
            </a>
          </li>
        </ul>
      </nav>
      {/* /.navbar */}
    </>
  );
};

export default Header;
