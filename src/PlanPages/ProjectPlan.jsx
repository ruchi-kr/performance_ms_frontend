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
  FileTextOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";
import { Link } from "react-router-dom";

const { Option } = Select;
const { Search } = Input;

const ProjectPlan = () => {
  const [allData, setAllData] = useState("");

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
                  style={{ marginTop: "3rem" }}
                  items={[
                    {
                      title: "RFT",
                      status: "finish",
                      icon: <FileTextOutlined />,
                    },
                    {
                      title: "Lost",
                      status: "finish",
                      icon: <CloseCircleOutlined />,
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
                  <div className="col-2">
                    <Link
                      to="/addprojectplan"
                      className="btn btn-sm btn-info d-flex align-items-center justify-content-center"
                    >
                      <span className="fs-4"> + </span>&nbsp;Add Plan
                    </Link>
                  </div>
                </div>
                {/* table of all stages */}
                <div className="row my-3 p-0">
                  {/* 1st table */}
                  <div className="col-4 mx-0">
                    <table
                      className="table table-bordered m-0"
                      style={{ borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th colSpan={4} className="bg-warning-subtle">
                            RFP
                          </th>
                        </tr>

                        <tr>
                          <th rowSpan={3}>S.No.</th>
                          {/* <th rowSpan={2}>Date</th> */}

                          {/* <th colSpan={5}>Activities</th> Spanning 5 columns */}
                        </tr>
                        <tr>
                          <th colSpan={3}>Module Name</th>{" "}
                          {/* Spanning 5 columns */}
                        </tr>
                        <tr>
                          <th>Task</th>
                          <th
                            className="d-flex flex-column"
                            style={{ width: "100%" }}
                          >
                            <span>Schd. Start Date</span>
                            <span>Schd. End Date</span>
                          </th>
                          <th>Alloc hrs</th>
                        </tr>
                      </thead>

                      {/* <tbody>
                    {allData.map((report, index) => {
                      const projects = JSON.parse(report.projects);
                      const firstProject = projects[0];
                      const lastProject = projects[projects.length - 1];
                      const date =
                        report.date.slice(8, 10) +
                        "/" +
                        report.date.slice(5, 7) +
                        "/" +
                        report.date.slice(0, 4);

                      console.log("stored date", date);
                      return (
                        <React.Fragment key={index}>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{date}</td>
                            <td colSpan={5}>
                              <b className="text-primary text-capitalize">
                                {firstProject.project_name}
                              </b>
                            </td>
                          </tr>
                          {projects.map((project, projectIndex) => (
                            <React.Fragment key={projectIndex}>
                              {projectIndex === 0 ||
                              project.date != lastProject.date ? null : (
                                <tr>
                                  <td></td>
                                  <td></td>
                                  <td colSpan={5}>
                                    <b className="text-primary text-capitalize">
                                      {project.project_name}
                                    </b>
                                  </td>
                                </tr>
                              )}
                              {JSON.parse(project.tasks).map(
                                (task, taskIndex) => (
                                  <tr
                                    key={`${index}-${projectIndex}-${taskIndex}`}
                                  >
                                    <td></td>
                                    <td></td>
                                    <td>{task.task}</td>
                                    <td
                                      style={
                                        task.status === "inprocess"
                                          ? { color: "orange" }
                                          : { color: "green" }
                                      }
                                    >
                                      {task.status}
                                    </td>
                                    <td>{task.allocated_time}</td>
                                    <td>{task.actual_time}</td>
                                  </tr>
                                )
                              )}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody> */}
                    </table>
                  </div>
                  {/*2nd table */}
                  <div className="col-4 mx-0">
                    <table
                      className="table table-bordered m-0"
                      style={{ borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th colSpan={4} className="bg-primary-subtle">
                            Contract Signed
                          </th>
                        </tr>
                        <tr>
                          <th rowSpan={3}>S.No.</th>
                          {/* <th rowSpan={2}>Date</th> */}

                          {/* <th colSpan={5}>Activities</th> Spanning 5 columns */}
                        </tr>
                        <tr>
                          <th colSpan={3}>Module Name</th>
                          {/* Spanning 5 columns */}
                        </tr>
                        <tr>
                          <th>Task</th>
                          <th
                            className="d-flex flex-column"
                            style={{ width: "100%" }}
                          >
                            <span>Schd. Start Date</span>
                            <span>Schd. End Date</span>
                          </th>
                          <th>Alloc hrs</th>
                        </tr>
                      </thead>

                      {/* <tbody>
                    {allData.map((report, index) => {
                      const projects = JSON.parse(report.projects);
                      const firstProject = projects[0];
                      const lastProject = projects[projects.length - 1];
                      const date =
                        report.date.slice(8, 10) +
                        "/" +
                        report.date.slice(5, 7) +
                        "/" +
                        report.date.slice(0, 4);

                      console.log("stored date", date);
                      return (
                        <React.Fragment key={index}>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{date}</td>
                            <td colSpan={5}>
                              <b className="text-primary text-capitalize">
                                {firstProject.project_name}
                              </b>
                            </td>
                          </tr>
                          {projects.map((project, projectIndex) => (
                            <React.Fragment key={projectIndex}>
                              {projectIndex === 0 ||
                              project.date != lastProject.date ? null : (
                                <tr>
                                  <td></td>
                                  <td></td>
                                  <td colSpan={5}>
                                    <b className="text-primary text-capitalize">
                                      {project.project_name}
                                    </b>
                                  </td>
                                </tr>
                              )}
                              {JSON.parse(project.tasks).map(
                                (task, taskIndex) => (
                                  <tr
                                    key={`${index}-${projectIndex}-${taskIndex}`}
                                  >
                                    <td></td>
                                    <td></td>
                                    <td>{task.task}</td>
                                    <td
                                      style={
                                        task.status === "inprocess"
                                          ? { color: "orange" }
                                          : { color: "green" }
                                      }
                                    >
                                      {task.status}
                                    </td>
                                    <td>{task.allocated_time}</td>
                                    <td>{task.actual_time}</td>
                                  </tr>
                                )
                              )}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody> */}
                    </table>
                  </div>
                  {/* 3rd table */}
                  <div className="col-4 mx-0">
                    <table
                      className="table table-bordered p-0"
                      style={{ borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th colSpan={4} className="bg-success-subtle">
                            In Process
                          </th>
                        </tr>
                        <tr>
                          <th rowSpan={3}>S.No.</th>
                          {/* <th rowSpan={2}>Date</th> */}

                          {/* <th colSpan={5}>Activities</th> Spanning 5 columns */}
                        </tr>
                        <tr>
                          <th colSpan={3}>Module Name</th>{" "}
                          {/* Spanning 5 columns */}
                        </tr>
                        <tr>
                          <th>Task</th>
                          <th
                            className="d-flex flex-column"
                            style={{ width: "100%" }}
                          >
                            <span>Schd. Start Date</span>
                            <span>Schd. End Date</span>
                          </th>
                          <th>Alloc hrs</th>
                        </tr>
                      </thead>

                      {/* <tbody>
                    {allData.map((report, index) => {
                      const projects = JSON.parse(report.projects);
                      const firstProject = projects[0];
                      const lastProject = projects[projects.length - 1];
                      const date =
                        report.date.slice(8, 10) +
                        "/" +
                        report.date.slice(5, 7) +
                        "/" +
                        report.date.slice(0, 4);

                      console.log("stored date", date);
                      return (
                        <React.Fragment key={index}>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{date}</td>
                            <td colSpan={5}>
                              <b className="text-primary text-capitalize">
                                {firstProject.project_name}
                              </b>
                            </td>
                          </tr>
                          {projects.map((project, projectIndex) => (
                            <React.Fragment key={projectIndex}>
                              {projectIndex === 0 ||
                              project.date != lastProject.date ? null : (
                                <tr>
                                  <td></td>
                                  <td></td>
                                  <td colSpan={5}>
                                    <b className="text-primary text-capitalize">
                                      {project.project_name}
                                    </b>
                                  </td>
                                </tr>
                              )}
                              {JSON.parse(project.tasks).map(
                                (task, taskIndex) => (
                                  <tr
                                    key={`${index}-${projectIndex}-${taskIndex}`}
                                  >
                                    <td></td>
                                    <td></td>
                                    <td>{task.task}</td>
                                    <td
                                      style={
                                        task.status === "inprocess"
                                          ? { color: "orange" }
                                          : { color: "green" }
                                      }
                                    >
                                      {task.status}
                                    </td>
                                    <td>{task.allocated_time}</td>
                                    <td>{task.actual_time}</td>
                                  </tr>
                                )
                              )}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody> */}
                    </table>
                  </div>
                </div>

                {/* for testing table */}
                <div className="col-12 mx-0">
                  <table
                    className="table table-bordered p-0"
                    style={{ borderCollapse: "collapse" }}
                  >
                    {/* <thead>
                        <tr>
                          <th colSpan={4} className="bg-success-subtle">RFP</th>
                          <th colSpan={4} className="bg-success-subtle">Contract Signed</th>
                          <th colSpan={4} className="bg-success-subtle">In Process</th>

                        </tr>
                        <tr>
                          <th rowSpan={3}>S.No.</th>
                        </tr>
                        <tr>
                          <th colSpan={3}>Module Name</th>
                        </tr>
                        <tr>
                          <th>Task</th>
                          <th
                            className="d-flex flex-column"
                            style={{ width: "100%" }}
                          >
                            <span>Schd. Start Date</span>
                            <span>Schd. End Date</span>
                          </th>
                          <th>Alloc hrs</th>
                        </tr>
                        
                </thead>*/}
                    <thead>
                      <tr>
                        <th colSpan={4} className="bg-success-subtle">
                          RFP
                        </th>
                        <th colSpan={4} className="bg-success-subtle">
                          Contract Signed
                        </th>
                        <th colSpan={4} className="bg-success-subtle">
                          In Process
                        </th>
                      </tr>
                      <tr>
                        <th rowSpan={3}>S.No.</th>
                        <th colSpan={3}>Module Name</th>
                        <th rowSpan={3}>S.No.</th>

                        <th colSpan={3}>Module Name</th>
                        <th rowSpan={3}>S.No.</th>

                        <th colSpan={3}>Module Name</th>
                      </tr>
                      <tr>
                        <th >Task</th>
                        <th>
                          <div className="d-flex flex-column">
                            <span>Schd. Start Date</span>
                            <span>Schd. End Date</span>
                          </div>
                        </th>
                        <th>Alloc hrs</th>

                        <th >Task</th>
                        <th>
                          <div className="d-flex flex-column">
                            <span>Schd. Start Date</span>
                            <span>Schd. End Date</span>
                          </div>
                        </th>
                        <th>Alloc hrs</th>

                        <th >Task</th>
                        <th>
                          <div className="d-flex flex-column">
                            <span>Schd. Start Date</span>
                            <span>Schd. End Date</span>
                          </div>
                        </th>
                        <th>Alloc hrs</th>
                      </tr>
                    {/*  <tr>
                       
                        <th>
                          <div className="d-flex flex-column">
                            <span>Schd. Start Date</span>
                            <span>Schd. End Date</span>
                          </div>
                        </th>
                        <th>
                          <div className="d-flex flex-column">
                            <span>Schd. Start Date</span>
                            <span>Schd. End Date</span>
                          </div>
                        </th>
                        <th>Status</th>
                        <th>Status</th>
                        <th>Status</th>
                        <th>Alloc hrs</th>
                        <th>Alloc hrs</th>
                        <th>Alloc hrs</th>
                      </tr>  */}
                    </thead>
                    {/* <tbody>
                    {allData.map((report, index) => {
                      const projects = JSON.parse(report.projects);
                      const firstProject = projects[0];
                      const lastProject = projects[projects.length - 1];
                      const date =
                        report.date.slice(8, 10) +
                        "/" +
                        report.date.slice(5, 7) +
                        "/" +
                        report.date.slice(0, 4);

                      console.log("stored date", date);
                      return (
                        <React.Fragment key={index}>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{date}</td>
                            <td colSpan={5}>
                              <b className="text-primary text-capitalize">
                                {firstProject.project_name}
                              </b>
                            </td>
                          </tr>
                          {projects.map((project, projectIndex) => (
                            <React.Fragment key={projectIndex}>
                              {projectIndex === 0 ||
                              project.date != lastProject.date ? null : (
                                <tr>
                                  <td></td>
                                  <td></td>
                                  <td colSpan={5}>
                                    <b className="text-primary text-capitalize">
                                      {project.project_name}
                                    </b>
                                  </td>
                                </tr>
                              )}
                              {JSON.parse(project.tasks).map(
                                (task, taskIndex) => (
                                  <tr
                                    key={`${index}-${projectIndex}-${taskIndex}`}
                                  >
                                    <td></td>
                                    <td></td>
                                    <td>{task.task}</td>
                                    <td
                                      style={
                                        task.status === "inprocess"
                                          ? { color: "orange" }
                                          : { color: "green" }
                                      }
                                    >
                                      {task.status}
                                    </td>
                                    <td>{task.allocated_time}</td>
                                    <td>{task.actual_time}</td>
                                  </tr>
                                )
                              )}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody> */}
                  </table>
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
