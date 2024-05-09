import React, { useState, useEffect } from "react";
import SideNavbar from "../Components/SideNavbar.jsx";
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import {} from "../Config.js";
import axios from "axios";
import { toast } from "react-toastify";
import { Col, Form, Input, Modal, Row, Select } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { Steps } from "antd";

const { Option } = Select;
const { Search } = Input;

const ProjectPlan = () => {
  const openAdd = () => {};

  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            {/* 1st row */}
            <div className="row my-5">
              <div className="col-11 mx-auto">
                {/* reporting manager master detailed table */}
                <div className="d-flex justify-content-between">
                  <h3 className="text-primary">Project Plan</h3>
                </div>
                <hr className="bg-primary border-4" />
                <div className=" col-2 flex-end">
                  <label className="text-capitalize fw-bold text-info">
                    Select Project
                  </label>
                </div>
                {/* stage display  */}
                <Steps
                style={{marginTop:"3rem"}}
                  items={[
                    {
                      title: "RFT",
                      status: "finish",
                      icon: <FileTextOutlined />,
                    },
                    {
                      title:"Lost",
                      status:"finish",
                      icon:<CloseCircleOutlined />,
                    },
                    {
                      title: "Won",
                      status: "inprocess",
                      icon: <CheckCircleOutlined />,
                    },
                    {
                      title: "In Process",
                      status: "wait",
                      icon: <LoadingOutlined />,
                    },
                    {
                      title: "Completed",
                      status: "wait",
                      icon: <SmileOutlined />,
                    },
                  ]}
                />
                
                {/* add project row */}
                <div className="row my-4">
                  <div className="col-11">
                    <button
                      className="btn btn-sm btn-info d-flex align-items-center"
                      onClick={openAdd}
                    >
                      <span className="fs-4"> + </span>&nbsp;Add Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProjectPlan;
