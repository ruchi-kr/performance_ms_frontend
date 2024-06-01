import React, { useEffect, useState } from "react";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { NavLink } from "react-router-dom";
// import { useHistory } from "react-router-dom";
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
import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  DatePicker,
  Pagination,
} from "antd";
import { toast } from "react-toastify";
// import {DeleteOutlined, EditOutlined} from '@ant-design/icon'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleFilled,
  ArrowUpOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import { faFilePdf, faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextArea from "antd/es/input/TextArea.js";
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const ProjectMaster = () => {
  // const history = useHistory();
  // for search by project name
  const [project, setProject] = useState("");

  const [allProjectData, setAllProjectData] = useState([]);
  // for pagination
  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const [sortOrder, setSortOrder] = useState("ASC");

  // get all projects function
  const getAllProjectsHandler = async (page) => {
    try {
      const response = await axios.get(
        `${getAllProjectsUrlPagination}?page=${pagination.currentPage}&pageSize=${pagination.pageSize}&sortOrder=${sortOrder}&sortBy=project_name&name=${project}`,
        CONFIG_OBJ
      );
      setAllProjectData(response.data.data);
      console.log("project details data", response.data);

      const {
        totalRecords,
        totalPages,
        currentPage,
        nextPage,
        prevPage,
        pageSize,
      } = response.data.pagination;

      setPagination((prevState) => ({
        ...prevState,
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: pageSize,
        currentPage: currentPage,
        nextPage: nextPage,
        prevPage: prevPage,
      }));
      setTotalPages(Math.ceil(response.headers["x-total-count"] / pageSize));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllProjectsHandler(currentPage);
  }, [project, pagination.currentPage, pagination.pageSize, sortOrder]);

  const [projectId, setprojectId] = useState(null);
  // create project
  const projectFormSubmit = (values) => {
    console.log("project form submit",values);
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
            setprojectId(response.data.project_id);
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
      const response = await axios.delete(`${deleteProject}` + id, CONFIG_OBJ); // deleting data from server
      if (response.status === 200) {
        toast.success(response.data.msg);
        window.location.reload(); //reloading the page
      }
    } catch (err) {
      console.log("error deleting project", err); //if error occurs then log it
      toast.error(err.response.data.error);
    }
  };
  // edit projects function

  const [projectForm] = Form.useForm();
  let [project_id, SetProjectId] = useState(null);
  let [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewProject, setViewProject] = useState(null);

  const projectData = {
    project_name: "",
    project_details: "",
    stage: "rfp",
    schedule_start_date: "",
    schedule_end_date: "",
  };

  const openProjectAdd = () => {
    window.scrollTo(0, 0);
    setModalVisible(true);
    setEditingProject(null);
    setViewProject(null);
    // SetProjectId(null);
    projectForm.setFieldsValue(projectData);
    setFormDisabled(false);
  };

  const openProjectView = async (project) => {
    setModalVisible(true);
    setFormDisabled(true);
    setViewProject(project);
    projectForm.setFieldsValue({
      project_name: project.project_name,
      stage: project.stage,
      project_details: project.project_details,
      schedule_start_date: dayjs(project.schedule_start_date), // Display only the date part
      schedule_end_date: dayjs(project.schedule_end_date), // Display only the date part
    });
  };

  const openProjectEdit = async (project) => {
    setEditingProject(project);
    setSecondModalVisible(false);
    setModalVisible(true);
    setFormDisabled(false);
    projectForm.setFieldsValue({
      project_name: project.project_name,
      project_details: project.project_details,
      stage: project.stage,
      schedule_start_date: dayjs(project.schedule_start_date), // Display only the date part
      schedule_end_date: dayjs(project.schedule_end_date), // Display only the date part
    });
  };

  // Define a function to handle the change in the 'stage' field
  const handleStageChange = (newValue) => {
    if (editingProject) {
      const newStage = newValue;
      console.log("new stage", newStage);
      console.log("old stage", editingProject.stage); // Assuming 'editingProject' holds the currently edited project

      if (newStage !== editingProject?.stage && newStage !== undefined) {
        confirm({
          title: "Are you sure?",
          icon: <ExclamationCircleFilled />,
          content:
            "Once project stage is moved to next stage, you will not be able to revert.",
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
    }
  };

  const isOptionDisabled = (optionValue) => {
    console.log("option value", optionValue);
    const selectedValue = projectForm.getFieldsValue(["stage"]);
    console.log("selected value for disabling", selectedValue.stage);
    switch (selectedValue.stage) {
      case "rfp":
        return ["inprocess", "completed"].includes(optionValue);
      case "lost":
        return ["rfp", "won", "inprocess", "completed", "scrapped"].includes(
          optionValue
        );
      case "won":
        return ["rfp", "lost", "completed"].includes(optionValue);
      case "inprocess":
        return ["rfp", "lost", "won"].includes(optionValue);
      case "completed":
        return ["rfp", "lost", "won", "inprocess", "scrapped"].includes(
          optionValue
        );
      case "scrapped":
        return ["rfp", "lost", "won", "inprocess", "completed"].includes(
          optionValue
        );
      default:
        return false;
    }
  };
  //Pagination
  const handlePageChange = (page) => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };
  const pageSizeChange = (current, pageSize) => {
    setPagination((prevState) => ({
      ...prevState,
      pageSize: pageSize,
    }));
  };
  const handleSortChange = () => {
    // Toggle sorting order when the button is clicked
    setSortOrder((prevOrder) => {
      if (prevOrder === "ASC") {
        return "DESC";
      }
      return "ASC";
    });
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
                <div className="row d-flex justify-content-end my-4">
                  <div className="col-1 me-2">
                    {/* <div className="mb-2 mt-4 d-flex gap-3">
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
                    </div> */}
                  </div>
                </div>
                <Modal
                  title={
                    editingProject
                      ? "Edit Project"
                      : viewProject
                      ? "View Project"
                      : "Add Project"
                  }
                  open={modalVisible}
                  // onOk={projectFormSubmit}
                  onOk={() => {
                    projectFormSubmit();
                    {
                      !editingProject && !viewProject
                        ? setSecondModalVisible(true)
                        : setSecondModalVisible(false);
                    }
                    // setSecondModalVisible(true);
                  }}
                  onCancel={() => {
                    setModalVisible(false);
                    setEditingProject(null);
                    setViewProject(null);
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
                          <Input placeholder="Project Name" />
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
                          <Select
                            onChange={(value) => handleStageChange(value)}
                          >
                            <Option value="" disabled>
                              Select
                            </Option>
                            <Option
                              value="rfp"
                              disabled={
                                editingProject && isOptionDisabled("rfp")
                              }
                            >
                              RFP
                            </Option>
                            <Option
                              value="lost"
                              disabled={
                                editingProject && isOptionDisabled("lost")
                              }
                            >
                              Lost
                            </Option>
                            <Option
                              value="won"
                              disabled={
                                editingProject && isOptionDisabled("won")
                              }
                            >
                              Won
                            </Option>
                            <Option
                              value="inprocess"
                              disabled={
                                editingProject && isOptionDisabled("inprocess")
                              }
                            >
                              In Process
                            </Option>
                            <Option
                              value="completed"
                              disabled={
                                editingProject && isOptionDisabled("completed")
                              }
                            >
                              Completed
                            </Option>
                            <Option
                              value="scrapped"
                              disabled={
                                editingProject && isOptionDisabled("scrapped")
                              }
                            >
                              Scrapped
                            </Option>
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
                          <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: "100%" }}
                          />
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
                          <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={[8, 4]}>
                      <Col span={24}>
                        <Form.Item
                          name="project_details"
                          label={
                            <span className="text-info text-capitalize">
                              Project Description
                            </span>
                          }
                        >
                          <TextArea
                            placeholder="Project Description"
                            autoSize
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Modal>

                <Modal
                  title=""
                  open={secondModalVisible}
                  onOk={() => {
                    setSecondModalVisible(false);

                    setModalVisible(false);
                    setEditingProject(null);
                    setViewProject(null);
                    // history.push(`/addprojectplan/?project_id=${project_id}&stage=rfp`);
                    window.location.href = `/addprojectplan/?project_id=${projectId}&stage=rfp`;
                  }}
                  okText="yes"
                  cancelText="No"
                  onCancel={() => {
                    setSecondModalVisible(false);

                    setModalVisible(false);
                    setEditingProject(null);
                    setViewProject(null);
                  }}
                >
                  <p>Do you want to create a Project Plan now ?</p>
                </Modal>
                <table
                  id="pmTable"
                  className="table table-striped table-hover mt-3"
                >
                  <thead>
                    <tr>
                      <th scope="col">S.No.</th>
                      {/* <th scope="col">Project Id</th> */}
                      <th scope="col">
                        <div className="d-flex">
                          <div>Project Name</div>

                          <ArrowUpOutlined
                            style={{ marginLeft: 18, fontSize: "1rem" }}
                            onClick={handleSortChange}
                            rotate={sortOrder === "ASC" ? 0 : 180}
                          />
                        </div>
                      </th>
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
                          <th scope="row">
                            {(pagination.currentPage - 1) *
                              pagination.pageSize +
                              index +
                              1}
                          </th>
                          {/* <td>{data.project_id}</td> */}

                          <td>
                            <NavLink
                              to={`/projectplan/?project_id=${data.project_id}`}
                            >
                              <span className="text-capitalize">{data.project_name}</span>
                            </NavLink>
                          </td>
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
                          {/* <td >{data.stage}</td> */}
                          <td
                            className={
                              data.stage === "rfp"
                                ? "text-uppercase"
                                : "text-capitalize"
                            }
                          >
                            {data.stage}
                          </td>
                          <td className="">
                            {data.project_id !== 1 && (
                              <>
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
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Row align="end">
                  <Col>
                    <Pagination
                      current={pagination.currentPage}
                      total={pagination.totalRecords}
                      pageSize={pagination.pageSize}
                      onChange={handlePageChange}
                      showLessItems={true}
                      onShowSizeChange={pageSizeChange}
                      showQuickJumper={false}
                      showPrevNextJumpers={true}
                      showSizeChanger={true}
                      onPrev={() => handlePageChange(pagination.prevPage)}
                      onNext={() => handlePageChange(pagination.nextPage)}
                      style={{
                        marginBottom: "2rem",
                      }}
                    />
                  </Col>
                </Row>

                <div className="row float-right"></div>
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
