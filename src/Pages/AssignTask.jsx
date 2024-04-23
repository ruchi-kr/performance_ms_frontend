import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar.jsx";
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import {
  getAllEmployees,
  createEmployee,
  editEmployee,
  deleteEmployee,
  getManagerList,
} from "../Config.js";
import { toast } from "react-toastify";
import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Table,
  Select,
  Button,
  Space,
  Popconfirm,
  Tag,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
const { TextArea } = Input;
const { Option } = Select;

const AssignTask = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamsData, setTeamsData] = useState(null);
  const [modifiedTeamsData, setModifiedTeamsData] = useState(null);
  const [allEmployeeData, setAllEmployeeData] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [form] = Form.useForm();
  let [project_id, SetProjectId] = useState(null);
  let [modalVisible, setModalVisible] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const resp = await axios.get(
      "http://localhost:8000/api/user/project/teams/5"
    );
    console.log(resp.data.data);
    setTeamsData(resp.data.data);
  };

  // get all projects function
  const getAllEmployeesHandler = async () => {
    try {
      const response = await axios.get(`${getAllEmployees}`);
      setAllEmployeeData(response.data);
      console.log("employee details data", response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllEmployeesHandler();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      const resp = await axios.get(
        "http://localhost:8000/api/admin/getProjects"
      );
      console.log("project data", resp.data);
      setProjectData(resp.data);
    };
    fetchProject();
  }, []);

  useEffect(() => {
    // Populate employee data for each team
    const populatedTeams = teamsData?.map((team) => ({
      ...team,
      employee_details: team?.employee_id.map((empId) =>
        allEmployeeData?.find((emp) => emp.employee_id === empId)
      ),
    }));
    console.log("new populated teams", populatedTeams);
    // setTeamsData(populatedTeams)
    // setTeams(populatedTeams);
    setModifiedTeamsData(populatedTeams);
  }, [allEmployeeData, teamsData]); // Ru

  const openEmployeeEdit = async (employee) => {
    setEditingEmployee(employee);

    setEditingId(employee.team_id);
    setModalVisible(true);
    setIsEditing(true);
    setIsAdding(false);
    console.log("data for editing", employee);
    form.setFieldsValue({
      project_id: employee.project_id,
      employee_id: employee.employee_id,
    });
  };

  // create project
  const employeeFormSubmit = (values) => {
    if (isAdding && !isEditing) {
      console.log("Adding values");
      form
        .validateFields()
        .then((values) => {
          try {
            console.log("form data", values);
            axios.post(
              "http://localhost:8000/api/user/project/teams/5",
              values
            );
            setIsAdding(false);
            setModalVisible(false);
            form.resetFields();
            fetchAll();
          } catch (error) {
            console.log(error);
          }
        })
        .catch((errorInfo) => {
          console.log("Validation failed:", errorInfo);
        });
    } else if (!isAdding && isEditing) {
      console.log("editing values", values.team_id);
      form
        .validateFields()
        .then((values) => {
          try {
            console.log("team id", editingId);
            console.log("form data", values);
            axios.patch(
              `http://localhost:8000/api/user/project/teams/${editingId}`,
              {
                ...values,
                reporting_manager_id: 5,
              }
            );
            setIsEditing(false);
            form.resetFields();
            fetchAll();
            setModalVisible(false);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((errorInfo) => {
          console.log("Validation failed:", errorInfo);
        });
    }
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  // delete projects function
  const deleteTeamHandler = async (id) => {
    //creating a function for deleting data
    try {
      await axios.delete("http://localhost:8000/api/user/project/teams/" + id); // deleting data from server
      fetchAll(); //reloading the page
    } catch (err) {
      console.log("error deleting project", err); //if error occurs then log it
    }
  };
  // edit projects function

  const employeeData = {
    designation: "",
    doj: "",
    experience: "",
    skills: "",
    mobile_no: "",
    email: "",
  };

  const openEmployeeAdd = () => {
    window.scrollTo(0, 0);
    setModalVisible(true);
    setIsAdding(true);
    setIsEditing(false);
    setEditingEmployee(null);
    // SetProjectId(null);
    form.setFieldsValue(employeeData);
    setFormDisabled(false);
  };

  // reporting manager list
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const [managerList, setManagerList] = useState([]);
  const [manager, setManager] = useState([]);
  const getManagers = async (value) => {
    try {
      const result = await axios.get(`${getManagerList}`);
      setManagerList(result.data);
      console.log("manager list", result.data);
    } catch (error) {
      console.log("Error fetching manager list data", error);
    }
  };
  useEffect(() => {
    getManagers();
  }, []);
  const handleManagerSearch = (value) => {
    setManager(value);
  };
  console.log("lpproject data", projectData);
  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            {/* 1st row */}
            <div className="row my-5">
              <div className="col-12 mx-auto">
                {/* employee master detailed table */}

                <div className="d-flex justify-content-between">
                  <h3 className="text-primary">Teams Details</h3>

                  <button
                    className="btn btn-sm btn-info d-flex align-items-center"
                    onClick={openEmployeeAdd}
                  >
                    <span className="fs-4"> + </span>&nbsp;Add Team
                  </button>
                </div>
                <hr className="bg-primary border-4" />
                {/* modal */}
                <Modal
                  title={editingEmployee ? "Edit Employee" : "Add Employee"}
                  visible={modalVisible}
                  onOk={employeeFormSubmit}
                  onCancel={() => {
                    setModalVisible(false);
                    setEditingEmployee(null);
                  }}
                  okText="Submit"
                  okButtonProps={{
                    style: { display: formDisabled ? "none" : "" },
                  }}
                  width={500}
                  centered
                >
                  <Form
                    form={form}
                    onFinish={employeeFormSubmit}
                    layout="vertical"
                    disabled={formDisabled}
                  >
                    <p className="text-info text-decoration-underline">
                      Team Details
                    </p>
                    <Row gutter={[8, 4]}>
                      <Col span={12}>
                        <Form.Item
                          name="project_id"
                          label={<span className="text-info">Project</span>}
                          rules={[
                            {
                              required: true,
                              message: "Project Name is required",
                            },
                          ]}
                        >
                          <Select
                            // showSearch
                            allowClear
                            placeholder="Select"
                            // optionFilterProp="children"
                            // onChange={handleManagerSearch}
                            style={{ width: "100%" }}
                            className="rounded-2"
                          >
                            {/* <Option value="">Select</Option> */}

                            {projectData.map((project) => (
                              <Option
                                key={project.project_id}
                                value={project.project_id}
                                label={project.project_name}
                              >
                                {project.project_name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="employee_id"
                          label={
                            <span className="text-info">Team Members</span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Choose at least one memeber",
                            },
                          ]}
                        >
                          <Select
                            mode="multiple"
                            allowClear
                            placeholder="Select Team Members"
                            // optionFilterProp="children"
                            // onChange={handleManagerSearch}
                            style={{ width: "100%" }}
                            className="rounded-2"
                          >
                            {/* <Option value="">Select</Option> */}

                            {allEmployeeData?.map((emp) => (
                              <Option
                                key={emp.employee_id}
                                value={emp.employee_id}
                                label={emp.name}
                              >
                                {emp.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Modal>
                {/* table */}
                <table className="table table-striped table-hover mt-5">
                  <thead>
                    <tr>
                      <th scope="col">S.No.</th>
                      <th scope="col">Project</th>
                      <th scope="col">Team Members</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {modifiedTeamsData?.map((data, index) => {
                      return (
                        <tr key={data?.employee_id}>
                          <th scope="row">{index + 1}</th>
                          <th scope="row">{data?.project_name}</th>
                          <td className="text-capitalize">
                            {data?.employee_details?.map((item) => (
                              <NavLink to={`/view/teammember/tasks/${item?.employee_id}`}>
                                <Tag color={"blue"} key={item?.index}>
                                  {item?.name}
                                </Tag>
                              </NavLink>
                            ))}
                          </td>

                          <td className="d-flex gap-2">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => openEmployeeEdit(data)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteTeamHandler(data.team_id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AssignTask;
