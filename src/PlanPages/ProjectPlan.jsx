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
  getProjectPlan,
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

  const[moduleStage, setModuleStage] = useState("");

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
        projectStage === "rfp"
          ? "process"
          : projectStage === "inprocess" ||
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
        projectStage === "won"
          ? "process"
          : projectStage === "completed" || projectStage === "inprocess"
          ? "finish"
          : "wait",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "In Process",
      status:
        projectStage === "inprocess"
          ? "process"
          : projectStage === "completed"
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

  // project plan w.r.t stage
  const getProjectPlanData = async () => {
    try {
      const response = await axios.get(
        `${getProjectPlan}/${selectedProjectId}`
      );
      setAllData(response.data.plan);
      console.log("project plan data", response.data.plan);
    } catch (error) {
      console.log("Error fetching project plan data", error);
    }
  };

  useEffect(() => {
    getProjectPlanData();
  }, [selectedProjectId]);

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
                    style={{ width: "28rem" }}
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
                            <th colSpan={1}>Module Name</th>
                            <th colSpan={2}>
                              <div className="d-flex flex-column">
                                <span>Schd. Start Date</span>
                                <span>Schd. End Date</span>
                              </div>
                            </th>

                            <th rowSpan={3}>S.No.</th>
                            <th colSpan={1}>Module Name</th>
                            <th colSpan={2}>
                              <div className="d-flex flex-column">
                                <span>Schd. Start Date</span>
                                <span>Schd. End Date</span>
                              </div>
                            </th>

                            <th rowSpan={3}>S.No.</th>
                            <th colSpan={1}>Module Name</th>
                            <th colSpan={2}>
                              <div className="d-flex flex-column">
                                <span>Schd. Start Date</span>
                                <span>Schd. End Date</span>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th colSpan={2}>Task</th>

                            <th>Alloc hrs</th>

                            <th colSpan={2}>Task</th>

                            <th>Alloc hrs</th>

                            <th colSpan={2}>Task</th>

                            <th>Alloc hrs</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allData.map((report, index) => {
                            const modules = report.modules;
                            const firstModule = modules[0];
                            const lastModule = modules[modules.length - 1];

                            const rfpModules = report.modules.filter(
                              (module) => module.stage === "rfp"
                            )

                            const wonModules = report.modules.filter(
                              (module) => module.stage === "won"
                            )

                            const inprocessModules = report.modules.filter(
                              (module) => module.stage === "inprocess"
                            )

                            return (
                              <React.Fragment key={index}>
                                {/* first stage */}
                                
                                <tr>
                                  <td>{index + 1}</td>
                                  <td colSpan={1}>
                                    <b className="text-primary text-capitalize">
                                      {firstModule.module_name}
                                    </b>
                                  </td>
                                  <td colSpan={2}>
                                    <b className="text-primary text-capitalize">
                                      {firstModule.from_date.slice(0,10)}<br/>
                                      {firstModule.to_date.slice(0,10)}
                                    </b>
                                  </td>

                                  <td>{index + 1}</td>
                                  <td colSpan={1}>
                                    <b className="text-primary text-capitalize">
                                      {firstModule.module_name}
                                    </b>
                                  </td>
                                  <td colSpan={2}>
                                    <b className="text-primary text-capitalize">
                                      {firstModule.from_date.slice(0,10)}<br/>
                                      {firstModule.to_date.slice(0,10)}
                                    </b>
                                  </td>

                                  <td>{index + 1}</td>
                                  <td colSpan={1}>
                                    <b className="text-primary text-capitalize">
                                      {firstModule.module_name}
                                    </b>
                                  </td>
                                  <td colSpan={2}>
                                    <b className="text-primary text-capitalize">
                                      {firstModule.from_date.slice(0,10)}<br/>
                                      {firstModule.to_date.slice(0,10)}
                                    </b>
                                  </td>
                                </tr>
                                {modules.map((module, moduleIndex) => (
                                  <React.Fragment key={moduleIndex}>
                                    {moduleIndex === 0 ? null : (
                                      <tr>
                                        
                                         <td>{index + 1}</td>                                      
                                        <td colSpan={2}>
                                          <b className="text-primary text-capitalize">
                                            {module.module_name}
                                          </b>
                                        </td>
                                        <td colSpan={1}>
                                          <b className="text-primary text-capitalize">
                                            {module.from_date.slice(0,10)}<br/>
                                            {module.to_date.slice(0,10)}
                                          </b>
                                        </td>

                                        <td>{index + 1}</td>                                   
                                        <td colSpan={2}>
                                          <b className="text-primary text-capitalize">
                                            {module.module_name}
                                          </b>
                                        </td>
                                        <td colSpan={1}>
                                          <b className="text-primary text-capitalize">
                                            {module.from_date.slice(0,10)}<br/>
                                            {module.to_date.slice(0,10)}
                                          </b>
                                        </td>

                                        <td>{index + 1}</td>                                       
                                        <td colSpan={2}>
                                          <b className="text-primary text-capitalize">
                                            {module.module_name}
                                          </b>
                                        </td>
                                        <td colSpan={1}>
                                          <b className="text-primary text-capitalize">
                                            {module.from_date.slice(0,10)}<br/>
                                            {module.to_date.slice(0,10)}
                                          </b>
                                        </td>
                                      </tr>
                                    )}
                                    {JSON.parse(module.tasks).map(
                                      (task, taskIndex) => (
                                        <tr
                                          key={`${index}-${moduleIndex}-${taskIndex}`}
                                        >
                                          <td></td>                                        
                                          <td colSpan={2}>{task.task_name}</td>
                                          <td>{task.allocated_time}</td>
                                          
                                          <td></td>                                      
                                          <td colSpan={2}>{task.task_name}</td>
                                          <td>{task.allocated_time}</td>

                                          <td></td>                                     
                                          <td colSpan={2}>{task.task_name}</td>
                                          <td>{task.allocated_time}</td>
                                        </tr>
                                      )
                                    )}
                                  </React.Fragment>
                                ))}

                                
                              </React.Fragment>
                            );
                          })}
                        </tbody>
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
