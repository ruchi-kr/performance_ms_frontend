import React, { useState, useEffect } from "react";
import SideNavbar from "../Components/SideNavbar.jsx";
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import {
  getAllJobRoles,
  createJobRole,
  editJobRole,
  deleteJobRole,
} from "../Config.js";
import axios from "axios";
import { toast } from "react-toastify";
import { Pagination, Col, Form, Input, Modal, Row, Select } from "antd";
import {
  ArrowUpOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const { Search } = Input;

const JobRoleMaster = () => {
  // search by designation
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  // const [designationList, setDesignationList] = useState([]);
  const [jobrole, setJobrole] = useState("");

  // get all manager function with pagination
  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allJobRoleData, setAllJobRoleData] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const [sortOrder, setSortOrder] = useState("ASC");

  const getAllJobRolesHandler = async () => {
    try {
      const response = await axios.get(
        `${getAllJobRoles}/?page=${pagination.currentPage}&pageSize=${pagination.pageSize}&sortOrder=${sortOrder}&sortBy=job_role_name&name=${jobrole}`
      );
      setAllJobRoleData(response.data.data);
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
    getAllJobRolesHandler(currentPage);
  }, [jobrole, pagination.currentPage, pagination.pageSize, sortOrder]);

  // create manager
  const jobroleFormSubmit = (values) => {
    jobroleForm
      .validateFields()
      .then(async (values) => {
        try {
          const requestData = {
            ...values,
            id: editingManager ? editingManager.job_id : null,
          };
          const url = editingManager
            ? `${editJobRole}/${editingManager.job_id}`
            : `${createJobRole}`;

          const response = await axios.post(url, requestData);
          if (response.status) {
            if (editingManager && editingManager.job_id !== null) {
              toast.success("Job Role Updated Successfully!");
            } else {
              toast.success("Job Role Added Successfully!");
            }
            console.log("response added", response.data);
            jobroleForm.resetFields();
            setModalVisible(false);
            getAllJobRolesHandler();
          }
          // else {
          //     console.log("error response",response);

          // }
        } catch (error) {
          console.log("catch error", error);
          toast.error(error.response.data.error);
        }
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const deleteHandler = async (id) => {
    try {
      const response = await axios.delete(`${deleteJobRole}` + id);
      if (response.status === 200) {
        // Manager deleted successfully
        toast.success(response.data.msg)
        console.log(response.data);
        window.location.reload();
      } else if (response.status === 400) {
        // Manager is assigned to an employee
        console.log("error Job role deletion", response.error);
        toast.error(response.data.error);
      }
    } catch (err) {
      console.log("error deleting Job role", err);
    
      toast.error(err.response.data.error);
    }
  };

  // edit manager function

  const [jobroleForm] = Form.useForm();
  let [managerId, setManagerId] = useState(null);
  let [modalVisible, setModalVisible] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const[viewJobRole,setViewJobRole]=useState(null);

  const jobData = {
    job_id: "",
    job_role_name: "",
  };

  const openJobAdd = () => {
    window.scrollTo(0, 0);
    setModalVisible(true);
    setEditingManager(null);
    setViewJobRole(null);
    // SetProjectId(null);
    jobroleForm.setFieldsValue(jobData);
    setFormDisabled(false);
  };

  const openJobView = async (job) => {
    setModalVisible(true);
    setViewJobRole(job);
    setFormDisabled(true);
    jobroleForm.setFieldsValue({
      job_id: job.job_id,
      job_role_name: job.job_role_name,
    });
  };

  const openJobEdit = async (job) => {
    setEditingManager(job);
    setFormDisabled(false);
    console.log("editing job role", job);
    setModalVisible(true);
    jobroleForm.setFieldsValue({
      job_id: job.job_id,
      job_role_name: job.job_role_name,
    });
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
          <div className="container-fluid bg-white">
            {/* 1st row */}
            <div className="row my-5">
              <div className="col-11 mx-auto">
                {/* reporting manager master detailed table */}

                <div className="d-flex justify-content-between">
                  <h3 className="text-primary">Job Role Details</h3>
                  <button
                    className="btn btn-sm btn-info d-flex align-items-center"
                    onClick={openJobAdd}
                  >
                    <span className="fs-4"> + </span>&nbsp;Add Job Role
                  </button>
                </div>
                <hr className="bg-primary border-4" />
                <div className=" col-2 flex-end">
                  <label className="text-capitalize fw-bold text-info">
                    Job Role
                  </label>

                  <Search
                    placeholder="search by job role"
                    allowClear
                    // onSearch={onSearch}
                    style={{
                      width: 200,
                    }}
                    value={jobrole}
                    onChange={(e) => setJobrole(e.target.value)}
                  />
                </div>

                {/* modal */}
                <Modal
                  title={editingManager ? "Edit Job Role" : viewJobRole ? "View Job Role" : "Add Job Role"}
                  visible={modalVisible}
                  onOk={jobroleFormSubmit}
                  onCancel={() => {
                    setModalVisible(false);
                    setEditingManager(null);
                    setViewJobRole(null);
                  }}
                  okText="Submit"
                  okButtonProps={{
                    style: { display: formDisabled ? "none" : "" },
                  }}
                  width={500}
                  centered
                >
                  <Form
                    form={jobroleForm}
                    onFinish={jobroleFormSubmit}
                    layout="vertical"
                    disabled={formDisabled}
                  >
                    <Row gutter={[8, 4]}>
                      <Col span={12}>
                        <Form.Item
                          name="job_role_name"
                          label={
                            <span className="text-info mt-3">Job Role</span>
                          }
                          rules={[
                            { required: true, message: "Job Role is required" },
                            {
                              pattern: /^[&,./\-_\w\s]{1,50}$/,
                              message:
                                "Please enter a valid Job Role Name (up to 50 characters, only &, , ., -, _, / special characters are allowed)",
                            },
                          ]}
                        >
                          <Input />
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
                          <div>Job role</div>

                          <ArrowUpOutlined
                            style={{ marginLeft: 18, fontSize: "1rem" }}
                            onClick={handleSortChange}
                            rotate={sortOrder === "ASC" ? 0 : 180}
                          />
                        </div>
                      </th>

                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {allJobRoleData.map((data, index) => {
                      return (
                        <tr key={data.job_id}>
                          <th scope="row">
                            {(pagination.currentPage - 1) *
                              pagination.pageSize +
                              index +
                              1}
                          </th>
                          <td className="text-capitalize">
                            {data.job_role_name}
                          </td>
                          <td className="">
                            <EyeOutlined
                              onClick={() => openJobView(data)}
                              style={{ color: "blue", marginRight: "1rem" }}
                            />
                            <EditOutlined
                              onClick={() => openJobEdit(data)}
                              style={{ color: "blue", marginRight: "1rem" }}
                            />
                            <DeleteOutlined
                              onClick={() => deleteHandler(data.job_id)}
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
                          <span aria-hidden="true">« Previous</span>
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
                          <span aria-hidden="true">Next »</span>
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

export default JobRoleMaster;
