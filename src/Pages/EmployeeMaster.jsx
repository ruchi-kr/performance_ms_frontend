import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import {
  getAllEmployees,
  getAllEmployeeslist,
  createEmployee,
  editEmployee,
  deleteEmployee,
  getManagerList,
  getDesignationList,
  getJobRoleList,
  CONFIG_OBJ,
} from "../Config.js";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {AutoComplete, Col, Form, Input, Modal, Row, Select } from "antd";
import { DatePicker ,Pagination} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined,ArrowUpOutlined } from "@ant-design/icons";
const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;

const EmployeeMaster = () => {
  // for search
  const [search, setSearch] = useState("");
  // to hide the reporting manager col
  const [hideManager, setHideManager] = useState(false);
  const [allEmployeeData, setAllEmployeeData] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const [sortOrder, setSortOrder] = useState("ASC");

  // for email autocomplete
  const [options, setOptions] = React.useState([]);

  const handleSearch = (value) => {
    setOptions(() => {
      if (!value || value.includes('@')) {
        return [];
      }
      return ['gmail.com', 'intileo.com', 'qmoniqs.com'].map((domain) => ({
        label: `${value}@${domain}`,
        value: `${value}@${domain}`,
      }));
    });
  };
  // get all projects function  &email=${search}
  const getAllEmployeesHandler = async () => {
    try {
      const response = await axios.get(
        `${getAllEmployees}/?page=${pagination.currentPage}&pageSize=${pagination.pageSize}&sortOrder=${sortOrder}&sortBy=name&name=${search}&email=${search}`,CONFIG_OBJ
      );
      setAllEmployeeData(response.data.data);
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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllEmployeesHandler();
  }, [search, pagination.currentPage, pagination.pageSize, sortOrder]);

  const employeeFormSubmit = (values) => {
    employeeForm
      .validateFields()
      .then(async (values) => {
        try {
          const requestData = {
            ...values,
            id: editingEmployee ? editingEmployee.employee_id : null,
          };
          const url = editingEmployee
            ? `${editEmployee}/${editingEmployee.employee_id}`
            : `${createEmployee}`;
          await axios
            .post(url, requestData,CONFIG_OBJ)
            .then((response) => {
              if (response.status === 200) {
                if (editingEmployee && editingEmployee.employee_id !== null) {
                  toast.success("Employee Details Updated Successfully!");
                } else {
                  toast.success("Employee Added Successfully!");
                }
                employeeForm.resetFields();
                setModalVisible(false);
                getAllEmployeesHandler();
              }
            })
            .catch((error) => {
              if (
                error.response &&
                error.response.data.error ===
                  "User with this email already registered"
              ) {
                toast.error("User with this email already exists");
              } else {
                console.log("error employee", error.response.data);
                // toast.error(error.response.data.error);
              }
            });
        } catch (error) {
          console.log("error", error);
          toast.error(error);
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
      doj: data.doj.split("T")[0],
    };
    return formattedData;
  };

  // delete projects function
  const deleteEmployeeHandler = async (id) => {
    //creating a function for deleting data
    try {
      await axios.delete(`${deleteEmployee}` + id,CONFIG_OBJ); // deleting data from server
      //   window.location.reload(); //reloading the page
      getAllEmployeesHandler();
    } catch (err) {
      console.log("error deleting project", err); //if error occurs then log it
    }
  };
  // edit projects function

  const [employeeForm] = Form.useForm();
  let [project_id, SetProjectId] = useState(null);
  let [modalVisible, setModalVisible] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);

  const employeeData = {
    name: "",
    designation_id: "",
    doj: "",
    dob: "",
    job_id: "",
    experience: "",
    skills: "",
    mobile_no: "",
    email: "",
    manager_id: "",
  };

  const openEmployeeAdd = () => {
    window.scrollTo(0, 0);
    setModalVisible(true);
    setEditingEmployee(null);
    setViewEmployee(null);
    // SetProjectId(null);
    employeeForm.setFieldsValue(employeeData);
    setFormDisabled(false);
  };
  const openEmployeeView = async (employee) => {
    setModalVisible(true);
    setFormDisabled(true);
    setViewEmployee(employee);
    employeeForm.setFieldsValue({
      name: employee.name,
      designation_id: employee.designation_id,
      doj: dayjs(employee.doj),
      dob: dayjs(employee.dob),
      job_id: employee.job_id,
      experience: employee.experience,
      skills: employee.skills,
      mobile_no: employee.mobile_no,
      email: employee.email,
      manager_id: employee.manager_name,
    });
  };

  const openEmployeeEdit = async (employee) => {
    setEditingEmployee(employee);
    setModalVisible(true);
    setFormDisabled(false);
    employeeForm.setFieldsValue({
      name: employee.name,
      designation_id: employee.designation_id,
      doj: dayjs(employee.doj),
      dob: dayjs(employee.dob),
      job_id: employee.job_id,
      experience: employee.experience,
      skills: employee.skills,
      mobile_no: employee.mobile_no,
      email: employee.email,
      manager_id: employee.manager_id,
      // employee_id: employee.employee_id
    });
  };

  // reporting manager list
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const [managerList, setManagerList] = useState([]);

  const [manager, setManager] = useState([]);
  const getManagers = async (value) => {
    try {
      // ?designation_id=${value}
      const result = await axios.get(`${getAllEmployeeslist}`,CONFIG_OBJ,);
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
  // for designation ist
  const [designationList, setDesignationList] = useState([]);
  const getDesignation = async (value) => {
    try {
      const result = await axios.get(`${getDesignationList}`,CONFIG_OBJ,);
      setDesignationList(result.data);
      console.log("Designation list", result.data);
    } catch (error) {
      console.log("Error fetching Designation list data", error);
    }
  };
  useEffect(() => {
    getDesignation();
  }, []);

  // for job role list
  const [jobroleList, setJobroleList] = useState([]);
  const getJobRole = async (value) => {
    try {
      const result = await axios.get(`${getJobRoleList}`,CONFIG_OBJ,);
      setJobroleList(result.data);
      console.log("Job Role list", result.data);
    } catch (error) {
      console.log("Error fetching Job Role list data", error);
    }
  };
  useEffect(() => {
    getJobRole();
  }, []);
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
                  <h3 className="text-primary">Employee Details</h3>

                  <button
                    className="btn btn-sm btn-info d-flex align-items-center"
                    onClick={openEmployeeAdd}
                  >
                    <span className="fs-4"> + </span>&nbsp;Add Employee
                  </button>
                </div>
                <hr className="bg-primary border-4" />
                <div className=" col-2 flex-end">
                  <label className="text-capitalize fw-bold text-info">
                    Search by name or email
                  </label>

                  <Search
                    placeholder="search by name or email"
                    allowClear
                    // onSearch={onSearch}
                    style={{
                      width: 200,
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {/* modal */}
                <Modal
                  title={editingEmployee ? "Edit Employee" : viewEmployee ? "View Employee" : "Add Employee"}
                  visible={modalVisible}
                  onOk={employeeFormSubmit}
                  onCancel={() => {
                    setModalVisible(false);
                    setEditingEmployee(null);
                    setViewEmployee(null);
                  }}
                  okText="Submit"
                  okButtonProps={{
                    style: { display: formDisabled ? "none" : "" },
                  }}
                  width={550}
                  style={{
                    top: 35,
                  }}
                  centered
                >
                  <Form
                    form={employeeForm}
                    onFinish={employeeFormSubmit}
                    layout="vertical"
                    disabled={formDisabled}
                  >
                    {/* <p className='text-info text-decoration-underline'>Employee Details</p> */}
                    <Row gutter={[8, 1]}>
                      <Col span={12}>
                        <Form.Item
                          name="name"
                          label={
                            <span className="text-info">Employee Name</span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Employee Name is required",
                            },
                            {
                              pattern: /^[&,.\-_\w\s]{1,50}$/,
                              message:
                                "Please enter a valid Employee Name (up to 50 characters, only &, , ., -, _ special characters are allowed)",
                            },
                          ]}
                        >
                          <Input placeholder="employee name" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="designation_id"
                          label={<span className="text-info">Designation</span>}
                          rules={[
                            {
                              required: true,
                              message: "Designation is required",
                            },
                            {
                              pattern: /^[&,.\-_\w\s]{1,50}$/,
                              message:
                                "Please enter a valid Designation Name (up to 50 characters, only &, , ., -, _ special characters are allowed)",
                            },
                          ]}
                        >
                          {/* <Input placeholder='designation' /> */}
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            onChange={(value) => {
                              if (value == "1" || value == "2") {
                                setHideManager(true);
                              } else {
                                setHideManager(false);
                              }
                            }}
                            style={{ width: "100%" }}
                            className="rounded-2"
                          >
                            <Option value="">Select</Option>

                            {designationList.map((item, index) => (
                              <Option
                                key={index}
                                value={item.designation_id}
                                label={item.designation_name}
                              >
                                {item.designation_name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={[8, 1]}>
                      <Col span={12}>
                        <Form.Item
                          name="doj"
                          label={<span className="text-info">D.O.J</span>}
                          rules={[
                            { required: true, message: "D.O.J is required" },
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
                          name="experience"
                          label={
                            <span className="text-info">
                              Experience(in years)
                            </span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Experience is required",
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            placeholder="experience(in years)"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={[8, 1]}>
                      <Col span={12}>
                        <Form.Item
                          name="dob"
                          label={<span className="text-info">D.O.B</span>}
                          rules={[
                            { required: true, message: "D.O.B is required" },
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
                          name="mobile_no"
                          label={<span className="text-info">Mobile No.</span>}
                          rules={[
                            { required: true, message: "Mobile is required" },
                            {
                              pattern: /^[0-9]+$/,
                              message: "Mobile number must contain only digits",
                            },
                            {
                              len: 10,
                              message:
                                "Mobile number must be exactly 10 digits",
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            placeholder="mobile no."
                            maxLength={10}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="email"
                          label={<span className="text-info">Email</span>}
                          rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Invalid email" },
                          ]}
                        >
                          <AutoComplete
                           onSearch={handleSearch}
                            type="email"
                            placeholder="you@example.com"
                            options={options}
                            allowClear
                          />
                        </Form.Item>
                      </Col>

                      {!hideManager ? (
                        <>
                          <Col span={12}>
                            <Form.Item
                              name="job_id"
                              label={
                                <span className="text-info">Job Role</span>
                              }
                              rules={[
                                {
                                  required: true,
                                  message: "Job Role is required",
                                },
                                {
                                  pattern: /^[&,.\-_\w\s]{1,50}$/,
                                  message:
                                    "Please enter a valid job role Name (up to 50 characters, only &, , ., -, _ special characters are allowed)",
                                },
                              ]}
                            >
                              {/* <Input placeholder='designation' /> */}
                              <Select
                                showSearch
                                allowClear
                                placeholder="Select"
                                optionFilterProp="children"
                                filterOption={filterOption}
                                style={{ width: "100%" }}
                                className="rounded-2"
                              >
                                <Option value="">Select</Option>

                                {jobroleList.map((item, index) => (
                                  <Option
                                    key={index}
                                    value={item.job_id}
                                    label={item.job_role_name}
                                  >
                                    {item.job_role_name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="manager_id"
                              label={
                                <span className="text-info">
                                  Reporting Manager
                                </span>
                              }
                              rules={[
                                {
                                  required: true,
                                  message: "Reporting Manager is required",
                                },
                              ]}
                            >
                              <Select
                                showSearch
                                allowClear
                                placeholder="Select"
                                optionFilterProp="children"
                                filterOption={filterOption}
                                onChange={handleManagerSearch}
                                style={{ width: "100%" }}
                                className="rounded-2"
                              >
                                <Option value="">Select</Option>

                                {/* {managerList.map((manager, index) => (
                                                            <Option
                                                                key={index}
                                                                value={manager.manager_id}
                                                                label={manager.name}
                                                            >
                                                                {manager.name }
                                                            </Option>
                                                        ))} */}
                                {managerList
                                  .filter(
                                    (manager) => manager.manager_id === null
                                  )
                                  .map((manager, index) => (
                                    <Option
                                      key={index}
                                      value={manager.employee_id}
                                      label={manager.name}
                                    >
                                      {manager.name}
                                    </Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </>
                      ) : (
                        <></>
                      )}
                    </Row>
                    <Row gutter={[8, 1]}>
                      <Col span={24}>
                        <Form.Item
                          name="skills"
                          label={<span className="text-info">Skills</span>}
                          rules={[
                            { required: true, message: "Skills is required" },
                          ]}
                        >
                          <TextArea
                            placeholder="write relevant skills here"
                            autoSize={{
                              minRows: 1,
                              maxRows: 6,
                            }}
                            allowClear
                          />
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
                      {/* <th scope="col">Id</th> */}
                      <th scope="col">
                        <div className="d-flex">
                          <div>Name</div>

                          <ArrowUpOutlined
                            style={{ marginLeft: 18, fontSize: "1rem" }}
                            onClick={handleSortChange}
                            rotate={sortOrder === "ASC" ? 0 : 180}
                          />
                        </div>
                      </th>
                      {/* <th scope="col">Designation</th> */}
                      <th scope="col">D.O.J</th>
                      {/* <th scope="col">D.O.B</th> */}
                      {/* <th scope="col">Exp. (yrs)</th> */}
                      {/* <th scope="col">Job Role</th> */}
                      {/* <th scope="col">Skills</th> */}
                      <th scope="col">Email</th>
                      <th scope="col">Designation</th>
                      <th scope="col">Job Role</th>
                      <th scope="col">Contact No.</th>
                      <th scope="col">Reporting Manager</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {allEmployeeData.map((data, index) => {
                      return (
                        <tr key={data.employee_id}>
                          <th scope="row">
                            {(pagination.currentPage - 1) *
                              pagination.pageSize +
                              index +
                              1}
                          </th>
                          {/* <td>{data.employee_id}</td> */}
                          <td className="text-capitalize">{data.name}</td>
                          {/* <td className='text-capitalize'>{data.designation_id}</td> */}
                          <td>
                            {data.doj.slice(8, 10)}/{data.doj.slice(5, 7)}/
                            {data.doj.slice(0, 4)}
                          </td>
                          {/* <td></td> */}
                          {/* <td>
                            {data.dob.slice(8, 10)}/{data.dob.slice(5, 7)}/
                            {data.dob.slice(0, 4)}
                          </td> */}
                          {/* <td>{data.experience}</td> */}
                          {/* <td>{data.job_id}</td> */}
                          {/* <td className="text-wrap">{data.skills}</td> */}
                          <td>{data.email}</td>
                          <td className="text-capitalize">{data.designation_name}</td>
                          <td className="text-capitalize">{data.job_role_name}</td>
                          <td>{data.mobile_no}</td>
                          <td className="text-capitalize">{data.manager_name}</td>
                          {/* <td>{manager}</td> */}
                          <td className="">
                            {/* <button className="btn btn-primary btn-sm" onClick={() => openEmployeeEdit(data)} >Edit</button>
                                                            <button className="btn btn-danger btn-sm" onClick={() => deleteEmployeeHandler(data.employee_id)}>Delete</button> */}
                            <EyeOutlined
                              onClick={() => openEmployeeView(data)}
                              style={{ color: "blue", marginRight: "1rem" }}
                            />
                            {/* <button className="btn btn-primary btn-sm" onClick={() => openProjectEdit(data)} >Edit</button> */}
                            <EditOutlined
                              onClick={() => openEmployeeEdit(data)}
                              style={{ color: "blue", marginRight: "1rem" }}
                            />
                            {/* <button className="btn btn-danger btn-sm" onClick={() => deleteProjectHandler(data.project_id)}>Delete</button> */}
                            <DeleteOutlined
                              onClick={() =>
                                deleteEmployeeHandler(data.employee_id)
                              }
                              style={{ color: "red", marginRight: "1rem" }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Row align={"end"}>
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
                <div className="row float-right">
                  {/* <nav
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
                  </nav> */}
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

export default EmployeeMaster;
