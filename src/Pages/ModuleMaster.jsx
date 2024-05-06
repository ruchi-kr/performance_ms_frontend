import React, { useState, useEffect } from "react";
import SideNavbar from "../Components/SideNavbar.jsx";
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import {
  getAllModules,
  createModule,
  editModule,
  deleteModule,
  getAllProjects,
} from "../Config.js";
import axios from "axios";
import { toast } from "react-toastify";
import {Tag, Col, Form, Input, Modal, Row, Select } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
const { Option } = Select;
const { Search } = Input;

const ModuleMaster = () => {
  // search by designation
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  // const [designationList, setDesignationList] = useState([]);
  const [projectName, setProjectName] = useState("");

  // get all manager function with pagination
  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allModuleData, setAllModuleData] = useState([]);

  const getAllModulesHandler = async (page) => {
    try {
      const response = await axios.get(
        `${getAllModules}?page=${page}&pageSize=${pageSize}&name=${projectName}`
      );
      setAllModuleData(response.data);
      console.log("module data", response.data);
      setTotalPages(Math.ceil(response.headers["x-total-count"] / pageSize));
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber == 0 ? 1 : pageNumber);
    getAllModulesHandler(pageNumber == 0 ? 1 : pageNumber);
  };

  useEffect(() => {
    getAllModulesHandler(currentPage);
  }, [currentPage, projectName]);

  // create module function
  const moduleFormSubmit = (values) => {
    moduleForm
      .validateFields()
      .then((values) => {
        try {
          const requestData = {
            ...values,
            id: editingModule ? editingModule.module_id : null,
          };
          const url = editingModule
            ? `${editModule}/${editingModule.module_id}`
            : `${createModule}`;
          const response = axios.post(url, requestData);
          if (response.status) {
            if (editingModule && editingModule.module_id !== null) {
              toast.success("Module Updated Successfully!");
            } else {
              toast.success("Module Added Successfully!");
            }
            console.log("response added", response.data);
            moduleForm.resetFields();
            setModalVisible(false);
            getAllModulesHandler();

            getAllModulesHandler();
          } else {
            console.log(response.data.message);
            // toast.error(response.data.message);
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const deleteModuleHandler = async (id) => {
    try {
      const response = await axios.delete(`${deleteModule}` + id);
      if (response.status === 200) {
        // Manager deleted successfully
        console.log(response.data);
        window.location.reload();
      } else if (response.status === 400) {
        // Manager is assigned to an employee
        console.log("Error Module deletion", response.error);
        toast.error(response.data.error);
      }
    } catch (err) {
      console.log("Error deleting Module", err);
      // Display a generic error message if there's an unexpected error
      toast.error("module cannot be deleted as it is assigned to an employee");
      // toast.error(response.data.error);
    }
  };

  // edit module function

  const [moduleForm] = Form.useForm();
  let [moduleId, setModuleId] = useState(null);
  let [modalVisible, setModalVisible] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  const moduleData = {
    module_id: "",
    module_name: "",
    project_id: "",
  };

  const openModuleAdd = () => {
    window.scrollTo(0, 0);
    setModalVisible(true);
    setEditingModule(null);
    // SetProjectId(null);
    moduleForm.setFieldsValue(moduleData);
    setFormDisabled(false);
  };

  const openModuleView = async (module) => {
    setModalVisible(true);
    setFormDisabled(true);
    moduleForm.setFieldsValue({
      module_id: module.module_id,
      module_name: module.module_name,
      project_id: module.project_id,
    });
  };

  const openModuleEdit = async (module) => {
    setEditingModule(module);
    setFormDisabled(false);
    console.log("editing designation", module);
    setModalVisible(true);
    moduleForm.setFieldsValue({
      module_id: module.module_id,
      module_name: module.module_name,
      project_id: module.project_id,
    });
  };

  // GET PROJECT LIST
  const [projectList, setProjectList] = useState([]);
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
                {/* module master detailed table */}

                <div className="d-flex justify-content-between">
                  <h3 className="text-primary">Project Module Details</h3>
                  <button
                    className="btn btn-sm btn-info d-flex align-items-center"
                    onClick={openModuleAdd}
                  >
                    <span className="fs-4"> + </span>&nbsp;Add Module
                  </button>
                </div>
                <hr className="bg-primary border-4" />
                <div className=" col-2 flex-end">
                  <label className="text-capitalize fw-bold text-info">
                    Project Name
                  </label>

                  <Search
                    placeholder="search by project name"
                    allowClear
                    // onSearch={onSearch}
                    style={{
                      width: 200,
                    }}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                {/* modal */}
                <Modal
                  title={
                    editingModule ? "Edit Project Module" : "Add Project Module"
                  }
                  visible={modalVisible}
                  onOk={moduleFormSubmit}
                  onCancel={() => {
                    setModalVisible(false);
                    setEditingModule(null);
                  }}
                  okText="Submit"
                  okButtonProps={{
                    style: { display: formDisabled ? "none" : "" },
                  }}
                  width={500}
                  centered
                >
                  <Form
                    form={moduleForm}
                    onFinish={moduleFormSubmit}
                    layout="vertical"
                    disabled={formDisabled}
                  >
                    <Row gutter={[8, 4]}>
                      <Col span={12}>
                        <Form.Item
                          name="project_id"
                          label={
                            <span className="text-info mt-3">Project Name</span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Project Name is required",
                            },
                            {
                              pattern: /^[&,.\-_\w\s]{1,50}$/,
                              message:
                                "Please enter a valid Project Name (up to 50 characters, only &, , ., -, _ special characters are allowed)",
                            },
                          ]}
                        >
                          {/* <Input /> */}

                          <Select
                            showSearch
                            allowClear
                            placeholder="Select"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.label
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            className="rounded-2"
                            // value={project_id}

                            required
                          >
                            {projectList.map((project) => (
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
                    </Row>
                    <Row gutter={[8, 4]}>
                      <Col span={12}>
                        <Form.List name="module_name">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(({ key, name, ...restField }) => (
                                <Space
                                  key={key}
                                  style={{
                                    display: "flex",
                                    marginBottom: 4,
                                  }}
                                  align="baseline"
                                >
                                  <Form.Item
                                    {...restField}
                                    name={[name, "item"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Missing module name",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Module Name" />
                                  </Form.Item>

                                  <MinusCircleOutlined
                                    onClick={() => remove(name)}
                                  />
                                </Space>
                              ))}
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => add()}
                                  block
                                  icon={<PlusOutlined />}
                                >
                                  Add field
                                </Button>
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                      </Col>
                    </Row>
                  </Form>
                </Modal>
                {/* table */}
                <table className="table table-striped table-hover mt-5">
                  <thead>
                    <tr>
                      <th scope="col">S.No.</th>

                      <th scope="col">Project Name</th>
                      <th scope="col">Module Name</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {allModuleData.map((data, index) => {
                      return (
                        <tr key={data.designation_id}>
                          <th scope="row">{index + 1}</th>
                          {/* <td>{data.reporting_manager_id}</td> */}
                          {/* <td className='text-capitalize'>{data.employee_name}</td> */}
                          <td className="text-capitalize">
                            {data.project_name}
                          </td>
                          <td className="text-capitalize">
                            {data.module_name.map((item)=>(<Tag>{item.item}</Tag>))}
                          </td>
                          {/* <td className='text-capitalize'>{data.department}</td> */}

                          <td className="">
                            <EyeOutlined
                              onClick={() => openModuleView(data)}
                              style={{ color: "blue", marginRight: "1rem" }}
                            />
                            <EditOutlined
                              onClick={() => openModuleEdit(data)}
                              style={{ color: "blue", marginRight: "1rem" }}
                            />
                            <DeleteOutlined
                              onClick={() =>
                                deleteModuleHandler(data.designation_id)
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

export default ModuleMaster;
