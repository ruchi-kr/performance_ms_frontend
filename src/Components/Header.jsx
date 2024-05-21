import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Header = () => {
    let [username, SetUserName] = useState('');
    useEffect(function () {
        const name = JSON.parse(sessionStorage.getItem('email_id'));
        SetUserName(name)
    }, [])
    const navigate = useNavigate();

    // const name = sessionStorage.getItem('username');
    const role = JSON.parse(sessionStorage.getItem('role'));
const user_type = JSON.parse(sessionStorage.getItem('user_type'));

    const logout = () => {
        sessionStorage.clear();
       
           navigate("/login");
    }
    return (
        <>
            {/* Navbar */}
            <nav className={`main-header navbar navbar-expand d-flex align-items-center bg-dark ${window.location.pathname === '/projectplan' ? 'navbar-collapse' : ''}`}>
                {/* Left navbar links */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link text-white" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                    </li>

                </ul>
                {/* Right navbar links */}
                <ul className="navbar-nav ml-auto ">
                    {/* Navbar Search */}
                    <li className="user-panel d-flex nav-item mx-lg-1 mx-0 align-items-center ">
                        {/* <div className=""> */}
                        {/* <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" /> */}
                        <Avatar
                            size={{ xs: 16, sm: 24, md: 32, lg: 32, xl: 40, xxl: 40 }}
                            icon={<UserOutlined />}
                            className='d-lg-block d-md-none d-none bg-secondary'
                        />
                        {/* </div> */}
                        <div className="info"style={{ lineHeight: '0.2' }} >
                            <p className='text-white'>{username}</p>
                            {
                                (role!=="")?
                                <>
                                 <p className='text-dark bg-white p-2 text-sm rounded-2 mb-0 text-capitalize'>{role}</p>
                                </>:
                                <>
                                 <p className='text-dark bg-white p-2 text-sm rounded-2 mb-0 text-capitalize'>{user_type === 1 ? 'Admin' : 'General'}</p>
                                </>
                            }
                           
                        </div>
                    </li>
                    <li className="nav-item ">
                        <Tooltip title="logout" color="grey">
                            <button className="nav-link text-white" onClick={() => logout()}>
                                <FontAwesomeIcon className='nav-icon' icon={faArrowRightFromBracket} />
                            </button>
                        </Tooltip>

                    </li>

                    <li className="nav-item ">
                        <a className="nav-link text-white" data-widget="fullscreen" href="#" role="button">
                            <i className="fas fa-expand-arrows-alt" />
                        </a>
                    </li>
                </ul>
            </nav>
            {/* /.navbar */}

        </>
    )
}

export default Header