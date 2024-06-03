import React, { useState, useEffect } from "react";
import SideNavbar from "../Components/SideNavbar.jsx";
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import {
  NavLink,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import {} from "../Config.js";
import axios from "axios";
import { toast } from "react-toastify";
import { Col, Form, Input, Modal, Row, Select } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined,LeftCircleOutlined } from "@ant-design/icons";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ArrowDownOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import {
  getAllModules,
  createModule,
  editModule,
  deleteModule,
  getAllProjects,
  getProjectPlan,
  CONFIG_OBJ,
} from "../Config.js";
import { Steps } from "antd";
import { Link } from "react-router-dom";
import { render } from "@testing-library/react";

import { saveAs } from "file-saver";
import { Document, Page, pdfjs } from "react-pdf";
// import { pdf } from "react-pdf";

import { Button } from "antd";
import * as XLSX from "xlsx";

const { Option } = Select;
const { Search } = Input;

const ProjectPlan = () => {
  // for user type
  const user_type = JSON.parse(sessionStorage.getItem("user_type"));
  const role = JSON.parse(sessionStorage.getItem("role"));
  // for excel pdf
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfData, setPdfData] = useState(null);
  const [excelData, setExcelData] = useState(null);

  const [allData, setAllData] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [selectedProjectStage, setSelectedProjectStage] = useState(null);
  const [projectStage, setProjectStage] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const project_id = JSON.parse(queryParams.get("project_id")); 
  const [selectedProjectId, setSelectedProjectId] = useState(project_id);
  const [moduleStage, setModuleStage] = useState("");
  let [searchParams, setSearchParams] = useSearchParams();
  const getProjects = async (value) => {
    try {
      const result = await axios.get(`${getAllProjects}`, CONFIG_OBJ);

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
    setSearchParams({"project_id":value})
  };
  console.log("selected project id", selectedProjectId);

  useEffect(() => {
    const fetchProjectDetails = async (selectedProjectId) => {
      try {
        const response = await axios.get(
          `${getAllProjects}/${selectedProjectId}`, CONFIG_OBJ
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
        `${getProjectPlan}/${selectedProjectId}`, CONFIG_OBJ
      );
      setAllData(response.data.plan);
      console.log("project plan data", response.data.plan);
    } catch (error) {
      console.log("Error fetching project plan data", error);
    }
  };

  useEffect(() => {
    console.log("inside use effect", project_id);
    getProjectPlanData();
  }, [selectedProjectId, project_id,searchParams]);

  // function for excel pdf
  // const generatePDF = async () => {
  //   try {
  //     const pdfBlob = await pdf(
  //       <div>
  //         <h1>Project Plan</h1>
  //         {/* Add your table and other content here */}
  //       </div>
  //     ).toBlob();
  //     setPdfData(pdfBlob);
  //   } catch (error) {
  //     console.log("Error generating PDF", error);
  //   }
  // };

  const generatePDF = async () => {
    try {
      const pdfData = (
        <Document>
          <Page>
            <div>
              <h1>Project Plan</h1>
              {/* Add your table and other content here */}
            </div>
          </Page>
        </Document>
      );

      // Convert the PDF data to a blob
      const pdfBlob = await pdfjs(pdfData).toBlob();
      setPdfData(pdfBlob);
    } catch (error) {
      console.log("Error generating PDF", error);
    }
  };

  const generateExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(allData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBlob = XLSX.write(wb, { bookType: "xlsx", type: "blob" });
      setExcelData(excelBlob);
    } catch (error) {
      console.log("Error generating Excel", error);
    }
  };

  const downloadPDF = () => {
    if (pdfData) {
      saveAs(pdfData, "project_plan.pdf");
    } else {
      generatePDF();
    }
  };

  const downloadExcel = () => {
    if (excelData) {
      saveAs(excelData, "project_plan.xlsx");
    } else {
      generateExcel();
    }
  };

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
                <div className="d-flex align-items-center">
                {user_type !== 1 && role ==="employee"?<Link to="/reportproject-wise"><LeftCircleOutlined style={{fontSize:"1.5rem"}}/></Link>:""}&nbsp;&nbsp;<h3 className="text-primary">Project Plan</h3>
                </div>
                <hr className="bg-primary border-4" />
                <div className=" col-2 d-flex flex-column">
                  <label className="text-capitalize fw-bold text-info">
                    Select Project
                  </label>
                  <Select
                    // allowClear
                    defaultValue={project_id}
                    onChange={projectChangeHandler}
                    placeholder="Select Project"
                    style={{ width: "20rem" }}
                    disabled={(user_type !== 1 && role ==="employee")}

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
                    <div className="row my-4 d-flex align-items-center justify-content-between">
                      <div className="col-2">
                        <button
                          className="btn btn-sm btn-info"
                          disabled={selectedProjectStage === "completed" || (user_type !== 1 && role ==="employee")}
                        >
                          <NavLink
                            to={`/addprojectplan/?project_id=${selectedProjectId}&stage=${selectedProjectStage}`}
                            className="text-decoration-none text-white d-flex align-items-center justify-content-center"
                          >
                            <span className="fs-4"> + </span>&nbsp;
                            {selectedProjectStage === "rfp"
                              ? "Add Plan"
                              : "Edit Plan"}
                          </NavLink>
                        </button>
                      </div>
                      {/* <div className="col-2 d-flex align-items-center gap-2">
                        <Button onClick={downloadPDF} size="small" type="primary" className="d-flex align-items-center"><ArrowDownOutlined /><FilePdfOutlined />PDF</Button>
                        <Button onClick={downloadExcel} size="small" type="primary" className="d-flex align-items-center"><ArrowDownOutlined /><FileExcelOutlined />Excel</Button>
                      </div> */}
                    </div>

                    {/* project plan table for 3 stages */}
                    <div className="col-12 mx-0 d-flex">
                      {/* RFP stage table */}
                      <table
                        className="table table-bordered p-0"
                        // style={{ borderCollapse: "collapse" }}
                      >
                        <thead className="sticky-top bg-white">
                          <tr>
                            <th colSpan={4} className="bg-warning-subtle">
                              RFP
                            </th>
                          </tr>
                          <tr>
                            <th rowSpan={3} className="bg-white">S.No.</th>
                            <th colSpan={1} className="bg-white">Module Name</th>
                            <th colSpan={2}>
                              <div className="d-flex flex-column">
                                <span>Schd. St. Dt.</span>
                                <span>Schd. End Dt.</span>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th colSpan={2} className="bg-white">Task</th>

                            <th>Alloc hrs</th>
                          </tr>
                        </thead>
                        <tbody className="border border-2">
                          {allData &&
                            allData.map((report, index) => {
                              const modules = report.modules;
                              const firstModule = modules[0];
                              const lastModule = modules[modules.length - 1];

                              const rfpModules = report.modules.filter(
                                (module) => module.stage === "rfp"
                              );
                              const firstModulerfp =
                                rfpModules.length > 0 ? rfpModules[0] : null;
                              // const firstModulerfp = rfpModules[0];
                              console.log("rfp modules", rfpModules);
                              console.log("first rfp module", firstModulerfp);
                              let serialNumber = 1;
                              return (
                                <React.Fragment key={index}>
                                  {/* first stage */}
                                  {rfpModules.length > 0 && (
                                    <tr>
                                      <td>{index + 1}</td>
                                      <td colSpan={1}>
                                        <p
                                          className={`text-primary text-capitalize ${
                                            firstModulerfp?.status == "scrapped"
                                              ? "text-decoration-line-through text-danger"
                                              : ""
                                          }`}
                                        >
                                          {firstModulerfp?.module_name}
                                        </p>
                                      </td>
                                      <td colSpan={2}>
                                        <p
                                          className={`text-primary text-capitalize ${
                                            firstModulerfp?.status == "scrapped"
                                              ? "text-decoration-line-through text-danger"
                                              : ""
                                          }`}
                                        >
                                          {firstModulerfp?.from_date.slice(
                                            8,
                                            10
                                          )}
                                          /
                                          {firstModulerfp?.from_date.slice(
                                            5,
                                            7
                                          )}
                                          /
                                          {firstModulerfp?.from_date.slice(
                                            0,
                                            4
                                          )}
                                          <br />
                                          {firstModulerfp?.to_date.slice(8, 10)}
                                          /{firstModulerfp?.to_date.slice(5, 7)}
                                          /{firstModulerfp?.to_date.slice(0, 4)}
                                        </p>
                                      </td>
                                    </tr>
                                  )}
                                  {rfpModules.map((module, moduleIndex) => (
                                    <React.Fragment key={moduleIndex}>
                                      {moduleIndex === 0 ? null : (
                                        <tr>
                                          <td>{moduleIndex + 1}</td>
                                          <td colSpan={2}>
                                            <p
                                              className={`text-primary text-capitalize ${
                                                module.status == "scrapped"
                                                  ? "text-decoration-line-through text-danger"
                                                  : ""
                                              }`}
                                            >
                                              {module.module_name}
                                            </p>
                                          </td>
                                          <td colSpan={1}>
                                            <p
                                              className={`text-primary text-capitalize ${
                                                module.status == "scrapped"
                                                  ? "text-decoration-line-through text-danger"
                                                  : ""
                                              }`}
                                            >
                                              {module.from_date.slice(8, 10)}/
                                              {module.from_date.slice(5, 7)}/
                                              {module.from_date.slice(0, 4)}
                                              <br />
                                              {module.to_date.slice(8, 10)}/
                                              {module.to_date.slice(5, 7)}/
                                              {module.to_date.slice(0, 4)}
                                            </p>
                                          </td>
                                        </tr>
                                      )}
                                      {JSON.parse(module.tasks).map(
                                        (task, taskIndex) => (
                                          <tr
                                            key={`${index}-${moduleIndex}-${taskIndex}`}
                                          >
                                            <td></td>
                                            {/* <td colSpan={2}>
                                              {task.task_name}
                                            </td> */}
                                            <td colSpan={2}>
                                              <span
                                                className={`text-capitalize ${
                                                  module.status === "scrapped"
                                                    ? "text-decoration-line-through text-dark"
                                                    : ""
                                                }`}
                                              >
                                                {task.task_name}
                                              </span>
                                            </td>
                                            <td
                                              className={`${
                                                module.status === "scrapped"
                                                  ? "text-decoration-line-through text-dark"
                                                  : ""
                                              }`}
                                            >
                                              {task.allocated_time}
                                            </td>
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

                      {/* won stage table */}
                      <table
                        className="table table-bordered p-0"
                        // style={{ borderCollapse: "collapse" }}
                      >
                        <thead className="sticky-top">
                          <tr>
                            <th colSpan={4} className="bg-primary-subtle">
                              Contract Signed
                            </th>
                          </tr>
                          <tr>
                            <th rowSpan={3}>S.No.</th>
                            <th colSpan={1}>Module Name</th>
                            <th colSpan={2}>
                              <div className="d-flex flex-column">
                                <span>Schd. St. Dt.</span>
                                <span>Schd. End Dt.</span>
                              </div>
                            </th>
                          </tr>
                          <tr>
                            <th colSpan={2}>Task</th>

                            <th>Alloc hrs</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allData &&
                            allData.map((report, index) => {
                              const modules = report.modules;
                              const firstModule = modules[0];
                              const lastModule = modules[modules.length - 1];

                              const wonModules = report.modules.filter(
                                (module) => module.stage === "won"
                              );

                              const rfpModules = report.modules.filter(
                                (module) => module.stage === "rfp"
                              );

                              const firstModulewon =
                                wonModules.length > 0 ? wonModules[0] : null;
                              console.log("won modules", wonModules);

                              return (
                                <React.Fragment key={index}>
                                  {/* { index <= 0 ? null : ( */}
                                  {wonModules.length > 0 && (
                                    <tr>
                                      {/* <td>{rfpModules.length == null ? index : index+1}</td> */}
                                      <td>{index+1}</td>
                                      <td colSpan={1}>
                                        <p
                                          className={`text-primary text-capitalize ${
                                            firstModulewon?.status == "scrapped"
                                              ? "text-decoration-line-through text-danger"
                                              : ""
                                          }`}
                                        >
                                          {firstModulewon?.module_name}
                                        </p>
                                      </td>
                                      <td colSpan={2}>
                                        <p
                                          className={`text-primary text-capitalize ${
                                            firstModulewon?.status == "scrapped"
                                              ? "text-decoration-line-through text-danger"
                                              : ""
                                          }`}
                                        >
                                          {firstModulewon?.from_date.slice(
                                            8,
                                            10
                                          )}
                                          /
                                          {firstModulewon?.from_date.slice(
                                            5,
                                            7
                                          )}
                                          /
                                          {firstModulewon?.from_date.slice(
                                            0,
                                            4
                                          )}
                                          <br />
                                          {firstModulewon?.to_date.slice(8, 10)}
                                          /{firstModulewon?.to_date.slice(5, 7)}
                                          /{firstModulewon?.to_date.slice(0, 4)}
                                        </p>
                                      </td>
                                    </tr>
                                  )}
                                  {/* )} */}

                                  {wonModules.map((module, moduleIndex) => (
                                    <React.Fragment key={moduleIndex}>
                                      {moduleIndex === 0 ? null : (
                                        <tr>
                                          <td>{moduleIndex + 1}</td>
                                          <td colSpan={2}>
                                            <p
                                              className={`text-primary text-capitalize ${
                                                module.status == "scrapped"
                                                  ? "text-decoration-line-through text-danger"
                                                  : ""
                                              }`}
                                            >
                                              {module.module_name}
                                            </p>
                                          </td>
                                          <td colSpan={1}>
                                            <p
                                              className={`text-primary text-capitalize ${
                                                module.status == "scrapped"
                                                  ? "text-decoration-line-through text-danger"
                                                  : ""
                                              }`}
                                            >
                                              {module.from_date.slice(8, 10)}/
                                              {module.from_date.slice(5, 7)}/
                                              {module.from_date.slice(0, 4)}
                                              <br />
                                              {module.to_date.slice(8, 10)}/
                                              {module.to_date.slice(5, 7)}/
                                              {module.to_date.slice(0, 4)}
                                            </p>
                                          </td>
                                        </tr>
                                      )}
                                      {JSON.parse(module.tasks).map(
                                        (task, taskIndex) => (
                                          <tr
                                            key={`${index}-${moduleIndex}-${taskIndex}`}
                                          >
                                            <td></td>
                                            <td colSpan={2}>
                                              <span
                                                className={`text-capitalize ${
                                                  module.status === "scrapped"
                                                    ? "text-decoration-line-through text-dark"
                                                    : ""
                                                }`}
                                              >
                                                {task.task_name}
                                              </span>
                                            </td>
                                            <td
                                              className={`${
                                                module.status === "scrapped"
                                                  ? "text-decoration-line-through text-dark"
                                                  : ""
                                              }`}
                                            >
                                              {task.allocated_time}
                                            </td>
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

                      {/* inprocess stage table */}
                      <table
                        className="table table-bordered p-0"
                        // style={{ borderCollapse: "collapse" }}
                      >
                        <thead className="sticky-top">
                          <tr>
                            <th colSpan={5} className="bg-success-subtle">
                              In Process
                            </th>
                          </tr>
                          <tr>
                            <th rowSpan={3}>S.No.</th>
                            <th colSpan={1}>Module Name</th>
                            <th colSpan={2}>
                              <div className="d-flex flex-column">
                                <span>Schd. St. Dt.</span>
                                <span>Schd. End Dt.</span>
                              </div>
                            </th>
                            <th colSpan={1}>Status</th>
                          </tr>
                          <tr>
                            <th colSpan={3}>Task</th>

                            <th>Alloc hrs</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allData &&
                            allData.map((report, index) => {
                              const modules = report.modules;
                              const firstModule = modules[0];
                              const lastModule = modules[modules.length - 1];

                              const inprocessModules = report.modules.filter(
                                (module) => module.stage === "inprocess"
                              );

                              const firstModuleinprocess =
                                inprocessModules.length > 0
                                  ? inprocessModules[0]
                                  : null;
                              console.log(
                                "inprocess modules",
                                inprocessModules
                              );
                              return (
                                <React.Fragment key={index}>
                                  {inprocessModules.length > 0 && (
                                    <tr>
                                      <td>{index+1}</td>
                                      <td colSpan={1}>
                                        <p
                                          className={`text-primary text-capitalize ${
                                            firstModuleinprocess?.status ==
                                            "scrapped"
                                              ? "text-decoration-line-through text-danger"
                                              : ""
                                          }`}
                                        >
                                          {firstModuleinprocess?.module_name}
                                        </p>
                                      </td>
                                      <td colSpan={2}>
                                        <p
                                          className={`text-primary text-capitalize ${
                                            firstModuleinprocess?.status ==
                                            "scrapped"
                                              ? "text-decoration-line-through text-danger"
                                              : ""
                                          }`}
                                        >
                                          {firstModuleinprocess?.from_date.slice(
                                            8,
                                            10
                                          )}
                                          /
                                          {firstModuleinprocess?.from_date.slice(
                                            5,
                                            7
                                          )}
                                          /
                                          {firstModuleinprocess?.from_date.slice(
                                            0,
                                            4
                                          )}
                                          <br />
                                          {firstModuleinprocess?.to_date.slice(
                                            8,
                                            10
                                          )}
                                          /
                                          {firstModuleinprocess?.to_date.slice(
                                            5,
                                            7
                                          )}
                                          /
                                          {firstModuleinprocess?.to_date.slice(
                                            0,
                                            4
                                          )}
                                        </p>
                                      </td>
                                      <td colSpan={1}>
                                        <p
                                          className={`text-primary text-capitalize ${
                                            firstModuleinprocess?.status ==
                                            "scrapped"
                                              ? "text-decoration-line-through text-danger"
                                              : ""
                                          }`}
                                        >
                                          {firstModuleinprocess?.status}
                                        </p>
                                      </td>
                                    </tr>
                                  )}

                                  {inprocessModules.map(
                                    (module, moduleIndex) => (
                                      <React.Fragment key={moduleIndex}>
                                        {moduleIndex === 0 ? null : (
                                          <tr>
                                            <td>{moduleIndex + 1}</td>
                                            <td colSpan={2}>
                                              <p
                                                className={`text-primary text-capitalize ${
                                                  module.status == "scrapped"
                                                    ? "text-decoration-line-through text-red"
                                                    : ""
                                                }`}
                                              >
                                                {module.module_name}
                                              </p>
                                            </td>
                                            <td colSpan={1}>
                                              <p
                                                className={`text-primary text-capitalize ${
                                                  module.status == "scrapped"
                                                    ? "text-decoration-line-through text-red"
                                                    : ""
                                                }`}
                                              >
                                                {module.from_date.slice(0, 10)}
                                                <br />
                                                {module.to_date.slice(0, 10)}
                                              </p>
                                            </td>
                                            <td colSpan={1}>
                                              <p
                                                className={`text-primary text-capitalize ${
                                                  module.status == "scrapped"
                                                    ? "text-decoration-line-through text-danger"
                                                    : ""
                                                }`}
                                              >
                                                {module.status}
                                              </p>
                                            </td>
                                          </tr>
                                        )}
                                        {JSON.parse(module.tasks).map(
                                          (task, taskIndex) => (
                                            <tr
                                              key={`${index}-${moduleIndex}-${taskIndex}`}
                                            >
                                              <td></td>
                                              <td colSpan={3}>
                                                <span
                                                  className={`text-capitalize ${
                                                    module.status === "scrapped"
                                                      ? "text-decoration-line-through text-dark"
                                                      : ""
                                                  }`}
                                                >
                                                  {task.task_name}
                                                </span>
                                              </td>
                                              <td
                                                className={`${
                                                  module.status === "scrapped"
                                                    ? "text-decoration-line-through text-dark"
                                                    : ""
                                                }`}
                                              >
                                                {task.allocated_time}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </React.Fragment>
                                    )
                                  )}
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
