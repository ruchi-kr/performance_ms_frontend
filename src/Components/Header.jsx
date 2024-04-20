import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


const Header = () => {
    let [username, SetUserName] = useState('');
    useEffect(function () {
        const name = sessionStorage.getItem('name');
        SetUserName(name)
    }, [])
    const navigate = useNavigate();

    const designation_id = sessionStorage.getItem('designation_id');
    const designation_name = sessionStorage.getItem('designation');


    const logout = () => {
        sessionStorage.clear();
        { designation_id == 13 ? navigate("/clientlogin") : navigate("/login") }
        //    navigate("/login");
    }
    return (
        <>
            {/* Navbar */}
            <nav className="main-header navbar navbar-expand d-flex align-items-center bg-dark">
                {/* Left navbar links */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link text-white" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                    </li>

                </ul>
                {/* Right navbar links */}
                <ul className="navbar-nav ml-auto ">
                    {/* Navbar Search */}
                    {/* <li className='nav-item'> */}
                  

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