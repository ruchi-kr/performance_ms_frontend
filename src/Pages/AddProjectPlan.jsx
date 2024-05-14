import {
  ArrowUpOutlined,
  DeleteFilled,
  EditFilled,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import {
  NavLink,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  Button,
  Card,
  Cascader,
  Col,
  DatePicker,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  Tag,
  Modal,
  Tooltip,
  notification,
  Typography,
  InputNumber,
} from "antd";
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";

import { useEffect, useState } from "react";
import {
  getAllModules,
  createModule,
  editModule,
  deleteModule,
  getAllProjects,
} from "../Config.js";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import styles from "./AddProjectPlan.module.css";
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { Title } = Typography;
dayjs.extend(utc);
dayjs.extend(timezone);
const AddProjectPlan = () => {
  const [form] = Form.useForm();
  const [formTask] = Form.useForm();

  const [userData, setUserData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [projectCheckDates, setProjectCheckDates] = useState({
    schedule_start_date: null,
    schedule_end_date: null,
  });
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedModuleIdToFetch, setSelectedModuleIdToFetch] = useState(null);
  // GET PROJECT LIST
  const [projectList, setProjectList] = useState([]);
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [projectName, setProjectName] = useState("");
  const [moduleList, setModuleList] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  // const { location } = useLocation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const project_id = queryParams.get("project_id");
  const stage = queryParams.get("stage");

  const getProjects = async (value) => {
    try {
      const result = await axios.get(`${getAllProjects}`);

      setProjectList(result.data);

      const projectDetails = result.data.find(
        (project) => project.project_id === Number(project_id)
      );
      setProjectName(projectDetails.project_name);
    } catch (error) {
      console.log("Error fetching project list data", error);
    }
  };

  const [taskData, setTaskData] = useState([]);

  const getModuleListWithTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/getAllModule/${project_id}/?page=1&pageSize=100000&search=`
      );
      console.log("module with their tasks", response.data.data);
      setModuleList(response.data.data);
      // setTaskData(response.data.data.tasks);
      //   if (response.data.results !== undefined) {
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getModuleListHandler = async () => {
    try {
      // const response = await axios.get(
      //   `http://localhost:8000/api/admin/getModule/${project_id}/?page=${pagination.currentPage}&pageSize=${pagination.pageSize}&search=${search}`
      // );
      const response = await axios.get(
        `http://localhost:8000/api/admin/getAllModule/${project_id}/?page=1&pageSize=100000&search=`
      );
      console.log("module with their tasks", response.data.data);
      setModuleList(response.data.data);
      // console.log("module list", response.data.results);
      form.setFieldsValue({
        project_id: Number(project_id),
      });

      if (response.data.results !== undefined) {
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
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProjects();
    getModuleListHandler();
    getModuleListWithTasks();
  }, []);
  useEffect(() => {
    getModuleListHandler();
  }, [pagination.currentPage, pagination.pageSize]);

  // search functionality

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      onSearch();
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const onSearch = async () => {
    if (search === null || search === undefined) return;

    getModuleListHandler();
  };

  const moduleChangeHandler = (value) => {
    console.log(" module value", value);
    setSelectedModuleId(value);
  };
  const moduleChangeHandlerToFetch = (value) => {
    console.log(" module value", value);
    setSelectedModuleIdToFetch(value);
  };
  const handleEdit = (record) => {
    console.log("handle edit", record);
    setIsEditing(true);
    console.log("type of user active", moment(record.from_date));
    getProjectStartEndDate(record.project_id);
    form.setFieldsValue({
      module_id: record.module_id,
      module_name: record.module_name,
      project_id: record.project_id,
      from_date: dayjs.utc(record.from_date).tz("Asia/Kolkata"),
      to_date: dayjs(record.to_date),
      status: record.status,
    });
    setIsEditing(true);
  };

  const handleDelete = async (record) => {
    console.log("record to delete", record);
    confirm({
      title: "Are You sure you want to delete the record!",
      icon: <ExclamationCircleFilled />,
      // content: "Be sure before deleting, this process is irreversible!",
      centered: true,
      async onOk() {
        try {
          await axios.delete(
            `http://localhost:8000/api/admin/deleteModule/${record.module_id}`
          );
          notification.success({
            message: "Success",
            description: "Record deleted Successfully.",
          });
          getModuleListHandler();
        } catch (error) {
          // console.error("Error Adding project:", error);
          notification.error({
            message: "Failed",
            description: `${error}`,
          });
        }
      },
      onCancel() {},
    });
  };

  const handleDeleteTask = async (record) => {
    console.log("record to delete", record);
    confirm({
      title: "Are You sure you want to delete the record!",
      icon: <ExclamationCircleFilled />,
      // content: "Be sure before deleting, this process is irreversible!",
      centered: true,
      async onOk() {
        try {
          await axios.delete(
            `http://localhost:8000/api/module/task/${record.task_id}`
          );
          notification.success({
            message: "Success",
            description: "Record deleted Successfully.",
          });
          getModuleTaskList();
        } catch (error) {
          // console.error("Error Adding project:", error);
          notification.error({
            message: "Failed",
            description: `${error}`,
          });
        }
      },
      onCancel() {},
    });
  };

  const handleEditTask = (record) => {
    console.log("handle edit", record);
    setIsEditing(true);
    // console.log("type of user active", moment(record.from_date));
    // getProjectStartEndDate(record.project_id);
    form.setFieldsValue({
      task_id: record.task_id,
      module_id: record.module_id,
      task_name: record.task_name,
      allocated_time: record.allocated_time,
    });
    setIsEditingTask(true);
  };

  // console.log("selctedUser", selectedUser);
  const onFinish = async (values) => {
    if (isAdding && !isEditing) {
      try {
        console.log("onFinish before sending values adding", values);
        await axios.post("http://localhost:8000/api/admin/addModule", {
          ...values,
          stage: stage,
        });
        getModuleListHandler();
        handleReset();
        notification.success({
          message: "Module Added.",
          description: "Successfully",
        });
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Failed to add Module.",
          description: "Try Again !",
        });
      }
    }

    if (isEditing && !isAdding) {
      console.log("values inside edit!!!!", values);
      try {
        await axios.patch(
          `http://localhost:8000/api/admin/editModule/${values.module_id}`,
          values
        );
        handleReset();
        getModuleListHandler(); // Refresh the zone list after update

        notification.success({
          message: "Success",
          description: "Record updated.",
        });
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Failed",
          description: "Unable to update record",
        });
      }
    }
  };
  const onFinishTask = (values) => {
    console.log(values);
  };
  const onFinishFailedTask = (values) => {
    console.log(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    notification.error({
      message: "Invalid Input!",
      description: "Please provide valid input",
    });
  };

  const handleReset = () => {
    form.resetFields();
    setSearch("");
    setIsAdding(false);
    setIsAddingTask(false);
    setIsEditing(false); // Reset the form fields
    setIsEditingTask(false);
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
  const getProjectStartEndDate = (value) => {
    const projectId = value || project_id;
    setTimeout(() => {}, 3000);
    console.log("project selected", projectList);
    if (projectList.length > 0) {
      const project = projectList?.find(
        (project) => project.project_id === Number(projectId)
      );
      setProjectCheckDates({
        schedule_start_date: project?.schedule_start_date,
        schedule_end_date: project?.schedule_end_date,
      });
      console.log("poroject", project);
    }

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
    console.log("disabdwjkdkawd", startDate);
    return (
      current &&
      ((startDate && current < startDate.startOf("day")) ||
        (endDate && current > endDate.endOf("day")))
    );
  };

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

  const columns = [
    {
      title: "S.No",
      dataIndex: "module_id",
      key: "module_id",
      render: (_, record, index) => {
        // Calculate the serial number based on the current page and the index of the item
        return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: (
        <div>
          Module Name
          {/* {
            <ArrowUpOutlined
              style={{ marginLeft: 12, fontSize: "1rem" }}
              onClick={handleSortChange}
              rotate={sortOrder === "ASC" ? 0 : 180}
            />
          } */}
        </div>
      ),
      dataIndex: "module_name",
      key: "module_name",
    },

    {
      title: "Schd. St. Dt.",
      dataIndex: "from_date",
      key: "from_date",
      render: (text) => moment(text).utcOffset("+05:30").format("DD/MM/YYYY"),
    },
    {
      title: "Schd. End Dt.",
      dataIndex: "to_date",
      key: "to_date",
      render: (text) => moment(text).utcOffset("+05:30").format("DD/MM/YYYY"),
    },

    {
      title: "Status  ",
      dataIndex: "status",
      key: "status",
      align: "center",

      // render: (text) => (text ? "Active" : "Inactive"),
    },

    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: 100,
      render: (_, record) => (
        <div className="d-flex justify-content-center gap-2">
        
          <Button
            size="small"
            className="d-flex align-items-center"
            onClick={() => setIsAddingTask(true)}
          >
            <PlusOutlined />
            Task
          </Button>
          <EditFilled
            type="primary"
            style={{
              marginRight: "9px",
              color: "green",
              textAlign: "center",
            }}
            onClick={() => {
              handleEdit(record);
              setIsAdding(false);
            }}
          />
          <DeleteFilled
            type="primary"
            style={{ color: "red" }}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  const taskColumn = [
    {
      title: <div className="text-primary">S.No</div>,
      dataIndex: "task_id",
      key: "task_id",
      render: (_, record, index) => {
        // Calculate the serial number based on the current page and the index of the item
        if (record.task_id === null) {
          return "-";
        }
        return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: <div className="text-primary">Task Name</div>,
      dataIndex: "task_name",
      key: "task_name",
      render: (text) => `${text ? text : "-"}`,
    },

    {
      title: <div className="text-primary">Allocated Time</div>,
      dataIndex: "allocated_time",
      key: "allocated_time",
      render: (text) => `${text ? `${text} hrs` : "-"}`,
    },

    {
      title: <div className="text-primary">Action</div>,
      dataIndex: "action",
      align: "center",
      key: "action",
      width: 100,
      // render: (_, record) => (
      //   <div>

      //     <EditOutlined
      //       type="primary"
      //       style={{
      //         marginRight: "9px",
      //         color: "green",
      //         textAlign: "center",
      //       }}
      //       onClick={() => {
      //         handleEdit(record);
      //         setIsAdding(false);
      //       }}
      //     />
      //     <DeleteOutlined
      //       type="primary"
      //       style={{ color: "red" }}
      //       onClick={() => handleDelete(record)}
      //     />
      //   </div>
      // ),
      render: (_, record) => (
        <div>
          {record.task_id !== null ? (
            <>
              <EditOutlined
                type="primary"
                style={{
                  marginRight: "9px",
                  color: "green",
                  textAlign: "center",
                }}
                onClick={() => {
                  handleEditTask(record);
                  setIsAddingTask(false);
                }}
              />
              <DeleteOutlined
                type="primary"
                style={{ color: "red" }}
                onClick={() => handleDeleteTask(record)}
              />
            </>
          ) : (
            <span>-</span>
          )}
        </div>
      ),
    },
  ];

  const [status, setStatus] = useState("notstarted");
  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            <div className="row my-5">
              <Row justify={"center"}>
                <Col style={{ paddingBottom: "0" }}>
                  <Title level={3} className="text-info text-capitalize">
                    {projectName}
                  </Title>
                  <Title level={3} className="text-info text-capitalize">
                    {projectName}
                  </Title>
                </Col>
              </Row>
              <Row>
                <div className=" col-2 d-flex flex-column">
                  <label className="text-capitalize fw-bold text-info">
                    Select Module
                  </label>
                  <Select
                    allowClear={true}
                    onChange={moduleChangeHandler}
                    placeholder="Select Module"
                    style={{ width: "100%" }}
                  >
                    {moduleList.map((module) => (
                      <Option
                        key={module.module_id}
                        value={module.module_id}
                        disabled={
                          module.status === "scrapped" ||
                          module.status === "completed"
                        }
                      >
                        {module.module_name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Row>
              <Row justify="end">
                <Col>
                  <label className="text-info" style={{ marginBottom: "10px" }}>
                    Module Name
                  </label>
                  <Search
                    placeholder="Search by Module Name"
                    onSearch={onSearch}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    enterButton
                    style={{ marginBottom: "16px" }}
                    className={styles.searchStyle}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                {
                  <Col>
                    <Button type="primary" disabled={!selectedModuleId}>
                      <NavLink
                        to={`/addmoduletasks/?project_id=${project_id}&module_id=${selectedModuleId}&stage=${stage}`}
                        // className="btn btn-sm btn-info d-flex align-items-center justify-content-center"
                      >
                        <span className="fs-4"> + </span>&nbsp;Add Module Tasks
                      </NavLink>
                    </Button>
                  </Col>
                }

                <Col>
                  <NavLink
                    to={`/projectplan`}
                    className="btn btn-sm btn-info d-flex align-items-center justify-content-center"
                  >
                    <span className="fs-4"> &larr; </span>&nbsp;Back To All
                    Plans
                  </NavLink>
                </Col>
              </Row>
              <Table
                rowKey={(record) => record.module_id}
                columns={columns}
                dataSource={moduleList}
                loading={loading}
                bordered
                size="small"
                pagination={false}
                // scroll={{ y: false }} // Disable vertical scroll
                style={{
                  marginBottom: "1rem",
                }}
                expandable={{
                  expandedRowRender: (record) => (
                    <Table
                      rowKey={(task) => task.task_id}
                      columns={taskColumn}
                      dataSource={record.tasks} // Use the tasks array from the record
                      pagination={false} // Disable pagination for nested table
                      size="small"
                      style={{ width: "90%" }}
                    />
                  ),
                }}
              />

              <Pagination
                current={pagination.currentPage}
                total={pagination.totalRecords}
                pageSize={pagination.pageSize}
                onChange={handlePageChange}
                showLessItems={false}
                onShowSizeChange={pageSizeChange}
                showQuickJumper={true}
                showPrevNextJumpers={true}
                showSizeChanger={true}
                onPrev={() => handlePageChange(pagination.prevPage)}
                onNext={() => handlePageChange(pagination.nextPage)}
                style={{
                  marginBottom: "2rem",
                }}
              />

              <Row justify="center" align="middle">
                <Col>
                  {!isAdding &&
                    !isEditing &&
                    // !isAddingTask&&
                     (
                      <Button
                        onClick={() => {
                          setIsAdding(true);
                          setIsEditing(false);
                          getProjectStartEndDate(Number(project_id));
                          form.setFieldsValue({
                            project_id: project_id,
                            status: "notstarted",
                          });
                        }}
                        type="primary"
                        style={{ minWidth: "10rem" }}
                      >
                        <div>
                          <PlusOutlined
                            style={{
                              marginRight: "0.5rem",
                            }}
                          />
                          Add Module
                        </div>
                      </Button>
                    )}
                </Col>
                <Col align="left" style={{ width: "100%" }}>
                  {(isAdding || isEditing) &&(
                    // (!isAddingTask || !isEditingTask) && (
                      <Card>
                        {isAdding ? (
                          <h4 className="text-info">Add Module</h4>
                        ) : (
                          <h4 className="text-info">Edit Module</h4>
                        )}
                        {(isAdding || isEditing) && (
                          <Form
                            colon={false}
                            layout="vertical"
                            labelAlign="left"
                            form={form}
                            name="basic"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="on"
                            className=""
                            style={{ paddingTop: "2rem" }}
                          >
                            <Row gutter={16}>
                              <Col span={24}>
                                <Form.Item
                                  label="Module Id"
                                  name="module_id"
                                  hidden
                                >
                                  <Input placeholder={editUserId} />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={24}>
                            <Col span={6}>
                                <Form.Item
                                  label="Project"
                                  name="project_id"
                                  // style={{ maxWidth: "50%" }}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please select project !",
                                    },
                                  ]}
                                >
                                  <Select
                                    disabled
                                    placeholder="Select Project"
                                    allowClear={true} // Disable the clear button
                                    // className={styles.cascaderStyle}
                                    onChange={getProjectStartEndDate}
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
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={24}>
                             
                              <Col span={6}>
                                <Form.Item
                                  label="Module Name"
                                  name="module_name"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter module name !",
                                    },

                                    {
                                      pattern: /^[&,.\-_\w\s]{1,50}$/,
                                      message:
                                        "Please enter a valid Module Name (up to 50 characters, only &, , ., -, _ special characters are allowed)",
                                    },
                                  ]}
                                >
                                  <Input
                                    suffix={
                                      <Tooltip title="Please input a valid module name">
                                        <InfoCircleOutlined
                                          style={{
                                            color: "rgba(0,0,0,.45)",
                                          }}
                                        />
                                      </Tooltip>
                                    }
                                    placeholder="module name"
                                    style={{ marginLeft: "4" }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  label="Status"
                                  name="status"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please select Status !",
                                    },
                                  ]}
                                  // defaultValue="notstarted"
                                  // style={{ maxWidth: "50%" }}
                                >
                                  <Select
                                    // value={status}
                                    // onChange={(value) => setStatus(value)}
                                    // defaultValue="notstarted"
                                    options={[
                                      {
                                        value: "notstarted",
                                        label: (
                                          <span className="text-warning">
                                            Yet To Start
                                          </span>
                                        ),
                                      },

                                      {
                                        value: "ongoing",
                                        label: (
                                          <span className="text-primary">
                                            ongoing
                                          </span>
                                        ),
                                      },
                                      {
                                        value: "completed",
                                        label: (
                                          <span className="text-success">
                                            completed
                                          </span>
                                        ),
                                      },
                                      {
                                        value: "scrapped",
                                        label: (
                                          <span className="text-danger">
                                            scrapped
                                          </span>
                                        ),
                                      },
                                    ]}
                                    // onChange={handleChange}
                                    placeholder="Status "
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item
                                  label="Schd. Start Date"
                                  name="from_date"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Please input schedule start date !",
                                    },
                                  ]}
                                >
                                  <DatePicker
                                    disabledDate={disabledStartDate}
                                    format="DD/MM/YYYY"
                                    // style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item
                                  label="Schd. End Date"
                                  name="to_date"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Please input schedule end date !",
                                    },
                                  ]}
                                  // style={{ maxWidth: "50%" }}
                                >
                                  <DatePicker
                                    disabledDate={(current) =>
                                      disabledEndDate(
                                        current,
                                        form.getFieldValue("from_date")
                                      )
                                    }
                                    format="DD/MM/YYYY"
                                    // style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                          
                            <Row justify="start">
                              <Col>
                                <Form.Item>
                                  <div className={styles.buttonStyle2}>
                                    <Button
                                      type="primary"
                                      danger
                                      htmlType="button"
                                      onClick={handleReset}
                                      className="me-3"
                                      // className={styles["login-form-button"]}
                                      // style={{
                                      //   minWidth: "11rem",
                                      //   marginRight: "1rem",
                                      // }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="primary"
                                      htmlType="submit"
                                      // className={styles["login-form-button"]}
                                      // style={{ minWidth: "11rem" }}
                                    >
                                      {isAdding ? "Add" : "Update"}
                                    </Button>
                                  </div>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Card>
                    )}
                </Col>
                <Col align="left" style={{ width: "100%" }}>
                  {(
                    // !isAdding ||
                    // !isEditing )
                    // ||
                    isAddingTask ||
                    isEditingTask) && 
                    (
                    <Card>
                      {isAddingTask ? (
                        <h4 className="text-info">Add Task</h4>
                      ) : (
                        <h4 className="text-info">Edit Task</h4>
                      )}
                      {(isAddingTask || isEditingTask) && (
                        <Form
                          colon={false}
                          layout="vertical"
                          labelAlign="left"
                          form={formTask}
                          name="basic"
                          onFinish={onFinishTask}
                          onFinishFailed={onFinishFailedTask}
                          autoComplete="on"
                          style={{ paddingTop: "2rem" }}
                        >
                          <Row gutter={16}>
                            <Col span={24}>
                              <Form.Item label="Task Id" name="task_id" hidden>
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={24}>
                            <Col span={8}>
                              <Form.Item
                                label="Module"
                                name="module_id"
                                // style={{ maxWidth: "50%" }}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select module !",
                                  },
                                ]}
                              >
                                <Select
                                  disabled
                                  placeholder="Select Module"
                                  allowClear={true} // Disable the clear button
                                  // className={styles.cascaderStyle}
                                  // onChange={getProjectStartEndDate}
                                >
                                  {moduleList.map((module) => (
                                    <Option
                                      key={module.module_id}
                                      value={module.module_id}
                                      disabled={
                                        module.status === "scrapped" ||
                                        module.status === "completed"
                                      }
                                    >
                                      {module.module_name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                label="Task Name"
                                name="task_name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input task name!",
                                  },
                                  {
                                    pattern: /^[&,.\-_\w\s]{1,50}$/,
                                    message:
                                      "Please enter a valid Task Name (up to 50 characters, only &, , ., -, _ special characters are allowed)",
                                  },
                                ]}
                                // style={{ maxWidth: "50%" }}
                              >
                                <Input
                                  maxLength={100}
                                  placeholder="task name"
                                  style={{ marginLeft: "4" }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                label="Allocated Time"
                                name="allocated_time"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input allocated time!",
                                  },
                                ]}
                                style={{ width: "100%" }}
                              >
                                <InputNumber
                                  min={0}
                                  max={100}
                                  step={1}
                                  precision={0}
                                />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row justify="start">
                            <Col>
                              <Form.Item>
                                <div className={styles.buttonStyle2}>
                                  <Button
                                    type="primary"
                                    danger
                                    htmlType="button"
                                    onClick={handleReset}
                                    className="me-3"
                                    // className={styles["login-form-button"]}
                                    // style={{
                                    //   minWidth: "11rem",
                                    //   marginRight: "1rem",
                                    // }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="primary"
                                    htmlType="submit"
                                    // className={styles["login-form-button"]}
                                    // style={{ minWidth: "11rem" }}
                                  >
                                    {isAddingTask ? "Add" : "Update"}
                                  </Button>
                                </div>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Form>
                      )}
                    </Card>
                  )}
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddProjectPlan;
