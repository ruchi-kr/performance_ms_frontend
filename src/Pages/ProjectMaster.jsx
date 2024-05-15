import React, { useEffect, useState } from "react";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import {
  deleteProject,
  getAllProjects,
  createProject,
  editProject,
  CONFIG_OBJ,
  getAllProjectsUrlPagination,
  getExcelpdfprojects,
} from "../Config.js";
import axios from "axios";
import { Col, Form, Input, Modal, Row, Select } from "antd";
import { toast } from "react-toastify";
// import {DeleteOutlined, EditOutlined} from '@ant-design/icon'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { faFilePdf, faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const ProjectMaster = () => {
  // for search by project name
  const [project, setProject] = useState("");

  const [allProjectData, setAllProjectData] = useState([]);
  // for pagination
  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // get all projects function
  const getAllProjectsHandler = async (page) => {
    try {
      const response = await axios.get(
        `${getAllProjectsUrlPagination}?page=${page}&pageSize=${pageSize}&name=${project}`
      );
      setAllProjectData(response.data);
      console.log("project details data", response.data);

      setTotalPages(Math.ceil(response.headers["x-total-count"] / pageSize));
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber == 0 ? 1 : pageNumber);
    getAllProjectsHandler(pageNumber == 0 ? 1 : pageNumber);
  };

  useEffect(() => {
    getAllProjectsHandler(currentPage);
  }, [currentPage, project]);

  // create project
  const projectFormSubmit = (values) => {
    projectForm
      .validateFields()
      .then(async (values) => {
        try {
          const requestData = {
            ...values,
            id: editingProject ? editingProject.project_id : null,
          };
          const url = editingProject
            ? `${editProject}/${editingProject.project_id}`
            : `${createProject}`;
          const response = await axios.post(url, requestData, CONFIG_OBJ);
          if (response.status === 200) {
            if (editingProject && editingProject.project_id !== null) {
              toast.success("Project Details Updated Successfully!");
            } else {
              toast.success("Project Added Successfully!");
            }
            projectForm.resetFields();
            setModalVisible(false);

            getAllProjectsHandler(currentPage);
          } else {
            // console.log(response.data.message);
            // toast.error(response.data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.error);
        }
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const formatDates = (data) => {
    // Extract only the date part from the datetime string
    const formattedData = {
      ...data,
      schedule_start_date: data.schedule_start_date.split("T")[0],
      schedule_end_date: data.schedule_end_date.split("T")[0],
    };
    return formattedData;
  };

  // delete projects function
  const deleteProjectHandler = async (id) => {
    //creating a function for deleting data
    try {
      await axios.delete(`${deleteProject}` + id, CONFIG_OBJ); // deleting data from server
      window.location.reload(); //reloading the page
    } catch (err) {
      console.log("error deleting project", err); //if error occurs then log it
      toast.error(err.response.data.error);
    }
  };
  // edit projects function

  const [projectForm] = Form.useForm();
  let [project_id, SetProjectId] = useState(null);
  let [modalVisible, setModalVisible] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const projectData = {
    project_name: "",
    stage: "",
    schedule_start_date: "",
    schedule_end_date: "",
  };

  const openProjectAdd = () => {
    window.scrollTo(0, 0);
    setModalVisible(true);
    setEditingProject(null);
    // SetProjectId(null);
    projectForm.setFieldsValue(projectData);
    setFormDisabled(false);
  };

  const openProjectView = async (project) => {
    setModalVisible(true);
    setFormDisabled(true);
    projectForm.setFieldsValue({
      project_name: project.project_name,
      stage: project.stage,
      schedule_start_date: project.schedule_start_date.split("T")[0], // Display only the date part
      schedule_end_date: project.schedule_end_date.split("T")[0], // Display only the date part
    });
  };

 

  const openProjectEdit = async (project) => {
    setEditingProject(project);
    setModalVisible(true);
    setFormDisabled(false);
    projectForm.setFieldsValue({
      project_name: project.project_name,
      stage: project.stage,
      schedule_start_date: project.schedule_start_date.split("T")[0], // Display only the date part
      schedule_end_date: project.schedule_end_date.split("T")[0], // Display only the date part
    });
  };

  // Define a function to handle the change in the 'stage' field
  const handleStageChange = (newValue) => {
    const newStage = newValue;
    console.log("new stage", newStage);
    console.log("old stage", editingProject.stage); // Assuming 'editingProject' holds the currently edited project

    if (newStage !== editingProject.stage && newStage !== undefined) {
      confirm({
        title: "Are you sure?",
        icon: <ExclamationCircleFilled />,
        content:
          "Once project stage is escalated, you will not be able to move backwards.",
        onOk() {
          console.log("OK");
          projectForm.setFieldsValue({ stage: newStage });
        },
        onCancel() {
          console.log("Cancel");
          projectForm.setFieldsValue({ stage: editingProject.stage });
        },
      });
    }
  };

  const isOptionDisabled = (optionValue) => {
    console.log("option value", optionValue);
    const selectedValue = projectForm.getFieldsValue(['stage']);
    console.log("selected value for disabling", selectedValue.stage);
    switch (selectedValue.stage) {
      case "rfp":
        return ["rfp","inprocess","completed"].includes(optionValue);
      case "lost":
        return ["rfp", "won", "inprocess", "completed", "scrapped"].includes(optionValue);        
      case "won":
        return ["rfp", "lost","completed"].includes(optionValue);
      case "inprocess":
        return ["rfp", "lost", "won"].includes(optionValue);
      case "completed":
        return ["rfp", "lost", "won", "inprocess", "scrapped"].includes(optionValue);
      case "scrapped":
        return ["rfp", "lost", "won", "inprocess", "completed"].includes(optionValue);
      default:
        return false;
    }
    
  };

  // for export to excel
  const exportToExcel = () => {
    const htmlTable = document.getElementById("pmTable");
    const wb = XLSX.utils.table_to_book(htmlTable);
    // console.log(wb)
    XLSX.writeFile(wb, "employee_reportPW.xlsx");
  };
  // for export to pdf

  const exportToPDF = () => {};

  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            <div className="row my-5">
              <div className="col-11 mx-auto">
                <div className="d-flex justify-content-between">
                  <h3 className="text-primary">Project Details</h3>
                  <button
                    className="btn btn-sm btn-info d-flex align-items-center"
                    onClick={openProjectAdd}
                  >
                    <span className="fs-4"> + </span>&nbsp;Create Project
                  </button>
                </div>
                <hr className="bg-primary border-4" />
                <div className=" col-2 flex-end">
                  <label className="text-capitalize fw-bold text-info">
                    project name
                  </label>

                  <Search
                    placeholder="search by project name"
                    allowClear
                    style={{
                      width: 200,
                    }}
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                  />
                </div>
                <div className="row d-flex justify-content-end">
                  <div className="col-1 me-2">
                    <div className="mb-2 mt-4 d-flex gap-3">
                      <FontAwesomeIcon
                        icon={faFileExcel}
                        size="xl"
                        style={{ color: "#74C0FC" }}
                        onClick={exportToExcel}
                      />
                      <FontAwesomeIcon
                        icon={faFilePdf}
                        style={{ color: "#ee445e" }}
                        size="xl"
                        onClick={exportToPDF}
                      />
                    </div>
                  </div>
                </div>
                <Modal
                  title={editingProject ? "Edit Project" : "Add Project"}
                  visible={modalVisible}
                  onOk={projectFormSubmit}
                  onCancel={() => {
                    setModalVisible(false);
                    setEditingProject(null);
                  }}
                  okText="Submit"
                  okButtonProps={{
                    style: { display: formDisabled ? "none" : "" },
                  }}
                  width={500}
                  centered
                >
                  <Form
                    form={projectForm}
                    onFinish={projectFormSubmit}
                    layout="vertical"
                    disabled={formDisabled}
                  >
                    <Row gutter={[8, 4]}>
                      <Col span={12}>
                        <Form.Item
                          name="project_name"
                          label={
                            <span className="text-info">Project Name</span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Project Name is required",
                            },
                            {
                              pattern: /^[&,.\-_\w\s]{1,50}$/,
                              message:
                                "Please enter a valid Project name (up to 50 characters, only &, , ., -, _ special characters are allowed)",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                      

                        <Form.Item
                          name="stage"
                          label={
                            <span className="text-info text-capitalize">
                              Stage
                            </span>
                          }
                          rules={[
                            { required: true, message: "stage is required" },
                          ]}
                        >
                        
                            <Select onChange={(value) => handleStageChange(value)}>
                              <Option value="" disabled>
                                Select
                              </Option>
                              <Option
                                value="rfp"
                                disabled={isOptionDisabled("rfp")}
                              >
                                RFP
                              </Option>
                              <Option
                                value="lost"
                                disabled={isOptionDisabled("lost")}
                              >
                                Lost
                              </Option>
                              <Option
                                value="won"
                                disabled={isOptionDisabled("won")}
                              >
                                Won
                              </Option>
                              <Option
                                value="inprocess"
                                disabled={isOptionDisabled("inprocess")}
                              >
                                In Process
                              </Option>
                              <Option
                                value="completed"
                                disabled={isOptionDisabled("completed")}
                              >
                                Completed
                              </Option>
                              <Option value="scrapped" disabled={isOptionDisabled("scrapped")}>Scrapped</Option>
                            </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="schedule_start_date"
                          label={
                            <span className="text-info text-capitalize">
                              schedule start date
                            </span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "start date is required",
                            },
                          ]}
                        >
                          <Input type="date" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="schedule_end_date"
                          label={
                            <span className="text-info text-capitalize">
                              schedule end date
                            </span>
                          }
                          rules={[
                            { required: true, message: "end date is required" },
                          ]}
                        >
                          <Input type="date" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Modal>
                <table
                  id="pmTable"
                  className="table table-striped table-hover mt-3"
                >
                  <thead>
                    <tr>
                      <th scope="col">S.No.</th>
                      {/* <th scope="col">Project Id</th> */}
                      <th scope="col">Project Name</th>
                      <th scope="col">Schd. Start Date</th>
                      <th scope="col">Schd. End Date</th>
                      <th scope="col">Stage</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {allProjectData.map((data, index) => {
                      return (
                        <tr key={data.project_id}>
                          <th scope="row">{index + 1}</th>
                          {/* <td>{data.project_id}</td> */}
                          <td>{data.project_name}</td>
                          <td>
                            {data.schedule_start_date.slice(8, 10)}/
                            {data.schedule_start_date.slice(5, 7)}/
                            {data.schedule_start_date.slice(0, 4)}
                          </td>
                          <td>
                            {data.schedule_end_date.slice(8, 10)}/
                            {data.schedule_end_date.slice(5, 7)}/
                            {data.schedule_end_date.slice(0, 4)}
                          </td>
                          <td>{data.stage}</td>
                          <td className="">
                            <EyeOutlined
                              onClick={() => openProjectView(data)}
                              style={{ color: "blue", marginRight: "1rem" }}
                            />
                            {/* <button className="btn btn-primary btn-sm" onClick={() => openProjectEdit(data)} >Edit</button> */}
                            <EditOutlined
                              onClick={() => openProjectEdit(data)}
                              style={{ color: "blue", marginRight: "1rem" }}
                            />
                            {/* <button className="btn btn-danger btn-sm" onClick={() => deleteProjectHandler(data.project_id)}>Delete</button> */}
                            <DeleteOutlined
                              onClick={() =>
                                deleteProjectHandler(data.project_id)
                              }
                              style={{ color: "red", marginRight: "1rem" }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="row float-right">
                  <nav
                    aria-label="Page navigation example"
                    className="d-flex align-self-end mt-3"
                  >
                    <ul className="pagination">
                      <li className="page-item">
                        <a
                          className="page-link"
                          href="#"
                          aria-label="Previous"
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <span aria-hidden="true">«</span>
                        </a>
                      </li>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                        >
                          <a
                            className="page-link"
                            href="#"
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </a>
                        </li>
                      ))}
                      <li className="page-item">
                        <a
                          className="page-link"
                          href="#"
                          aria-label="Next"
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <span aria-hidden="true">»</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
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

export default ProjectMaster;
