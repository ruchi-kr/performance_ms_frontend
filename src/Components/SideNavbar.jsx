import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faArrowRightFromBracket,
  faUsers,
  faGear,
  faFolderOpen,
  faChevronRight,
  faAngleRight
} from "@fortawesome/free-solid-svg-icons";

import {faCircle} from "@fortawesome/free-regular-svg-icons";
const SideNavbar = () => {
  let [username, SetUserName] = useState("");
  useEffect(function () {
    const name = sessionStorage.getItem("name");
    SetUserName(name);
  }, []);

  const navigate = useNavigate();

  const user_type = sessionStorage.getItem("user_type");
  const role = JSON.parse(sessionStorage.getItem("role"));

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };
  return (
    <>
      {/* Main Sidebar Container */}
      <aside className="main-sidebar bg-dark elevation-2 mb-3">
        {/* Brand Logo */}
        {user_type == "1" ? (
          <>
            <Link
              to="/homepage"
              className="brand-link text-decoration-none  mt-4"
            >
              {/* <img src="" alt="Logo" class="brand-image img-circle elevation-3" style={{opacity: .8}}/> */}
              <span className="brand-text text-info text-wrap fw-bolder ">
                Performance Management System
              </span>
            </Link>
          </>
        ) : (
          <>
            <Link to="" className="brand-link text-decoration-none  mt-4">
              {/* <img src="" alt="Logo" class="brand-image img-circle elevation-3" style={{opacity: .8}}/> */}
              <span className="brand-text text-info text-wrap fw-bolder ">
                Performance Management System
              </span>
            </Link>
          </>
        )}

        {/* Sidebar */}
        <div className="sidebar">
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {user_type == "1" ? (
                <>
                  <li className="nav-item  btnhovergrey mt-3">
                    <Link
                      className={`nav-link text-white ${
                        window.location.pathname === "/designationmaster"
                          ? "bg-cyan"
                          : ""
                      }`}
                      to="/designationmaster"
                    >
                      <FontAwesomeIcon className="nav-icon" icon={faUsers} />
                      <p>Designation Master</p>
                    </Link>
                  </li>
                  <li className="nav-item btnhovergrey mt-3">
                    <Link
                      className={`nav-link text-white ${
                        window.location.pathname === "/jobrolemaster"
                          ? "bg-cyan"
                          : ""
                      }`}
                      to="/jobrolemaster"
                    >
                      <FontAwesomeIcon className="nav-icon" icon={faUsers} />
                      <p>Job Role Master</p>
                    </Link>
                  </li>
                  <li className="nav-item  btnhovergrey mt-3">
                    <Link
                      className={`nav-link text-white ${
                        window.location.pathname === "/employeemaster"
                          ? "bg-cyan"
                          : ""
                      }`}
                      to="/employeemaster"
                    >
                      {/* <FontAwesomeIcon className='nav-icon' icon={faFileCirclePlus} /> */}
                      <FontAwesomeIcon className="nav-icon" icon={faUsers} />
                      <p>Employee Master</p>
                    </Link>
                  </li>

                  <li className="nav-item mt-3">
                    <Link
                      className={`nav-link text-white ${
                        window.location.pathname === "/usermaster"
                          ? "bg-cyan"
                          : ""
                      }`}
                      to="/usermaster"
                    >
                      <FontAwesomeIcon className="nav-icon" icon={faUsers} />
                      <p>User Master</p>
                    </Link>
                  </li>

                  {/* <li className="nav-item btnhovergrey mt-3">
                    <Link
                      className={`nav-link text-white ${
                        window.location.pathname === "/modulemaster"
                          ? "bg-cyan"
                          : ""
                      }`}
                      to="/modulemaster"
                    >
                      <FontAwesomeIcon
                        className="nav-icon"
                        icon={faFolderOpen}
                      />
                      <p>Module Master</p>
                    </Link>
                  </li> */}
                  <li className="nav-item btnhovergrey mt-3">
                    <Link
                      className={`nav-link text-white ${
                        window.location.pathname === "/projectmaster"
                          ? "bg-cyan"
                          : ""
                      }`}
                      to="/projectmaster"
                    >
                      <FontAwesomeIcon
                        className="nav-icon"
                        icon={faFolderOpen}
                      />
                      <p>Project Master</p>
                    </Link>
                  </li>

                  {/* <li className="nav-item btnhovergrey mt-3">
                    <NavLink
                      className={`nav-link text-white text-decoration-none ${
                        window.location.pathname ===
                        `/projectplan/:project_id=null`
                          ? "bg-cyan"
                          : ""
                      }`}
                      to="/projectplan/?project_id=null"
                      // onClick={()=>{ window.location.href = "/projectplan/?project_id=null";}}
                    >
                      <FontAwesomeIcon
                        className="nav-icon"
                        icon={faFolderOpen}
                      />
                      <p>Project Plan</p>
                    </NavLink>
                  </li> */}
                  <li className="nav-item btnhovergrey mt-3">
                    <Link
                      className={`nav-link text-white text-decoration-none ${
                        window.location.pathname === `/systemsettings/`
                          ? "bg-cyan"
                          : ""
                      }`}
                      to="/systemsettings"
                    >
                      <FontAwesomeIcon className="nav-icon" icon={faGear} />
                      <p>System Settings</p>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {role === "employee" ? (
                    <>
                      <li className="nav-item btnhovergrey mt-3">
                        <Link
                          className={`nav-link text-white ${
                            window.location.pathname === "/plan"
                              ? "bg-cyan"
                              : ""
                          }`}
                          to="/plan"
                        >
                          <FontAwesomeIcon
                            className="nav-icon"
                            icon={faFolderOpen}
                          />
                          <p>Plan Sheet</p>
                        </Link>
                      </li>
                      <li className="nav-item btnhovergrey mt-3">
                        <Link
                          className={`nav-link text-white ${
                            window.location.pathname === "/dts"
                              ? "bg-cyan"
                              : ""
                          }`}
                          to="/dts"
                        >
                          <FontAwesomeIcon
                            className="nav-icon"
                            icon={faFolderOpen}
                          />
                          <p>Daily Tracking Sheet</p>
                        </Link>
                      </li>
                      <li className="nav-item btnhovergrey mt-3">
                        <div className="nav-link text-white">
                          <FontAwesomeIcon
                            className="nav-icon"
                            icon={faFolderOpen}
                          />
                          <p>Reports</p>
                          {/* <i className="fas fa-angle-left right"></i> */}
                          {/* <FontAwesomeIcon icon={faAngleRight} className="right"/> */}
                        </div>
                        <ul className="mt-3 nav ">
                        {/* className="nav nav-treeview mt-3" */}
                        <div>
                          <li className="nav-item">
                            <Link
                              className={`nav-link text-white ${
                                window.location.pathname ===
                                "/reportproject-wise"
                                  ? "bg-cyan"
                                  : ""
                              }`}
                              to="/reportproject-wise"
                            >
                              {/* <i className="far fa-circle nav-icon" /> */}
                              <FontAwesomeIcon icon={faCircle} className="nav-icon"/>
                              <p>Project-wise</p>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              to="/reportdate-wise"
                              className={`nav-link text-white ${
                                window.location.pathname === "/reportdate-wise"
                                  ? "bg-cyan"
                                  : ""
                              }`}
                            >
                              {/* <i className="far fa-circle nav-icon" /> */}
                              <FontAwesomeIcon icon={faCircle} className="nav-icon"/>
                              <p>Date-wise</p>
                            </Link>
                          </li>
                        </div>
                        </ul>
                      </li>
                      <li className="nav-item fixed-bottom ">
                        <button
                          className="nav-link text-white text-left"
                          onClick={() => logout()}
                        >
                          <FontAwesomeIcon
                            className="nav-icon"
                            icon={faArrowRightFromBracket}
                          />
                          <p>Logout</p>
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="nav-item btnhovergrey mt-3">
                        <Link
                          className={`nav-link text-white ${
                            window.location.pathname === "/assignteam"
                              ? "bg-cyan"
                              : ""
                          }`}
                          to="/assignteam"
                        >
                          <FontAwesomeIcon
                            className="nav-icon"
                            icon={faFolderOpen}
                          />
                          <p>Team</p>
                        </Link>
                      </li>
                      <li className="nav-item btnhovergrey mt-3">
                        <NavLink
                          className={`nav-link text-white text-decoration-none ${
                            window.location.pathname ===
                            "/projectplan/:project_id=null"
                              ? "bg-cyan"
                              : ""
                          }`}
                         
                          to="/projectplan/?project_id=null"
                          // onClick={()=>{ window.location.href = "/projectplan/?project_id=null";}}
                        >
                          <FontAwesomeIcon
                            className="nav-icon"
                            icon={faFolderOpen}
                          />
                          <p>Project Plan</p>
                        </NavLink>
                      </li>
                      {/* <li className="nav-item btnhovergrey mt-3">
                                                    <Link className={`nav-link text-white ${window.location.pathname === '' ? 'bg-cyan' : ''}`} to="/manager/report/project">
                                                        <FontAwesomeIcon className='nav-icon' icon={faFolderOpen} />
                                                        <p>Reports</p>
                                                    </Link>
                                                </li> */}
                      <li className="nav-item btnhovergrey mt-3">
                        <div className="nav-link text-white">
                          <FontAwesomeIcon
                            className="nav-icon"
                            icon={faFolderOpen}
                          />
                          <p>Reports</p>
                          {/* <i className="fas fa-angle-left right"></i> */}
                          {/* <FontAwesomeIcon icon={faAngleRight} className="right"/> */}
                        </div>
                        <ul className="nav mt-3">
                        <div>
                          <li className="nav-item">
                            <Link
                              className={`nav-link text-white ${
                                window.location.pathname ===
                                "/manager/report/project"
                                  ? "bg-cyan"
                                  : ""
                              }`}
                              to="/manager/report/project"
                            >
                              <FontAwesomeIcon icon={faCircle} className="nav-icon"/>
                              <p>Project Report</p>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              className={`nav-link text-white ${
                                window.location.pathname === "/manager/report/project/detailed"
                                  ? "bg-cyan"
                                  : ""
                              }`}
                              to="/manager/report/project/detailed"
                            >
                             <FontAwesomeIcon icon={faCircle} className="nav-icon"/>
                              <p>Project Detailed Report</p>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              className={`nav-link text-white ${
                                window.location.pathname === "/manager/report/employee"
                                  ? "bg-cyan"
                                  : ""
                              }`}
                              to="/manager/report/employee"
                            >
                              <FontAwesomeIcon icon={faCircle} className="nav-icon"/>
                              <p>Employee Detailed Report</p>
                            </Link>
                          </li>
                        </div>
                        </ul>
                      </li>
                     
                      <li className="nav-item fixed-bottom ">
                        <button
                          className="nav-link text-white text-left"
                          onClick={() => logout()}
                        >
                          <FontAwesomeIcon
                            className="nav-icon"
                            icon={faArrowRightFromBracket}
                          />
                          <p>Logout</p>
                        </button>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </>
  );
};

export default SideNavbar;
