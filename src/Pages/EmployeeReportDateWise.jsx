import React, { useEffect, useState } from 'react'
import axios from 'axios';
import SideNavbar from '../Components/SideNavbar'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

const EmployeeReportDateWise = () => {
    return (
        <>
            <Header />
            <SideNavbar />
            <div className="content-wrapper bg-white">
                <div className="content">
                    <div className="container-fluid bg-white">
                        {/* row 1 with heading */}
                        <div className="row mt-5">
                            <div className="col-11 mx-auto">
                                <h3 className='text-primary'>Date-wise Reports</h3>
                                <hr className='bg-primary border-4' />
                            </div>
                        </div>
                        {/* row 2 with table */}
                        <div className="row">
                            <div className="col-11 mx-auto">
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default EmployeeReportDateWise