import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faArrowRightFromBracket,
  faBars,
  faMaximize,
} from "@fortawesome/free-solid-svg-icons";
import { Avatar,Upload, message  } from "antd";
import { useDispatch } from "react-redux";
import { UserOutlined,PlusOutlined,EditOutlined } from "@ant-design/icons";
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

    // setTimeout(function () {
    //   window.location.reload();
    //   console.log("reload");
    // }, 100);
    navigate("/login");
  };

  // for uploading the profile image
  const avatar = (
    <Avatar
      size={{ xs: 16, sm: 24, md: 32, lg: 32, xl: 40, xxl: 40 }}
      className="d-lg-block d-md-none d-none bg-info"
    >
      {initial}
    </Avatar>
  );
  const [avatarUrl, setAvatarUrl] = useState('');

  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = async info => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      // Update the avatar URL after successful upload
      setAvatarUrl(info.file.response.data.url);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
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
            <div
              className="nav-link text-white"
              data-widget="pushmenu"
              role="button"
            >
             <FontAwesomeIcon icon={faBars} />
            </div>
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
            <div>
            {/* <Avatar
              size={{ xs: 16, sm: 24, md: 32, lg: 32, xl: 40, xxl: 40 }}
              className="d-lg-block d-md-none d-none bg-info"
            >
              {initial}
            </Avatar> */}
            <Upload
      name="avatar"
      listType="picture"
      showUploadList={false}
      action="http://localhost:8000/api/uploadprofile" // Replace with your API endpoint
      beforeUpload={beforeUpload}
      onChange={handleChange}
      accept=".jpg,.jpeg,.png"
      maxCount={1}
    >
      {avatarUrl ? (
        <Avatar size={64} src={avatarUrl} />
      ) : (
        <Avatar
        size={{ xs: 16, sm: 24, md: 32, lg: 32, xl: 40, xxl: 40 }}
        className="d-lg-block d-md-none d-none bg-info"
        // icon={<PlusOutlined className="text-xs"/>}
      >
        <div className="d-flex align-items-center justify-content-center flex-column">
        {initial}
        {/* <EditOutlined className="text-xs"/> */}
          </div>
      </Avatar>
      )}
    </Upload>
            </div>
            
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
            <div
              className="nav-link text-white"
              data-widget="fullscreen"
              role="button"
            >
              <FontAwesomeIcon icon={faMaximize} />
            </div>
          </li>
        </ul>
      </nav>
      {/* /.navbar */}
    </>
  );
};

export default Header;
