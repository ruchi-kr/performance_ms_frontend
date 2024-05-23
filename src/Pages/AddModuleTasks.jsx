import {
  ArrowUpOutlined,
  DeleteFilled,
  EditFilled,
  InfoCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
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
  InputNumber,
} from "antd";
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";

import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  getAllModules,
  createModule,
  editModule,
  deleteModule,
  getAllProjects,
  CONFIG_OBJ,
} from "../Config.js";
import styles from "./AddModuleTasks.module.css";
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
dayjs.extend(utc);
dayjs.extend(timezone);
const AddModuleTasks = () => {
  const [form] = Form.useForm();

  const [userData, setUserData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [projectCheckDates, setProjectCheckDates] = useState({
    schedule_start_date: null,
    schedule_end_date: null,
  });

  // GET PROJECT LIST
  const [projectList, setProjectList] = useState([]);
  const [moduleList, setModuleList] = useState([]);
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const project_id = Number(queryParams.get("project_id"));
  const module_id = Number(queryParams.get("module_id"));
  const stage = queryParams.get("stage");

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

  const getModuleList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/getModule/?page=1&pageSize=100000&search=",CONFIG_OBJ
      );
      setModuleList(response.data.results);
      //   if (response.data.results !== undefined) {
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getModuleList();
  }, []);
  const getModuleTaskList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/module/task/${module_id}/?page=${pagination.currentPage}&pageSize=${pagination.pageSize}&search=${search}`,CONFIG_OBJ
      );
      console.log("response", response.data);
      setTaskList(response.data.results);
      if (response.data.results !== undefined) {
        const {
          totalRecords,
          totalPages,
          currentPage,
          nextPage,
          prevPage,
          pageSize,
        } = response.data.pagination;
        form.setFieldsValue({
          module_id: module_id,
        });
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
    getModuleTaskList();
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

    getModuleList();
  };
  const fetchAll = async () => {
    setLoading(true);
    try {
      // const res = await axios.get(``);
      const res = [];
      console.log("data", res.data);
      setLoading(false);
      setUserData(res.data.data);
      const {
        totalRecords,
        totalPages,
        currentPage,
        nextPage,
        prevPage,
        pageSize,
      } = res.data.pagination;

      setPagination((prevState) => ({
        ...prevState,
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: pageSize,
        currentPage: currentPage,
        nextPage: nextPage,
        prevPage: prevPage,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (record) => {
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
            `http://localhost:8000/api/module/task/${record.task_id}`,CONFIG_OBJ
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

  // console.log("selctedUser", selectedUser);
  const onFinish = async (values) => {
    if (isAdding && !isEditing) {
      try {
        console.log("onFinish before sending values adding", values);
        await axios.post("http://localhost:8000/api/module/task", CONFIG_OBJ,{
          ...values,
          stage: stage,
        });
        getModuleTaskList();
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
          `http://localhost:8000/api/module/task/${values.task_id}`,CONFIG_OBJ,
          values
        );
        handleReset();
        getModuleTaskList(); // Refresh the zone list after update

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
    setIsResetPassword(false);
    setIsEditing(false); // Reset the form fields
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
    const project = projectList?.find(
      (project) => project.project_id === value
    );
    console.log("project selected", project);
    setProjectCheckDates({
      schedule_start_date: project?.schedule_start_date,
      schedule_end_date: project?.schedule_end_date,
    });
  };

  return (
    <>
      <Row justify="center" align="middle">
        <Col>
          {!isAdding && !isEditing && (
            <Button
              onClick={() => setIsAdding(true)}
              type="primary"
              style={{ minWidth: "10rem" }}
            >
              <div>
                <PlusOutlined
                  style={{
                    marginRight: "0.5rem",
                  }}
                />
                Add Task
              </div>
            </Button>
          )}
        </Col>
        <Col align="left" style={{ minWidth: "100%" }}>
          {(isAdding || isEditing) && (
            <Card
            // style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)" }}
            // className={`${styles.card} `}
            >
              {isAdding ? (
                <h4 className="text-info">Add Task</h4>
              ) : (
                <h4 className="text-info">Edit Task</h4>
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
                          maxLength={10}
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
                        <InputNumber min={0} max={100} step={1} precision={0} />
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
      </Row>
    </>
  );
};

export default AddModuleTasks;
