import {
  ArrowUpOutlined,
  ArrowLeftOutlined,
  DeleteFilled,
  EditFilled,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
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
  Space,
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
  CONFIG_OBJ,
} from "../Config.js";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import styles from "./AddProjectPlan.module.css";
import { render } from "@testing-library/react";
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { Title, Text } = Typography;
const { TextArea } = Input;
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
  const [totalManHours, setTotalmanHours] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
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

  //Epand all module cols
  const handleExpandAll = () => {
    const allRowKeys = moduleList.map((record) => record.module_id);
    setExpandedRowKeys(allRowKeys);
  };

  const handleCollapseAll = () => {
    setExpandedRowKeys([]);
  };

  const getProjects = async (value) => {
    try {
      const result = await axios.get(`${getAllProjects}`,CONFIG_OBJ);

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
        `http://localhost:8000/api/admin/getAllModule/${project_id}/?page=1&pageSize=100000&search=`,CONFIG_OBJ
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
        `http://localhost:8000/api/admin/getAllModule/${project_id}/?page=${pagination.currentPage}&pageSize=${pagination.pageSize}&search=${search}`,CONFIG_OBJ
      );
      console.log("module list", response.data.data);
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
    console.clear();
    console.log("Scroll Height:----->", document.body.scrollHeight);

    // Scroll to the bottom of the page
    window.scrollTo({
      // top: document.body.scrollHeight,
      top: 3000,
      behavior: "smooth", // Optional: smooth scrolling animation
    });
    setIsEditing(true);
    setIsAdding(false);
    setIsEditingTask(false);
    setIsAddingTask(false);
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
  };
  // const handleEditTask = (record) => {
  //   console.log("handle edit", record);
  //   setIsEditingTask(true);
  //   formTask.setFieldsValue({
  //     task_id: record.task_id,
  //     task_name: record.task_name,
  //     module_id: record.module_id,
  //     allocated_time: record.allocated_time,
  //   });
  //   setIsEditing(false);
  //   setIsEditingTask(true);
  // };

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
            `http://localhost:8000/api/admin/deleteModule/${record.module_id}`,CONFIG_OBJ
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
            description: `${error.response.data.msg}`,
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
          const response = await axios.delete(
            `http://localhost:8000/api/module/task/${record.task_id}`,CONFIG_OBJ
          );
          notification.success({
            message: "Success",
            description: "Record deleted Successfully.",
          });
          getModuleListWithTasks();
        } catch (error) {
          // console.error("Error Adding project:", error);
          notification.error({
            message: "Failed",
            description: `${error.response.data.error}`,
          });
        }
      },
      onCancel() {},
    });
  };

  const handleEditTask = (record) => {
    console.log("handle edit", record);
    setIsEditing(false);
    setIsAdding(false);
    setIsAddingTask(false);
    window.scrollTo({
      // top: document.body.scrollHeight,
      top: 2000,
      behavior: "smooth", // Optional: smooth scrolling animation
    });
    // console.log("type of user active", moment(record.from_date));
    // getProjectStartEndDate(record.project_id);
    formTask.setFieldsValue({
      task_id: record.task_id,
      module_id: record.module_id,
      task_name: record.task_name,
      allocated_time: record.allocated_time,
      description: record.description,
    });
    setIsEditingTask(true);
  };

  // console.log("selctedUser", selectedUser);
  const onFinish = async (values) => {
    if (isAdding && !isEditing) {
      try {
        console.log("onFinish before sending values adding", values);
        await axios.post("http://localhost:8000/api/admin/addModule",CONFIG_OBJ, {
          ...values,
          stage: stage,
        });
        getModuleListHandler();
        form.resetFields(["module_name", "from_date", "to_date", "status"]);
        // handleReset();
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
          `http://localhost:8000/api/admin/editModule/${values.module_id}`,CONFIG_OBJ,
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
  const onFinishTask = async (values) => {
    console.log(values);
    if (isAddingTask && !isEditingTask) {
      try {
        console.log("onFinish before sending values adding", values);
        // console.log("values inside edit!!!!", values);
        console.log("get field values all", formTask.getFieldsValue());

        await axios.post("http://localhost:8000/api/module/task",CONFIG_OBJ, {
          ...values,
          stage: stage,
        });
        formTask.resetFields(["task_name", "allocated_time"]);
        getModuleListWithTasks();
        // handleReset();
        // form.resetField("task_name")
        notification.success({
          message: "Task Added.",
          description: "Successfully",
        });
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Failed to add Task.",
          description: "Try Again !",
        });
      }
    }

    if (isEditingTask && !isAddingTask) {
      console.log("values inside edit!!!!", values);
      console.log("get field values", formTask.getFieldsValue());

      try {
        await axios.patch(
          `http://localhost:8000/api/module/task/${values.task_id}`,CONFIG_OBJ,
          values
        );
        handleReset();
        getModuleListWithTasks();
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
    formTask.resetFields();
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: smooth scrolling animation
    });
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

  //Man hours

  useEffect(() => {
    const frontend = formTask.getFieldsValue(["frontend"]);
    console.log("front end", frontend.count);
  }, [formTask]);

  const getManHours = () => {
    console.log("man hours", formTask.getFieldsValue());

    const fullstack = formTask.getFieldsValue(["fullstack"]);
    const backend = formTask.getFieldsValue(["backend"]);
    const frontend = formTask.getFieldsValue(["frontend"]);
    const design = formTask.getFieldsValue(["design"]);
    const qa = formTask.getFieldsValue(["qa"]);
    const pm = formTask.getFieldsValue(["pm"]);
    const special = formTask.getFieldsValue(["special"]);

    const fullstackmanhrs =
      fullstack.fullstack.count * fullstack.fullstack.days * 8;
    const frontendmanhrs = frontend.frontend.count * frontend.frontend.days * 8;
    const backendmanhrs = backend.backend.count * backend.backend.days * 8;
    const designmanhrs = design.design.count * design.design.days * 8;
    const qamanhrs = qa.qa.count * qa.qa.days * 8;
    const pmmanhrs = pm.pm.count * pm.pm.days * 8;
    const specialmanhrs = special.special.count * special.special.days * 8;
    const totalManHours =
      fullstackmanhrs +
      frontendmanhrs +
      backendmanhrs +
      designmanhrs +
      qamanhrs +
      pmmanhrs +
      specialmanhrs;
    console.log("total", totalManHours);
    formTask.setFieldValue("manhours", totalManHours);
    formTask.setFieldValue("allocated_time", totalManHours);
    setTotalmanHours(totalManHours);
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
    // {
    //   title: (
    //     <div>
    //       <Button
    //         onClick={handleExpandAll}
    //         style={{
    //           position: "absolute",
    //           top: "50%",
    //           left: "50%",
    //           transform: "translate(-10rem )",
    //         }}
    //       >
    //         Expand All
    //       </Button>
    //       <Button onClick={handleCollapseAll}>Collapse All</Button>
    //     </div>
    //   ),
    //   dataIndex: "expandCollapseButtons", // Data index that doesn't exist in dataSource
    //   key: "expandCollapseButtons",
    //   render: () => null, // Ensure this column renders nothing in the rows
    //   width: "20%", // Adjust the width as needed
    //   align: "center",
    // },
    {
      title: (
        <div>
          <p style={{ marginTop: "1rem" }}>S.No.</p>
          {expandedRowKeys.length === 0 ? (
            <PlusCircleOutlined
              onClick={handleExpandAll}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-4rem,-0.5rem )",
              }}
            />
          ) : (
            <MinusCircleOutlined
              onClick={handleCollapseAll}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-4rem,-0.5rem )",
              }}
            />
          )}
        </div>
      ),
      dataIndex: "module_id",
      key: "module_id",
      render: (_, record, index) => {
        // Calculate the serial number based on the current page and the index of the item
        return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
      },
      width: "5%",
      align: "center",
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
      render: (text) => (
        <p className="text-capitalize fs-6 fw-medium">{text}</p>
      ),
    },

    {
      title: "Schd. St. Dt.",
      dataIndex: "from_date",
      key: "from_date",
      render: (text) => (
        <span className="fs-6 fw-medium">
          {moment(text).utcOffset("+05:30").format("DD/MM/YYYY")}
        </span>
      ),
      // render: (text) => moment(text).utcOffset("+05:30").format("DD/MM/YYYY"),
      width: "10%",
    },
    {
      title: "Schd. End Dt.",
      dataIndex: "to_date",
      key: "to_date",
      render: (text) => (
        <span className="fs-6 fw-medium">
          {moment(text).utcOffset("+05:30").format("DD/MM/YYYY")}
        </span>
      ),

      // render: (text) => moment(text).utcOffset("+05:30").format("DD/MM/YYYY"),
      width: "10%",
    },

    // {
    //   title: "Status  ",
    //   dataIndex: "status",
    //   key: "status",

    //   render: (text) => <p className="text-capitalize">{text}</p>,
    //   width: "10%",
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        let color = "";
        switch (text) {
          case "ongoing":
            color = "text-primary";
            break;
          case "notstarted":
            color = "text-warning";
            break;
          case "completed":
            color = "text-success";
            break;
          case "scrapped":
            color = "text-danger";
            break;
          default:
            color = "text-dark";
            break;
        }
        return (
          <p className={`text-capitalize ${color} fs-6 fw-medium`}>{text}</p>
        );
      },
      width: "10%",
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <div className="d-flex justify-content-center gap-2">
          <Button
            size="small"
            className="d-flex align-items-center"
            onClick={() => {
              setIsAddingTask(true);
              setIsEditingTask(false);
              setIsAdding(false);
              setIsEditing(false);
              window.scrollTo({
                // top: document.body.scrollHeight,
                top: 2000,
                behavior: "smooth", // Optional: smooth scrolling animation
              });
              formTask.setFieldsValue({ module_id: record.module_id });
            }}
          >
            <PlusOutlined />
            Task
          </Button>
          <EditFilled
            type="primary"
            style={{
              marginLeft: "9px",
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
  const taskCounters = {};
  const taskColumn = [
    {
      title: <div className="text-primary">S.No</div>,
      dataIndex: "task_id",
      key: "task_id",
      align: "center",
      width: "5%",
      // render: (_, record, index) => {
      //   // Calculate the serial number based on the current page and the index of the item
      //   if (record.task_id === null) {
      //     return "-";
      //   }
      //   return index + 1;
      // },
      render: (_, record, index) => {
        // Get the module serial number (S.No.) from the index of the record in the module list
        const moduleNumber =
          moduleList.findIndex(
            (module) => module.module_id === record.module_id
          ) + 1;
        // Increment the task counter for the current module
        const taskNumber = index + 1;
        return `${moduleNumber}.${taskNumber}`;
      },
    },
    {
      title: <div className="text-primary">Task Name</div>,
      dataIndex: "task_name",
      key: "task_name",
      width:"20%",
      render: (text) => (
        <span className="text-capitalize">{text ? text : "-"}</span>
      ),
      // render: (text) => `${text ? text : "-"}`,
    },
    {
      title: <div className="text-primary">Description</div>,
      dataIndex: "description",
      key: "description",

      // render: (text) => `${text ? text : "-"}`,
    },

    {
      title: <div className="text-primary">Allocated Time (hrs)</div>,
      dataIndex: "allocated_time",
      key: "allocated_time",
      width: "10%",
      align: "left",
      render: (text) => `${text ? `${text} hrs` : "-"}`,
      
    },
    {
      title: "Module_id",
      dataIndex: "module_id",
      key: "module_id",
      hidden: true,
    },

    {
      title: <div className="text-primary">Action</div>,
      dataIndex: "action",
      align: "center",
      key: "action",
      width: "15%",
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
                  marginRight: "1rem",
                  marginLeft: "9px",
                  color: "green",
                  textAlign: "center",
                }}
                onClick={() => {
                  handleEditTask(record);
                  setIsEditingTask(true);
                  setIsAddingTask(false);
                  setIsAdding(false);
                  setIsEditing(false);
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

  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            <div className="row my-5">
              <Row justify={"start"} style={{ marginBottom: "3rem" }}>
                <Col style={{ paddingBottom: "0" }}>
                  <Title level={3}>
                    Project -{" "}
                    <span className="text-info text-capitalize">
                      {projectName}
                    </span>
                  </Title>
                  <Title level={4}>
                    Stage -{" "}
                    <span className="text-info text-capitalize">{stage}</span>
                  </Title>
                </Col>
              </Row>
              {/* <Row>
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
              </Row> */}
              <Row justify="end"></Row>
              <Row justify="space-between" style={{ marginBottom: "1rem" }}>
                {/* <Col>
                  <Button type="primary" disabled={!selectedModuleId}>
                    <NavLink
                      to={`/addmoduletasks/?project_id=${project_id}&module_id=${selectedModuleId}&stage=${stage}`}
                      // className="btn btn-sm btn-info d-flex align-items-center justify-content-center"
                    >
                      <span className="fs-4"> + </span>&nbsp;Add Module Tasks
                    </NavLink>
                  </Button>
                </Col> */}

                <Col>
                  <NavLink
                    to={`/projectplan/?project_id=${project_id}`}
                    className=" d-flex align-items-center"
                  >
                    <ArrowLeftOutlined style={{ fontSize: "1.5rem" }} />
                    &nbsp; Back{" "}
                  </NavLink>
                </Col>
                <Col>
                  {/* <label className="text-info" style={{ marginBottom: "10px" }}>
                    Module Name
                  </label> */}
                  <Search
                    placeholder="Search Module"
                    onSearch={onSearch}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    enterButton
                    style={{ marginBottom: "0" }}
                  />
                </Col>
              </Row>

              {/* <Table
                rowKey={(record) => record.module_id}
                columns={columns}
                dataSource={moduleList}
                loading={loading}
                bordered
                size="large"
                pagination={false}
                style={{
                  marginBottom: "1rem",
                }}
                className="custom-table"
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
              /> */}
              <Table
                rowKey={(record) => record.module_id}
                columns={columns}
                dataSource={moduleList}
                loading={loading}
                bordered
                size="large"
                pagination={false}
                style={{
                  marginBottom: "1rem",
                }}
                className="custom-table"
                expandable={{
                  expandedRowRender: (record) => (
                    <Table
                      rowKey={(task) => task.task_id}
                      columns={taskColumn}
                      dataSource={record.tasks} // Use the tasks array from the record
                      pagination={false} // Disable pagination for nested table
                      size="small"
                      bordered  
                      style={{ width: "90%" }}
                    />
                  ),
                  expandedRowKeys: expandedRowKeys,
                  onExpand: (expanded, record) => {
                    setExpandedRowKeys((prevExpandedRowKeys) => {
                      if (expanded) {
                        return [...prevExpandedRowKeys, record.module_id];
                      } else {
                        return prevExpandedRowKeys.filter(
                          (key) => key !== record.module_id
                        );
                      }
                    });
                  },
                }}
              />

              <Pagination
                disabled="true"
                current={pagination.currentPage}
                total={pagination.totalRecords}
                pageSize={pagination.pageSize}
                onChange={handlePageChange}
                showLessItems={false}
                onShowSizeChange={pageSizeChange}
                showQuickJumper={true}
                showPrevNextJumpers={true}
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
                    !isAddingTask &&
                    !isEditingTask && (
                      // !isAddingTask&&
                      <Button
                        onClick={() => {
                          setIsAdding(true);
                          setIsEditing(false);
                          setIsAdding(true);
                          setIsEditing(false);
                          getProjectStartEndDate(Number(project_id));
                          form.setFieldsValue({
                            project_id: Number(project_id),
                            status: "notstarted",
                          });
                        }}
                        type="primary"
                        style={{ minWidth: "10rem", marginBottom: "1rem" }}
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
                  {(isAdding || isEditing) && (
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
                                <Input placeholder={"Enter module_id"} />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={24}>
                            <Col span={14}>
                              <Form.Item
                                // hidden
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
                                  placeholder="module name"
                                  style={{ marginLeft: "4" }}
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
                                  // style={{ width: "16rem" }}
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
                                    message: "Please input schedule end date !",
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
                              >
                                <Select
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
                                        <span
                                          className={
                                            stage === "rfp"
                                              ? "text-secondary-subtle"
                                              : "text-success"
                                          }
                                        >
                                          completed
                                        </span>
                                      ),
                                      disabled: stage === "rfp",
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
                                  placeholder="Status "
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
                                  >
                                    Cancel
                                  </Button>
                                  <Button type="primary" htmlType="submit">
                                    {isAdding ? "Submit" : "Update"}
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
                  {(isAddingTask || isEditingTask) && (
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
                          // initialValues={{
                          //   fullstack: { count: 0, days: 0 },
                          //   frontend: { count: 0, days: 0 },
                          //   backend: { count: 0, days: 0 },
                          //   qa: { count: 0, days: 0 },
                          //   pm: { count: 0, days: 0 },
                          //   design: { count: 0, days: 0 },
                          //   special: { count: 0, days: 0 },
                          // }}
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
                              >
                                <Input
                                  maxLength={100}
                                  placeholder="task name"
                                  style={{ marginLeft: "4" }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                label="Allocated Time (Man Hrs.)"
                                name="allocated_time"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please provide allocated time!",
                                  },
                                ]}
                              >
                                <InputNumber
                                  min={0}
                                  max={500}
                                  style={{ width: "80%" }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={12}>
                              <Form.Item
                                label="Description"
                                name="description"
                                rules={[
                                  {
                                    required: false,
                                    message: "Please provide task description!",
                                  },
                                ]}
                              >
                                <TextArea
                                  showCount
                                  maxLength={500}
                                  placeholder="Enter description"
                                  style={{
                                    height: 120,
                                    resize: "none",
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>

                          {/* <Row>
                            <Row gutter={12}>
                              <Col span={3}>
                                <Form.Item
                                  label="Full-stack"
                                  name={["team", "fullstack"]}
                                >
                                  <Space.Compact>
                                    <Form.Item
                                      name={["fullstack", "count"]}
                                      label="No."
                                      noStyle
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const days = getFieldValue([
                                              "fullstack",
                                              "days",
                                            ]);

                                            if (
                                              (days !== null ||
                                                days !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error(
                                                  "Enter no. of members !"
                                                )
                                              );
                                            }
                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber
                                        style={{ width: "50%" }}
                                        placeholder="No."
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      name={["fullstack", "days"]}
                                      label="days"
                                      noStyle
                                      dependencies={[["fullstack", "count"]]}
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const count = getFieldValue([
                                              "fullstack",
                                              "count",
                                            ]);
                                            if (
                                              (count !== null ||
                                                count !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error("Enter no. of days !")
                                              );
                                            }

                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber
                                        style={{ width: "50%" }}
                                        placeholder="Days"
                                      />
                                    </Form.Item>
                                  </Space.Compact>
                                </Form.Item>
                              </Col>
                              <Col span={3}>
                                <Form.Item
                                  label="Front-end"
                                  name={["team", "frontend"]}
                                >
                                  <Space.Compact>
                                    <Form.Item
                                      name={["frontend", "count"]}
                                      noStyle
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const days = getFieldValue([
                                              "frontend",
                                              "days",
                                            ]);

                                            if (
                                              (days !== null ||
                                                days !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error(
                                                  "Enter no. of members !"
                                                )
                                              );
                                            }
                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber style={{ width: "50%" }} />
                                    </Form.Item>
                                    <Form.Item
                                      name={["frontend", "days"]}
                                      noStyle
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const count = getFieldValue([
                                              "frontend",
                                              "count",
                                            ]);
                                            if (
                                              (count !== null ||
                                                count !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error("Enter no. of days !")
                                              );
                                            }

                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber style={{ width: "50%" }} />
                                    </Form.Item>
                                  </Space.Compact>
                                </Form.Item>
                              </Col>
                              <Col span={3}>
                                <Form.Item
                                  label="Back-end"
                                  name={["team", "backend"]}
                                >
                                  <Space.Compact>
                                    <Form.Item
                                      name={["backend", "count"]}
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const days = getFieldValue([
                                              "backend",
                                              "days",
                                            ]);

                                            if (
                                              (days !== null ||
                                                days !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error(
                                                  "Enter no. of members !"
                                                )
                                              );
                                            }
                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                      noStyle
                                    >
                                      <InputNumber style={{ width: "50%" }} />
                                    </Form.Item>
                                    <Form.Item
                                      name={["backend", "days"]}
                                      noStyle
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const count = getFieldValue([
                                              "backend",
                                              "count",
                                            ]);
                                            if (
                                              (count !== null ||
                                                count !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error("Enter no. of days !")
                                              );
                                            }

                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber style={{ width: "50%" }} />
                                    </Form.Item>
                                  </Space.Compact>
                                </Form.Item>
                              </Col>
                              <Col span={3}>
                                <Form.Item
                                  label="Design"
                                  name={["team", "design"]}
                                >
                                  <Space.Compact>
                                    <Form.Item
                                      name={["design", "count"]}
                                      noStyle
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const days = getFieldValue([
                                              "design",
                                              "days",
                                            ]);

                                            if (
                                              (days !== null ||
                                                days !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error(
                                                  "Enter no. of members !"
                                                )
                                              );
                                            }
                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber style={{ width: "50%" }} />
                                    </Form.Item>
                                    <Form.Item
                                      name={["design", "days"]}
                                      noStyle
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const count = getFieldValue([
                                              "design",
                                              "count",
                                            ]);
                                            if (
                                              (count !== null ||
                                                count !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error("Enter no. of days !")
                                              );
                                            }

                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber style={{ width: "50%" }} />
                                    </Form.Item>
                                  </Space.Compact>
                                </Form.Item>
                              </Col>
                              <Col span={3}>
                                <Form.Item label="P.M." name={["team", "pm"]}>
                                  <Space.Compact>
                                    <Form.Item
                                      name={["pm", "count"]}
                                      noStyle
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const days = getFieldValue([
                                              "pm",
                                              "days",
                                            ]);

                                            if (
                                              (days !== null ||
                                                days !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error(
                                                  "Enter no. of members !"
                                                )
                                              );
                                            }
                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber style={{ width: "50%" }} />
                                    </Form.Item>
                                    <Form.Item
                                      name={["pm", "days"]}
                                      noStyle
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const count = getFieldValue([
                                              "pm",
                                              "count",
                                            ]);
                                            if (
                                              (count !== null ||
                                                count !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error("Enter no. of days !")
                                              );
                                            }

                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber style={{ width: "50%" }} />
                                    </Form.Item>
                                  </Space.Compact>
                                </Form.Item>
                              </Col>
                              <Col span={3}>
                                <Form.Item label="Q.A." name={["team", "qa"]}>
                                  <Space.Compact>
                                    <Form.Item
                                      name={["qa", "count"]}
                                      noStyle
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const days = getFieldValue([
                                              "qa",
                                              "days",
                                            ]);

                                            if (
                                              (days !== null ||
                                                days !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error(
                                                  "Enter no. of members !"
                                                )
                                              );
                                            }
                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber style={{ width: "50%" }} />
                                    </Form.Item>
                                    <Form.Item
                                      name={["qa", "days"]}
                                      noStyle
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const count = getFieldValue([
                                              "qa",
                                              "count",
                                            ]);
                                            if (
                                              (count !== null ||
                                                count !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error("Enter no. of days !")
                                              );
                                            }

                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber style={{ width: "50%" }} />
                                    </Form.Item>
                                  </Space.Compact>
                                </Form.Item>
                              </Col>
                              <Col span={3}>
                                <Form.Item
                                  label="Special"
                                  name={["team", "special"]}
                                >
                                  <Space.Compact>
                                    <Form.Item
                                      name={["special", "count"]}
                                      noStyle
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const days = getFieldValue([
                                              "special",
                                              "days",
                                            ]);

                                            if (
                                              (days !== null ||
                                                days !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error(
                                                  "Enter no. of members !"
                                                )
                                              );
                                            }
                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber style={{ width: "50%" }} />
                                    </Form.Item>
                                    <Form.Item
                                      name={["special", "days"]}
                                      noStyle
                                      rules={[
                                        ({ getFieldValue }) => ({
                                          validator(_, value) {
                                            const count = getFieldValue([
                                              "special",
                                              "count",
                                            ]);
                                            if (
                                              (count !== null ||
                                                count !== undefined) &&
                                              (value === null ||
                                                value === undefined)
                                            ) {
                                              return Promise.reject(
                                                new Error("Enter no. of days !")
                                              );
                                            }

                                            return Promise.resolve();
                                          },
                                        }),
                                      ]}
                                    >
                                      <InputNumber style={{ width: "50%" }} />
                                    </Form.Item>
                                  </Space.Compact>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Row> */}
                          {/* <Row gutter={8}>
                            <Col span={4}>
                              <Form.Item
                                label="Man hours"
                                name="manhours"
                                disabled
                              >
                                <Input disabled />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Button
                                onClick={getManHours}
                                style={{ marginTop: "1.8rem" }}
                              >
                                Calculate Man Hours
                              </Button>
                            </Col>
                          </Row> */}

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
                                  >
                                    Cancel
                                  </Button>
                                  <Button type="primary" htmlType="submit">
                                    {isAddingTask ? "Submit" : "Update"}
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
