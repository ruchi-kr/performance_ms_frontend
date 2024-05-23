import React, { useState,useEffect } from 'react'
import axios from 'axios';
import SideNavbar from '../Components/SideNavbar'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { CONFIG_OBJ, getDashData } from '../Config'

const HomePage = () => {

  const [dashProjectData, setDashProjectData] = useState("");
  // const [dashUserData, setDashUserData] = useState("");
  const [dashEmployeeData, setDashEmployeeData] = useState("");
  const [dashRMData, setDashRMData] = useState("");
  const getAllDashData = async () => {
    try {
      const response = await axios.get(`${getDashData }`,CONFIG_OBJ);
      console.log("dash data", response.data[0]);
      setDashProjectData(response.data[0].projectCount);
      // setDashUserData(response.data.userCount);
      setDashEmployeeData(response.data[0].teamMemberCount);
      setDashRMData(response.data[0].managerCount);

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
              <div className="col-4">
                <div className="card customcard">
                  <div className="card-header">
                    <h2>{dashProjectData}</h2>
                    <h3 className="card-title">Projects</h3>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card customcard">
                  <div className="card-header">
                    <h2>{dashRMData}</h2>
                    <h3 className="card-title">Reporting Managers</h3>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card customcard">
                  <div className="card-header">
                  <h2>{dashEmployeeData}</h2>
                    <h3 className="card-title">Team Members</h3>
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