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
  CONFIG_OBJ,
} from "../Config.js";
import axios from "axios";
import { toast } from "react-toastify";
import { Tag, Col, Form, Input, Modal, Row, Select } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, DatePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";

const { Option } = Select;
const { Search } = Input;

const ModuleMaster = () => {
  // search by project name
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  // const [designationList, setDesignationList] = useState([]);
  const [projectName, setProjectName] = useState("");

  // get all manager function with pagination
  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allModuleData, setAllModuleData] = useState([]);
  const [projectCheckDates, setProjectCheckDates] = useState({
    schedule_start_date: null,
    schedule_end_date: null,
  });
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const getAllModulesHandler = async (page) => {
    try {
      const response = await axios.get(
        `${getAllModules}?page=${page}&pageSize=${pageSize}&name=${projectName}`,CONFIG_OBJ
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
  // const moduleFormSubmit = (values) => {
  //   moduleForm
  //     .validateFields()
  //     .then((values) => {
  //       try {
  //         console.log("values",values);
  //         const project = projectList.find(
  //           (project) => project.project_id === values.project_id);

  //         if (project) {
  //           setProjectStartDate(project.schedule_start_date.slice(0,10));
  //           setProjectEndDate(project.schedule_end_date.slice(0,10));
  //           console.log("project start date", project.schedule_start_date);
  //           console.log("project end date", projectEndDate);
  //         }
  //         if((values.to_date >= values.from_date)&&(values.to_date!=null) &&(values.from_date!=null)
  //           && (values.from_date >= projectStartDate && values.from_date < projectEndDate)&&
  //         (values.to_date <= projectEndDate && values.to_date > projectStartDate)
  //       )
  //         {

  //         const requestData = {
  //           ...values,
  //           id: editingModule ? editingModule.project_id : null,
  //         };
  //         const url = editingModule
  //           ? `${editModule}/${editingModule.project_id}`
  //           : `${createModule}`;
  //         const response = axios.post(url, requestData);
  //         if (response.status) {
  //           if (editingModule && editingModule.project_id !== null) {
  //             toast.success("Module Updated Successfully!");
  //           } else {
  //             toast.success("Module Added Successfully!");
  //           }
  //           console.log("response added", response.data);
  //           moduleForm.resetFields();
  //           setModalVisible(false);
  //           getAllModulesHandler();

  //           getAllModulesHandler();
  //         } else {
  //           console.log(response.data.message);
  //           // toast.error(response.data.message);
  //         }
  //       }else{
  //         toast.error("Select valid date range");
  //       }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     })
  //     .catch((errorInfo) => {
  //       console.log("Validation failed:", errorInfo);
  //     });
  // };

  // const moduleFormSubmit = (values) => {
  //   moduleForm
  //     .validateFields()
  //     .then((values) => {
  //       try {
  //         console.log("values", values);
  //         const project = projectList.find(
  //           (project) => project.project_id === values.project_id
  //         );

  //         if (project) {
  //           const projectStartDate = (project.schedule_start_date.toString()).slice(0, 10);
  //           const projectEndDate = (project.schedule_end_date.toString().slice(0, 10));
  //           console.log("project start date", projectStartDate);
  //           console.log("project end date", projectEndDate);
  //           console.log("values.from_date", values.from_date);
  //         console.log("values.to_date", values.to_date);

  //           if (
  //             values.to_date >= values.from_date &&
  //             values.to_date !== null &&
  //             values.from_date !== null &&
  //             values.from_date >= projectStartDate &&
  //             values.from_date < projectEndDate &&
  //             values.to_date <= projectEndDate &&
  //             values.to_date > projectStartDate
  //           ) {
  //             const requestData = {
  //               ...values,
  //               id: editingModule ? editingModule.project_id : null,
  //             };
  //             const url = editingModule
  //               ? `${editModule}/${editingModule.project_id}`
  //               : `${createModule}`;
  //             axios
  //               .post(url, requestData)
  //               .then((response) => {
  //                 if (response.status) {
  //                   if (editingModule && editingModule.project_id !== null) {
  //                     toast.success("Module Updated Successfully!");
  //                   } else {
  //                     toast.success("Module Added Successfully!");
  //                   }
  //                   console.log("response added", response.data);
  //                   moduleForm.resetFields();
  //                   setModalVisible(false);
  //                   getAllModulesHandler();
  //                 } else {
  //                   console.log(response.data.message);
  //                   // toast.error(response.data.message);
  //                 }
  //               })
  //               .catch((error) => {
  //                 console.log("Error in post request:", error);
  //               });
  //           } else {
  //             toast.error("Select valid date range");
  //           }
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     })
  //     .catch((errorInfo) => {
  //       console.log("Validation failed:", errorInfo);
  //     });
  // };
  const getProjectStartEndDate = (value) => {
    const project = projectList?.find(
      (project) => project.project_id === value
    );
    console.log("project selected", project);
    setProjectCheckDates({
      schedule_start_date: project?.schedule_start_date,
      schedule_end_date: project?.schedule_end_date,
    });
    // console.log("dates object", projectCheckDates);
  };
  const disabledStartDate = (current) => {
    const startDate = projectCheckDates.schedule_start_date
      ? moment(projectCheckDates.schedule_start_date)
      : null;
    const endDate = projectCheckDates.schedule_end_date
      ? moment(projectCheckDates.schedule_end_date)
      : null;
    // Disable dates that are before the start date or after the end date
console.log(startDate,"dbjwnwdenkn")
    return (
      current &&
      ((startDate && current < startDate.startOf("day")) ||
        (endDate && current > endDate.endOf("day")))
    );
  };
  // const disabledEndDate = (current, from_dateValue) => {
  //   if (!from_dateValue) {
  //     // If from_date is not selected yet, disable all dates
  //     return true;
  //   }
  //   console.log("delecteddate", moment(from_dateValue, "DD/MM/YYYY"));
  //   // Convert the from_dateValue and endDate to moment objects
  //   const from_dateMoment = moment(from_dateValue, "DD/MM/YYYY");
  //   const startDate = projectCheckDates.schedule_start_date
  //     ? moment(projectCheckDates.schedule_start_date)
  //     : null;
  //   const endDate = projectCheckDates.schedule_end_date
  //     ? moment(projectCheckDates.schedule_end_date)
  //     : null;
  //   // Disable dates that are before the start date or after the end date

  //   return (
  //     current &&
  //     ((startDate && current < startDate.startOf("day")) ||
  //       (endDate && current > endDate.endOf("day")))
  //   );
  // };
  // const disabledEndDate = (current, from_dateValue) => {
  //   if (!from_dateValue) {
  //     // If from_date is not selected yet, disable all dates
  //     return true;
  //   }

  //   const startDate = projectCheckDates.schedule_start_date
  //     ? moment(projectCheckDates.schedule_start_date)
  //     : null;
  //   const endDate = projectCheckDates.schedule_end_date
  //     ? moment(projectCheckDates.schedule_end_date)
  //     : null;
  //   const from_dateMoment = moment(from_dateValue, "DD/MM/YYYY");
  //   // Disable dates that are before the start date or after the end date

  //   return (
  //     current &&
  //     ((from_dateMoment && current < from_dateMoment.startOf("day")) ||
  //       (startDate && current < startDate.startOf("day")) ||
  //       (endDate && current > endDate.endOf("day")))
  //   );
  // };
  const disabledEndDate = (current, from_dateValue) => {
    if (!from_dateValue) {
      // If from_date is not selected yet, disable all dates
      return true;
    }

    const startDate = projectCheckDates.schedule_start_date
      ? moment(projectCheckDates.schedule_start_date)
      : null;
    const endDate = projectCheckDates.schedule_end_date
      ? moment(projectCheckDates.schedule_end_date)
      : null;
    const from_dateMoment = moment(from_dateValue);
    // Disable dates that are before the selected from_dateMoment,
    return (
      current &&
      ((from_dateMoment && current < from_dateValue.startOf("day")) ||
        (endDate && current > endDate.endOf("day")))
    );
  };

  const moduleFormSubmit = (values) => {
    moduleForm
      .validateFields()
      .then((values) => {
        try {
          // Iterate through each module in the values array
          values.module_name.forEach((module) => {
            const project = projectList.find(
              (project) => project.project_id === values.project_id
            );

            if (project) {
              const projectStartDate = project.schedule_start_date
                .toString()
                .slice(0, 10);
              const projectEndDate = project.schedule_end_date
                .toString()
                .slice(0, 10);
              console.log("project start date", projectStartDate);
              console.log("project end date", projectEndDate);
              console.log("values.from_date", module.from_date);
              console.log("values.to_date", module.to_date);

              if(module.to_date >= module.from_date)
                {               
              // Your existing code for submitting the form
              const requestData = {
                ...values,
                id: editingModule ? editingModule.project_id : null,
              };
              const url = editingModule
                ? `${editModule}/${editingModule.project_id}`
                : `${createModule}`;
              axios
                .post(url, requestData,CONFIG_OBJ)
                .then((response) => {
                  if (response.status) {
                    if (editingModule && editingModule.project_id !== null) {
                      toast.success("Module Updated Successfully!");
                    } else {
                      toast.success("Module Added Successfully!");
                    }
                    console.log("response added", response.data);
                    moduleForm.resetFields();
                    setModalVisible(false);
                    getAllModulesHandler(currentPage);
                  } else {
                    console.log(response.data.message);
                    // toast.error(response.data.message);
                  }
                })
                .catch((error) => {
                  console.log("Error in post request:", error);
                });
              }else{
                toast.error("To date should be greater than from date");
              }
            } else {
              console.log("Project not found:", module.project_id);
              toast.error("Project not found");
            }
          });
        } catch (error) {
          console.log("Error:", error);
          toast.error("An error occurred");
        }
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
        toast.error("Validation failed");
      });
  };

  const deleteModuleHandler = async (id) => {
    try {
      const response = await axios.delete(`${deleteModule}` + id,CONFIG_OBJ);
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
    to_date: "",
    from_date: "",
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
    console.log("view module", module);
    moduleForm.setFieldsValue({
      project_id: module.project_id,
      module_id: module.module_id,

      module_name: module.module_name.map((item) => ({
        ...item,
        from_date: dayjs(item.from_date),
        to_date: dayjs(item.to_date),
      })),
    });
  };

  const openModuleEdit = async (module) => {
    setEditingModule(module);
    setFormDisabled(false);
    console.log("editing module", module);
    setModalVisible(true);
    getProjectStartEndDate(module.project_id);
    console.log("from date", module.module_name[0].from_date);
    console.log(dayjs(module.module_name[0].from_date).format("DD/MM/YYYY"));
    moduleForm.setFieldsValue({
      module_id: module.module_id,
      // module_name: module.module_name,

      project_id: module.project_id,
      module_name: module.module_name.map((item) => ({
        ...item,

        // from_date: moment(item.from_date).format("DD/MM/YYYY"),
        // to_date: dayjs(item.to_date).format("DD/MM/YYYY"),
        from_date: dayjs(item.from_date),
        to_date: dayjs(item.to_date),
        // to_date: item.to_date ? item.to_date.slice(0, 10) : "",
        // from_date: item.from_date ? item.from_date.slice(0, 10) : "",
      })),
    });
  };

  // GET PROJECT LIST
  const [projectList, setProjectList] = useState([]);
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const getProjects = async (value) => {
    try {
      const result = await axios.get(`${getAllProjects}`,CONFIG_OBJ);

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
                    setProjectCheckDates({
                      schedule_start_date: null,
                      schedule_end_date: null,
                    });
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
                      <Col span={24}>
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
                            onChange={getProjectStartEndDate}
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
                        {/* <Form.Item
                        hidden
                        name="schedule_start_date"
                        >
                            <Input/>
                          </Form.Item>
                          <Form.Item
                        hidden
                        name="schedule_end_date"
                        >
                            <Input/>
                          </Form.Item> */}
                      </Col>
                    </Row>
                    {/* <p>Module Name</p> */}
                    <Row gutter={[8, 4]}>
                      <Col span={24}>
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
                                    hidden
                                    name={[name, "module_id"]}
                                  >
                                    <Input placeholder="Module Id" />
                                  </Form.Item>

                                  <Form.Item
                                    {...restField}
                                    name={[name, "item"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Missing module name",
                                      },
                                    ]}
                                    label={
                                      name === 0 ? (
                                        <span className="text-info">
                                          Module Name
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    }
                                  >
                                    <Input
                                      placeholder="Module Name"
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>

                                  {/* New input field for "to_date" */}
                                  <Form.Item
                                    {...restField}
                                    name={[name, "from_date"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Missing from date",
                                      },
                                    ]}
                                    label={
                                      name === 0 ? (
                                        <span className="text-info">
                                          From Date
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    }
                                  >
                                    {/* <Input
                                      type="date"
                                      //  allowClear
                                      style={{ width: "88%" }}
                                    /> */}
                                    <DatePicker
                                      disabledDate={disabledStartDate}
                                      format={"DD/MM/YYYY"}
                                    />
                                  </Form.Item>

                                  <Form.Item
                                    {...restField}
                                    name={[name, "to_date"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Missing to date",
                                      },
                                    ]}
                                    label={
                                      name === 0 ? (
                                        <span className="text-info">
                                          To Date
                                        </span>
                                      ) : (
                                        ""
                                      )
                                    }
                                  >
                                    {/* <Input
                                      type="date"
                                      // allowClear
                                      style={{ width: "88%" }}
                                    /> */}
                                    <DatePicker
                                      // disabledDate={disabledEndDate}
                                      disabledDate={(current) =>
                                        disabledEndDate(
                                          current,
                                          moduleForm.getFieldValue([
                                            "module_name",
                                            name,
                                            "from_date",
                                          ])
                                        )
                                      }
                                      format={"DD/MM/YYYY"}
                                    />
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
                    {allModuleData?.map((data, index) => {
                      return (
                        <tr key={data.project_id}>
                          <th scope="row">{index + 1}</th>
                          {/* <td>{data.reporting_manager_id}</td> */}
                          {/* <td className='text-capitalize'>{data.employee_name}</td> */}
                          <td className="text-capitalize">
                            {data.project_name}
                          </td>
                          <td className="text-capitalize">
                            {data.module_name.map((item) => (
                              <Tag>{item.item}</Tag>
                            ))}
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
                                deleteModuleHandler(data.project_id)
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
