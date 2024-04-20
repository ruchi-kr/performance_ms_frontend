import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SideNavbar = () => {
    let [username, SetUserName] = useState('');
    useEffect(function () {
        const name = sessionStorage.getItem('name');
        SetUserName(name)
    }, [])

    const navigate = useNavigate();

    const designation_id = sessionStorage.getItem('designation_id');


    const logout = () => {
        sessionStorage.clear();
           navigate("/login");
    }
    return (
        <>
            {/* Main Sidebar Container */}
            <aside className="main-sidebar bg-dark elevation-2 mb-3">
                {/* Brand Logo */}
                <Link to="" className="brand-link text-decoration-none">
                    {/* <img src="" alt="Logo" class="brand-image img-circle elevation-3" style={{opacity: .8}}/> */}
                        <span class="brand-text font-weight-light text-white text-wrap">Performance Management System</span>
                </Link>
              


                {/* Sidebar */}
                <div className="sidebar">
                   

                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
                            <li className="nav-item btnhovergrey mt-3">
                                {/* <a href="#" > */}

                                    <Link className={`nav-link text-white ${window.location.pathname === '/projectmaster' ? 'bg-cyan' : ''}`} to="/projectmaster">
   
                                        <i className="nav-icon fas fa-tachometer-alt" />
                                        <p>Project Master</p>

                                    </Link>
                                {/* </a> */}

                            </li>
                         
                                        <li className="nav-item  btnhovergrey mt-3">
                                            <Link className={`nav-link text-white ${window.location.pathname === '/employeemaster' ? 'bg-cyan' : ''}`} to="/employeemaster">
                                                {/* <FontAwesomeIcon className='nav-icon' icon={faFileCirclePlus} /> */}
                                                <p>Employee Master</p>

                                            </Link>
                                        </li>
                            

                                    <li className="nav-item mt-3">
                                    <Link className={`nav-link text-white ${window.location.pathname === '/usermaster' ? 'bg-cyan' : ''}`} to="/usermaster">
                                        {/* <FontAwesomeIcon className='nav-icon' icon={faFileLines} /> */}
                                        <p>
                                        User Master
                                        </p>
                                    </Link>
                                  </li>
                                  <li className="nav-item  btnhovergrey mt-3">
                                            <Link className={`nav-link text-white ${window.location.pathname === '/rmmaster' ? 'bg-cyan' : ''}`} to="/rmmaster">
                                                {/* <FontAwesomeIcon className='nav-icon' icon={faFileCirclePlus} /> */}
                                                <p>RM Master</p>

                                            </Link>
                                        </li>
                                     

                            {/* <li className="nav-item fixed-bottom ">
                                <button className="nav-link text-white text-left" onClick={() => logout()}>
                                    <FontAwesomeIcon className='nav-icon' icon={faArrowRightFromBracket} />
                                    <p>Logout</p>
                                </button>
                            </li> */}

                        </ul>
                    </nav>
                    {/* /.sidebar-menu */}
                </div>
                {/* /.sidebar */}
            </aside>

        </>
    )
}

export default SideNavbar