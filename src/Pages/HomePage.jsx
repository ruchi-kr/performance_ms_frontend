import React, { useState,useEffect } from 'react'
import axios from 'axios';
import SideNavbar from '../Components/SideNavbar'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { getDashData } from '../Config'

const HomePage = () => {

  const [dashProjectData, setDashProjectData] = useState("");
  const [dashUserData, setDashUserData] = useState("");
  const [dashEmployeeData, setDashEmployeeData] = useState("");
  const [dashRMData, setDashRMData] = useState("");
  const getAllDashData = async () => {
    try {
      const response = await axios.get(`${getDashData }`);
      console.log("dash data", response.data);
      setDashProjectData(response.data.projectCount);
      setDashUserData(response.data.userCount);
      setDashEmployeeData(response.data.employeeCount);
      setDashRMData(response.data.reportingManagerCount);

    } catch (error) {
      console.log("error fetching dash data", error)
    }

  }

  useEffect(() => {
    getAllDashData();
  }, [])



  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            <div className="row">
              <h4 className='text-center text-info my-5'>Welcome to Performance Management System</h4>
            </div>

            <div className="row">
              <div className="col-3">
                <div className="card">
                  <div className="card-header">
                    <h2>{dashProjectData}</h2>
                    <h3 className="card-title">Projects</h3>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="card">
                  <div className="card-header">
                  <h2>{dashEmployeeData}</h2>
                    <h3 className="card-title">Employees</h3>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="card">
                  <div className="card-header">
                  <h2>{dashUserData}</h2>
                    <h3 className="card-title">Users</h3>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="card">
                  <div className="card-header">
                    <h2>{dashRMData}</h2>
                    <h3 className="card-title">Reporting Managers</h3>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default HomePage