import React, { useState, useEffect } from "react";
import SideNavbar from "../Components/SideNavbar.jsx";
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import { NavLink } from "react-router-dom";
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
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  getAllModules,
  createModule,
  editModule,
  deleteModule,
  getAllProjects,
} from "../Config.js";
import { Steps } from "antd";
import { Link } from "react-router-dom";
import { render } from "@testing-library/react";

const { Option } = Select;
const { Search } = Input;

const ProjectPlan = () => {
  const [allData, setAllData] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectStage, setSelectedProjectStage] = useState(null);
  const [projectStage, setProjectStage] = useState(null);

  const getProjects = async (value) => {
    try {
      const result = await axios.get(`${getAllProjects}`);

      setProjectList(result.data);
      console.log("project list", result.data);
    } catch (error) {
      console.log("Error fetching project list data", error);
    }
  };
  useEffect(() => {
    getProjects();
  }, []);
  const projectChangeHandler = (value) => {
    console.log(" projetc value", value);
    setSelectedProjectId(value);
  };
  console.log("selected project id", selectedProjectId);

  useEffect(() => {
    const fetchProjectDetails = async (selectedProjectId) => {
      try {
        const response = await axios.get(
          `${getAllProjects}/${selectedProjectId}`
        );
        setProjectStage(response.data[0].stage);
        setSelectedProjectStage(response.data[0].stage);
        console.log("Project stage:", response.data[0].stage);
      } catch (error) {
        console.log("Error fetching project details", error);
      }
    };

    if (selectedProjectId) {
      fetchProjectDetails(selectedProjectId);
    }
  }, [selectedProjectId]);

  let items = [
    {
      title: "RFP",
      status:
        projectStage === "rfp" ? "process":
        projectStage === "inprocess" ||
        projectStage === "won" ||
        projectStage === "completed" ||
        projectStage === "lost"
          ? "finish"
          : "wait",
      icon: <FileTextOutlined />,
    },
    {
      title: "Lost",
      status: projectStage === "lost" ? "process" : "wait",
      icon: <CloseCircleOutlined />,
    },
    {
      title: "Won",
      status:
        projectStage === "won" ? "process":
        projectStage === "completed" ||
        projectStage === "inprocess"
          ? "finish"
          : "wait",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "In Process",
      status:
        projectStage === "inprocess" ? "process":
         projectStage === "completed"
          ? "finish"
          : "wait",
      icon:
        projectStage === "inprocess" ? (
          // <LoadingOutlined />
          <ClockCircleOutlined />
        ) : (
          <SolutionOutlined />
        ),
    },
    {
      title: "Completed",
      status: projectStage === "completed" ? "finish" : "wait",
      icon: <SmileOutlined />,
    },
  ];

  // If project stage is "won", remove the "Lost" step
  if (
    projectStage === "won" ||
    projectStage === "inprocess" ||
    projectStage === "completed"
  ) {
    items = items.filter((item) => item.title !== "Lost");
  }

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
                <div className=" col-2 d-flex flex-column">
                  <label className="text-capitalize fw-bold text-info">
                    Select Project
                  </label>
                  <Select
                    allowClear={true}
                    onChange={projectChangeHandler}
                    placeholder="Select Project"
                    style={{ width: "100%" }}
                  >
                    {projectList.map((project) => (
                      <Option
                        key={project.project_id}
                        value={project.project_id}
                      >
                        {project.project_name}
                      </Option>
                    ))}
                  </Select>
                </div>

                {selectedProjectId ? (
                  <>
                    {/* stage display  */}

                    <Steps style={{ marginTop: "3rem" }}>
                    
                      {items.map((item, index) => (
                        <Steps
                          key={item.title}
                          title={item.title}
                          status={item.status}
                          icon={item.icon}
                          
                        />
                      ))}
                    </Steps>
                  

                    {/* add project row */}
                    <div className="row my-4">
                      <div className="col-2">
                        <NavLink
                          to={`/addprojectplan/?project_id=${selectedProjectId}&stage=${selectedProjectStage}`}
                          className="btn btn-sm btn-info d-flex align-items-center justify-content-center"
                        >
                          <span className="fs-4"> + </span>&nbsp;Add Plan
                        </NavLink>
                      </div>
                    </div>

                    {/* project plan table for 3 stages */}
                    <div className="col-12 mx-0">
                      <table
                        className="table table-bordered p-0"
                        style={{ borderCollapse: "collapse" }}
                      >
                        <thead>
                          <tr>
                            <th colSpan={4} className="bg-warning-subtle">
                              RFP
                            </th>
                            <th colSpan={4} className="bg-primary-subtle">
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
                            <th>Task</th>
                            <th>
                              <div className="d-flex flex-column">
                                <span>Schd. Start Date</span>
                                <span>Schd. End Date</span>
                              </div>
                            </th>
                            <th>Alloc hrs</th>

                            <th>Task</th>
                            <th>
                              <div className="d-flex flex-column">
                                <span>Schd. Start Date</span>
                                <span>Schd. End Date</span>
                              </div>
                            </th>
                            <th>Alloc hrs</th>

                            <th>Task</th>
                            <th>
                              <div className="d-flex flex-column">
                                <span>Schd. Start Date</span>
                                <span>Schd. End Date</span>
                              </div>
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
                  </>
                ) : (
                  <>
                    <h3 className="text-center text-primary my-5">
                      Select Project First
                    </h3>
                  </>
                )}
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
