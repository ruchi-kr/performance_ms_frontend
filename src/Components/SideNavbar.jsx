import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faArrowRightFromBracket, faUsers, faFolderOpen } from '@fortawesome/free-solid-svg-icons'

const SideNavbar = () => {
    let [username, SetUserName] = useState('');
    useEffect(function () {
        const name = sessionStorage.getItem('name');
        SetUserName(name)
    }, [])

    const navigate = useNavigate();

    const user_type = sessionStorage.getItem('user_type');


    const logout = () => {
        sessionStorage.clear();
        navigate("/login");
    }
    return (
        <>
            {/* Main Sidebar Container */}
            <aside className="main-sidebar bg-dark elevation-2 mb-3 ">
                {/* Brand Logo */}
                {
                    (user_type == "1") ?
                        <>

                            <Link to="/homepage" className="brand-link text-decoration-none  mt-4">
                                {/* <img src="" alt="Logo" class="brand-image img-circle elevation-3" style={{opacity: .8}}/> */}
                                <span class="brand-text text-info text-wrap fw-bolder ">Performance Management System</span>
                            </Link>
                        </>
                        :
                        <>

                            <Link to="" className="brand-link text-decoration-none  mt-4">
                                {/* <img src="" alt="Logo" class="brand-image img-circle elevation-3" style={{opacity: .8}}/> */}
                                <span class="brand-text text-info text-wrap fw-bolder ">Performance Management System</span>
                            </Link>
                        </>
                }




                {/* Sidebar */}
                <div className="sidebar">


                    <nav className="mt-2">

                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">


                            {
                                (user_type == "1") ?
                                    <>
                                        <li className="nav-item btnhovergrey mt-3">
                                            <Link className={`nav-link text-white ${window.location.pathname === '/projectmaster' ? 'bg-cyan' : ''}`} to="/projectmaster">
                                                <FontAwesomeIcon className='nav-icon' icon={faFolderOpen} />
                                                <p>Project Master</p>
                                            </Link>
                                        </li>

                                        <li className="nav-item  btnhovergrey mt-3">
                                            <Link className={`nav-link text-white ${window.location.pathname === '/employeemaster' ? 'bg-cyan' : ''}`} to="/employeemaster">
                                                {/* <FontAwesomeIcon className='nav-icon' icon={faFileCirclePlus} /> */}
                                                <FontAwesomeIcon className='nav-icon' icon={faUsers} />
                                                <p>Employee Master</p>

                                            </Link>
                                        </li>


                                        <li className="nav-item mt-3">
                                            <Link className={`nav-link text-white ${window.location.pathname === '/usermaster' ? 'bg-cyan' : ''}`} to="/usermaster">
                                                <FontAwesomeIcon className='nav-icon' icon={faUsers} />
                                                <p>
                                                    User Master
                                                </p>
                                            </Link>
                                        </li>
                                        <li className="nav-item  btnhovergrey mt-3">
                                            <Link className={`nav-link text-white ${window.location.pathname === '/rmmaster' ? 'bg-cyan' : ''}`} to="/rmmaster">
                                                <FontAwesomeIcon className='nav-icon' icon={faUsers} />
                                                <p>RM Master</p>

                                            </Link>
                                        </li>




                                    </>
                                    :
                                    <>
                                        <li className="nav-item fixed-bottom ">
                                            <button className="nav-link text-white text-left" onClick={() => logout()}>
                                                <FontAwesomeIcon className='nav-icon' icon={faArrowRightFromBracket} />
                                                <p>Logout</p>
                                            </button>
                                        </li>
                                    </>
                            }

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