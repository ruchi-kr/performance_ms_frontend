import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
  getEmployerList,
  EmployeeList,
} from "../Config.js";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import { Col, Form, Input, Modal, Row, Select, Pagination } from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  EyeInvisibleOutlined, EyeTwoTone 
} from "@ant-design/icons";
const { Option } = Select;
const { Search } = Input;

const UserMaster = () => {
  // for admin role options
  const [adminList, setAdminList] = useState(false);

  // for autofill username and password
  const [autousername, setAutousername] = useState("");
  const [autopassword, setAutopassword] = useState("");

  // for search
  const [search, setSearch] = useState("");
  const [allUserData, setAllUserData] = useState([]);
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
  const getAllUsersHandler = async () => {
    try {
      const response = await axios.get(
        `${getAllUsers}?page=${pagination.currentPage}&pageSize=${pagination.pageSize}&sortOrder=${sortOrder}&sortBy=email_id&name=${search}&email=${search}&role=${search}`
      );
      setAllUserData(response.data.data);
      console.log("user details data", response.data);
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
    getAllUsersHandler();
  }, [search, pagination.currentPage, pagination.pageSize, sortOrder]);

  // create project
  const userFormSubmit = (values) => {
    userForm
      .validateFields()
      .then(async (values) => {
        try {
          const requestData = {
            ...values,
            id: editingUser ? editingUser.user_id : null,
          };
          const url = editingUser
            ? `${editUser}/${editingUser.user_id}`
            : `${createUser}`;
          const response = await axios.post(url, requestData);
          if (response.status) {
            if (editingUser && editingUser.user_id !== null) {
              toast.success("User Details Updated Successfully!");
            } else {
              toast.success("User Added Successfully!");
            }
            userForm.resetFields();
            setModalVisible(false);
            window.location.reload();

            getAllUsersHandler();
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
        console.log("Validation failed user:", errorInfo);
      });
  };

  // delete projects function
  const deleteUserHandler = async (id) => {
    //creating a function for deleting data
    try {
      const response = await axios.delete(`${deleteUser}` + id); // deleting data from server
      if (response.status === 200) {
        toast.success(response.data.msg);
        window.location.reload();
      }
    } catch (err) {
      console.log("error deleting user", err); //if error occurs then log it
      toast.error(err.response.data.error);
    }
  };
  // edit projects function

  const [userForm] = Form.useForm();
  let [managerId, setManagerId] = useState(null);
  let [modalVisible, setModalVisible] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  const userData = {
    employee_id: "",
    user_type: "",
    status: "",
    // username: "",
    password: "",
    email_id: "",
    role: "",
  };

  const openUserAdd = () => {
    window.scrollTo(0, 0);
    setModalVisible(true);
    setEditingUser(null);
    setViewUser(null);
    setAdminList(false);
    // SetProjectId(null);
    userForm.setFieldsValue(userData);
    setFormDisabled(false);
  };

  const openUserView = async (user) => {
    setModalVisible(true);
    setFormDisabled(true);
    setViewUser(user);
    setAdminList(true);
    userForm.setFieldsValue({
      // username: user.username,
      password: user.password,
      user_type: user.user_type === 1 ? "admin" : "general",
      status: user.status,
      employee_id: user.employee_name,
      email_id: user.email_id,
      role: user.role,
    });
  };

  const openUserEdit = async (user) => {
    setEditingUser(user);
    setModalVisible(true);
    setFormDisabled(false);
    setAdminList(false);
    userForm.setFieldsValue({
      // username: user.username,
      password: user.password,
      user_type: user.user_type === 1 ? "admin" : "general",
      status: user.status,
      employee_id: user.employee_name,
      email_id: user.email_id,
      role: user.user_type === 1 ? "" : user.role,
      // role: user.role,
    });
  };

  const [userType, setUserType] = useState("");
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const [employerList, setEmployerList] = useState([]);
  const [employer, setEmployer] = useState("");
  const getEmployers = async (value) => {
    try {
      const result = await axios.get(`${EmployeeList}`);
      setEmployerList(result.data);
      console.log("employer list", result.data);
    } catch (error) {
      console.log("Error fetching employer list data", error);
    }
  };

  useEffect(() => {
    getEmployers();
  }, []);
  const handleUserTypeSearch = (value) => {
    setUserType(value);
  };
  const handleEmployerSearch = (value) => {
    setEmployer(value);
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
  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-bg-white">
            {/* 3rd row */}
            <div className="row my-5">
              <div className="col-11 mx-auto">
                {/* user master detailed table */}

                <div className="d-flex justify-content-between">
                  <h3 className="text-primary">User Details</h3>
                  <button
                    className="btn btn-sm btn-info d-flex align-items-center"
                    onClick={openUserAdd}
                  >
                    <span className="fs-4"> + </span>&nbsp;Add User
                  </button>
                </div>
                <hr className="bg-primary border-4" />
                <div className=" col-2 flex-end">
                  <label className="text-capitalize fw-bold text-info">
                    Search by email or role
                  </label>

                  <Search
                    placeholder="search by email or role"
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
                  title={
                    editingUser
                      ? "Edit User"
                      : viewUser
                      ? "View User"
                      : "Add User"
                  }
                  visible={modalVisible}
                  onOk={userFormSubmit}
                  onCancel={() => {
                    setModalVisible(false);
                    setEditingUser(null);
                    setViewUser(null);
                  }}
                  okText="Submit"
                  okButtonProps={{
                    style: { display: formDisabled ? "none" : "" },
                  }}
                  width={500}
                  centered
                >
                  <Form
                    form={userForm}
                    onFinish={userFormSubmit}
                    layout="vertical"
                    disabled={formDisabled}
                  >
                    {/* <p className='text-info text-decoration-underline'>User Details</p> */}
                    <Row gutter={[8, 4]}>
                      <Col span={12}>
                        <Form.Item
                          name="employee_id"
                          label={
                            <span className="text-info">Employer Name</span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Employer Name is required",
                            },
                          ]}
                        >
                          {/* <Select
                            showSearch
                            allowClear
                            placeholder="Select"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            // onChange={handleEmployerSearch}
                            onChange={(value) => setAutousername(value)}
                            style={{ width: "100%" }}
                            className="rounded-2"
                            disabled={editingUser}
                          >
                            <Option value="" disabled>
                              Select
                            </Option>

                            {employerList.map((employer, index) => (
                              <Option
                                key={index}
                                value={employer.employee_id}
                                label={employer.name}
                              >
                                {employer.name}
                              </Option>
                            ))}
                          </Select> */}
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            onChange={(value) => {
                              setAutousername(value);
                              // Find the selected employer from the employerList
                              const selectedEmployer = employerList.find(
                                (employer) => employer.employee_id === value
                              );
                              // If employer is found, set the email_id field to the corresponding email
                              if (selectedEmployer) {
                                userForm.setFieldsValue({
                                  email_id: selectedEmployer.email,
                                });
                                userForm.setFieldsValue({ password: selectedEmployer.dob.slice(0,10) });
                                // const date = new Date(
                                //   selectedEmployer.dob.slice(0, 10)
                                // );
                                // const formattedDate =
                                //   date.toLocaleDateString("en-GB"); // 'en-GB' for dd-mm-yyyy format
                                // userForm.setFieldsValue({
                                //   password: formattedDate,
                                // });
                              }
                            }}
                            style={{ width: "100%" }}
                            className="rounded-2"
                            disabled={editingUser}
                          >
                            <Option value="" disabled>
                              Select
                            </Option>
                            {employerList.map((employer, index) => (
                              <Option
                                key={index}
                                value={employer.employee_id}
                                label={employer.name}
                              >
                                {employer.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          name="email_id"
                          label={<span className="text-info">Email</span>}
                          rules={[
                            { required: true, message: "Email is required" },
                            {
                              type: "email",
                              message: "Please enter a valid email",
                            },
                          ]}
                        >
                          {/* <Select
                                                        showSearch
                                                        allowClear
                                                        placeholder="Select"
                                                        optionFilterProp="children"
                                                        filterOption={filterOption}
                                                        onChange={handleEmployerSearch}
                                                        style={{ width: "100%" }}
                                                        className="rounded-2"
                                                    >

                                                        <Option value="">Select</Option>

                                                        {employerList.map((employer, index) => (
                                                            <Option
                                                                key={index}
                                                                value={employer.employee_id}
                                                                label={employer.email}
                                                            >
                                                                {employer.email}
                                                            </Option>
                                                        ))}
                                                    </Select> */}
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          name="user_type"
                          label={<span className="text-info">User Type</span>}
                          rules={[
                            {
                              required: true,
                              message: "User Type is required",
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            onChange={(value) => {
                              if (value == "1") {
                                setAdminList(true);
                                userForm.setFieldsValue({ role: "" });
                              } else {
                                setAdminList(false);
                              }
                            }}
                            style={{ width: "100%" }}
                            className="rounded-2"
                          >
                            <Option value="" disabled>
                              Select
                            </Option>
                            <Option value="1">Admin</Option>
                            <Option value="0">General</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="role"
                          label={<span className="text-info">Role</span>}
                        >
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            onChange={handleUserTypeSearch}
                            style={{ width: "100%" }}
                            className="rounded-2"
                            disabled={adminList}
                            // ||(editingUser && value == "1")
                          >
                            <Option value="" disabled>
                              Select
                            </Option>
                            <Option
                              value="manager"
                              className={adminList ? "text-grey" : "text-info "}
                              disabled={adminList}
                            >
                              Manager
                            </Option>
                            <Option
                              value="employee"
                              className={adminList ? "text-grey" : "text-info "}
                              disabled={adminList}
                            >
                              Employee
                            </Option>
                            <Option
                              value="management"
                              className={adminList ? "text-grey" : "text-info "}
                              disabled={adminList}
                            >
                              Management
                            </Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="status"
                          label={<span className="text-info">Status</span>}
                          rules={[
                            { required: true, message: "Status is required" },
                          ]}
                        >
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            onChange={handleUserTypeSearch}
                            style={{ width: "100%" }}
                            className="rounded-2"
                          >
                            <Option value="" disabled>
                              Select
                            </Option>
                            <Option value="active" className="text-success">
                              Active
                            </Option>
                            <Option value="inactive" className="text-danger">
                              Inactive
                            </Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      {/* <Col span={12}>
                        <Form.Item
                          name="username"
                          label={<span className="text-info">Username</span>}
                          rules={[
                            { required: true, message: "Username is required" },
                            {
                              pattern: /^[&,.\-_\w\s]{1,10}$/,
                              message:
                                "Please enter a valid Username (up to 20 characters, only &, , ., -, _ special characters are allowed)",
                            },
                          ]}
                        >
                          <Input type="text" placeholder="username" value={autousername} />
                        </Form.Item>
                      </Col> */}
                      <Col span={12}>
                        <Form.Item
                          name="password"
                          label={<span className="text-info">Password</span>}
                          rules={[
                            { required: true, message: "Password is required" },
                            {
                              pattern: /^[/,@,&,.\-_\w\s]{8,20}$/,
                              message:
                                "Please enter a valid Password (up to 8-20 characters, only @, &, /, , ., -, _ special characters are allowed)",
                            },
                          ]}
                        >
                          <Input.Password  placeholder="password"  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
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
                      <th scope="col">
                        <div className="d-flex">
                          <div>Email Id</div>

                          <ArrowUpOutlined
                            style={{ marginLeft: 18, fontSize: "1rem" }}
                            onClick={handleSortChange}
                            rotate={sortOrder === "ASC" ? 0 : 180}
                          />
                        </div>
                      </th>
                      <th scope="col">Password</th>
                      <th scope="col">User Type</th>
                      <th scope="col">Employee Name</th>
                      {/* <th scope="col">Email</th> */}
                      <th scope="col">Role</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {allUserData.map((data, index) => {
                      return (
                        <tr key={data.user_id}>
                          <th scope="row">{index + 1}</th>
                          <td>{data.email_id}</td>
                          <td className="text-capitalize">{data.password}</td>
                          <td className="text-capitalize">
                            {data.user_type === 1 ? "admin" : "general"}
                          </td>
                          <td className="text-capitalize">
                            {data.employee_name}
                          </td>
                          {/* <td className='text-capitalize'>{data.email}</td> */}
                          <td className="text-capitalize">{data.role}</td>
                          <td
                            className={`text-capitalize ${
                              data.status === "active"
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            {data.status}
                          </td>
                          <td className="">
                            {/* <button className="btn btn-primary btn-sm" onClick={() => openUserEdit(data)} >Edit</button>
                                                            <button className="btn btn-danger btn-sm" onClick={() => deleteUserHandler(data.user_id)}>Delete</button> */}
                            <EyeOutlined
                              onClick={() => openUserView(data)}
                              style={{ color: "blue", marginRight: "1rem" }}
                            />
                            <EditOutlined
                              onClick={() => openUserEdit(data)}
                              style={{ color: "blue", marginRight: "1rem" }}
                            />
                            <DeleteOutlined
                              onClick={() => deleteUserHandler(data.user_id)}
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

                {/* pagination */}
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

export default UserMaster;
