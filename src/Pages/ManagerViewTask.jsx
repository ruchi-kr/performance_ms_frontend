import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDate } from "../utils/dateFormatter.js";
import {
  PlusOutlined,
  CloseOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  ReadOutlined,
  PauseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import {
  Flex,
  Row,
  Space,
  Table,
  Tag,
  Input,
  Statistic,
  Col,
  Progress,
  Divider,
  Card,
} from "antd";
import dayjs from "dayjs";
import {
  getAllProjects,
  addTask,
  getTask,
  editTask,
  deleteTask,
} from "../Config.js";
import { Select } from "antd";
import { toast } from "react-toastify";
import moment from "moment";
const { TextArea } = Input;
const { Option } = Select;

const ManagerViewTask = () => {
  const { employee_id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const manager_id = user.employee_id;
  console.log("manager id", manager_id);
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const [projectList, setProjectList] = useState([]);
  const [taskRecords, setTaskRecords] = useState([]);
  const [efficiency, setEfficency] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [inprocessTasks, setInprocessTasks] = useState(0);
  const [notStartedTasks, setNotStartedTasks] = useState(0);
  const [transferedTasks, setTransferedTasks] = useState(0);

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

  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/project/employee/report/${manager_id}/${employee_id}/null`
      );
      setTaskRecords(response.data.data);

      console.log("task records", response.data.data);
      // Function to add project name to tasks
      const tasksWithProjectName = response?.data?.data?.map((task) => {
        const project = projectList?.find(
          (p) => p.project_id === task.project_id
        );
        console.log("Task:", task);
        console.log("Matching Project:", project);

        return {
          ...task,
          project_name: project ? project.project_name : null,
        };
      });
      console.log("not modified task", response.data.data);
      // setTaskRecords(tasksWithProjectName);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  useEffect(() => {
    getEfficency();
  }, [taskRecords]);

  // Function to handle task status change
  const handleStatusChange = (index, value) => {
    const updatedTaskRecords = [...taskRecords];
    updatedTaskRecords[index].status = value;
    setTaskRecords(updatedTaskRecords);
  };

  // Function to save task changes
  const saveTask = async (index) => {
    const task = taskRecords[index];
    console.log("------task------", task);
    try {
      if (task.id) {
        // If the task already has an ID, it's an existing task, so update it
        const response1 = await axios.patch(
          `http://localhost:8000/api/project/task/${task.id}`,
          task
        );
        if (response1.status === 200) {
          toast.success("Remark added Successfully");
        } else {
          toast.error("Remark Not Updated");
        }
      } else {
        // If the task doesn't have an ID, it's a new task, so create it
        const response2 = await axios.post(`${addTask}`, task);
        if (response2.status === 200) {
          toast.success("Task added Successfully");
        } else {
          toast.error("Task Not added");
        }
      }
      // Refresh tasks after saving
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const getEfficency = () => {
    let totalAllocatedHours = 0;
    let totalWeightedActualHours = 0;
    let totalWeightedPercentage = 0;
    let efficency = 0;
    let count = 0;
    let completed = 0;
    let inprocess = 0;
    let transfered = 0;
    let notStarted = 0;

    taskRecords?.forEach((task) => {
      if (task.status !== "notstarted") {
        const weightedPercentage =
          (task.allocated_time / task.actual_time) * task.task_percent;
        totalWeightedPercentage += weightedPercentage;
        totalWeightedActualHours += weightedPercentage;
        count++;
      }
      //

      if (task.status === "completed") completed++;
      else if (task.status === "inprocess") inprocess++;
      else if (task.status === "transfer") transfered++;
      else if (task.status === "notstarted") notStarted++;
    });
    console.log("total weighted hours", totalWeightedPercentage);
    console.log("total allocated hours", totalAllocatedHours);
    const efficiency = totalWeightedPercentage / count;
    console.log("efficencyyyyyy", efficiency);
    setEfficency(Math.ceil(efficiency));
    setTotalTasks(count);
    setCompletedTasks(completed);
    setInprocessTasks(inprocess);
    setTransferedTasks(transfered);
    setNotStartedTasks(notStarted);
  };
  // Function to handle changes in other inputs
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedTaskRecords = [...taskRecords];
    updatedTaskRecords[index][name] = value;
    setTaskRecords(updatedTaskRecords);
  };

  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            <Row gutter={16}>
              <Col span={24}>
                <Card bordered={false}>
                  <div style={{ marginTop: "20px" }}>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Row gutter={16}>
                          <Col span={6}>
                            <Card bordered={false}>
                              <Statistic
                                title="Today's Efficiency"
                                value={isNaN(efficiency) ? 0 : efficiency}
                                // precision={2}
                                valueStyle={{
                                  color: "green",
                                }}
                                // prefix={<ArrowDownOutlined />}
                                suffix="%"
                              />
                              {/* <Statistic
                                title="Total Tasks"
                                value={isNaN(efficiency) ? 0 : efficiency}
                                // precision={2}
                                valueStyle={{
                                  color: "black",
                                }}
                                // prefix={<ArrowDownOutlined />}
                                // suffix="%"
                              /> */}
                            </Card>
                          </Col>
                          <Col span={4}>
                            <Card bordered={false}>
                              <Statistic
                                title="Completed"
                                value={completedTasks}
                                // precision={2}
                                valueStyle={{
                                  color: "green",
                                }}
                                prefix={<CheckOutlined />}
                              />
                            </Card>
                          </Col>
                          <Col span={4}>
                            <Card bordered={false}>
                              <Statistic
                                title="Inprocess"
                                value={inprocessTasks}
                                // precision={2}
                                valueStyle={{
                                  color: "blue",
                                }}
                                prefix={<ClockCircleOutlined />}
                                // suffix="%"
                              />
                            </Card>
                          </Col>
                          <Col span={4}>
                            <Card bordered={false}>
                              {" "}
                              <Statistic
                                title="Not Started"
                                value={notStartedTasks}
                                // precision={2}
                                valueStyle={{
                                  color: "orange",
                                }}
                                prefix={<PauseOutlined />}
                              />
                            </Card>
                          </Col>
                          <Col span={4}>
                            <Card bordered={false}>
                              {" "}
                              <Statistic
                                title="Transfered"
                                value={transferedTasks}
                                // precision={2}
                                valueStyle={{
                                  color: "Red",
                                }}
                                prefix={<CloseOutlined />}
                              />
                            </Card>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            </Row>
            <div className="row my-5">
              <div className="col-12 mx-auto">
                <div className="d-flex justify-content-between">
                  <h3 className="text-primary text-capitalize">
                    {taskRecords[0]?.name} Daily Task Sheet
                  </h3>
                  <NavLink to={"/assignteam"}>
                    <ArrowLeftOutlined />
                    &nbsp;
                    <i class="bi bi-backspace">back to Teams</i>
                  </NavLink>
                </div>
                <hr className="bg-primary border-4" />
                <table className="table table-bordered table-hover table-responsive-sm mt-5">
                  <thead>
                    <tr>
                      <th className="form-label lightgreen fs-6">
                        <p>S.No.</p>
                      </th>
                      <th className="form-label lightgreen fs-6 ">
                        <p>Project Name</p>
                      </th>
                      <th className="form-label lightgreen fs-6 ">
                        <p>Module Name</p>
                      </th>
                      <th
                        className="form-label lightgreen fs-6"
                        style={{ width: "100px" }}
                      >
                        <p>Task</p>
                      </th>
                      <th className="form-label lightgreen fs-6">
                        <div>Alc.hrs | Act.hrs</div>
                        <div className="w-100">
                          <Divider style={{ backgroundColor: "lightgray" }} />
                        </div>

                        <div>
                          %&nbsp; Work Done
                          <span style={{ color: "red" }}></span>
                        </div>
                      </th>
                      <th className="form-label lightgreen fs-6">
                        <p> Status</p>
                      </th>
                      <th
                        className="form-label lightgreen fs-6"
                        style={{
                          maxWidth: "800px",
                        }}
                      >
                        <p>Team Member's Remarks</p>
                      </th>
                      <th
                        className="form-label lightgreen fs-6"
                        style={{ maxWidth: "8rem" }}
                      >
                        <p style={{ maxWidth: "2rem" }}>Remarks</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskRecords.map((record, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}.</td>
                        <td>
                          {
                            <NavLink
                              to={`/view/project/tasks/${record.project_id}`}
                            >
                              <Tag
                                color={"orange"}
                                style={{ fontSize: "1rem" }}
                                className="text-warning text-capitalize"
                              >
                                {record.project_name}
                              </Tag>
                            </NavLink>
                          }
                        </td>
                        <td className="w-4">
                          <p className="text-justify text-wrap text-capitalize">
                            {record.module_name}
                          </p>
                        </td>
                        <td className="w-4">
                          <p className="text-justify text-wrap text-capitalize ">
                            {record.task_name}
                          </p>
                        </td>
                        {/* <td>
                          <div className="d-flex">
                            <p className="font-weight-bold text-center">
                              {record.allocated_time}{" "}
                              hrs.&nbsp;&nbsp;|&nbsp;&nbsp;
                            </p>
                            <p className="font-weight-bold text-center">
                              {record.actual_time} hrs.
                            </p>
                          </div>
                          <div className="w-100">
                            <Divider style={{ backgroundColor: "gray" }} />
                          </div>

                          <Flex align="center" wrap gap={30}>
                            <p className="flex-row font-weight-bold text-center">
                              <Progress
                                percent={Number(record.task_percent)}
                                size={[150, 15]}
                              />
                            </p>
                          </Flex>
                        </td> */}
                        <td className="flex-row justify-content-center">
                          <div className="d-flex justify-content-center">
                            <p className=" text-center">
                              {record.allocated_time} hrs.
                            </p>
                            <p className="font-bold text-center">
                              &nbsp;&nbsp;|&nbsp;&nbsp;
                            </p>
                            <p className=" text-center">
                              {record.actual_time} hrs.
                            </p>
                          </div>
                          {/* <Divider style={{ backgroundColor: "gray" }} /> */}
                          <Flex vertical gap="middle">
                            <Flex
                              vertical
                              gap="small"
                              style={{
                                width: 120,
                              }}
                            >
                              <Progress
                                percent={Number(record.task_percent)}
                                size={[120, 15]}
                              />
                            </Flex>
                          </Flex>
                        </td>
                        <td>
                          {record.status === "completed" ? (
                            <div>
                              <p className="text-success text-capitalize">
                                {record.status}
                              </p>
                              <p className=" text-capitalize">
                                {moment
                                  .utc(record.actual_end_date)
                                  .format("MM/DD/YYYY")}
                              </p>
                            </div>
                          ) : (
                            <p className="text-warning text-capitalize">
                              {record.status}
                            </p>
                          )}
                        </td>
                        <td
                          style={{ maxWidth: "5rem" }}
                          className="text-truncate cap"
                        >
                          {/* {record.remarks} */}
                          <TextArea
                            type="text"
                            name="manager_remarks"
                            className="form-control"
                            value={record.remarks}
                            autoSize={{
                              minRows: 2,
                              maxRows: 6,
                            }}
                            style={{ width: "12rem" }}
                            onChange={(e) => handleInputChange(index, e)}
                            placeholder=""
                            required
                            // disabled={record.formDisabled || formDisabled}
                            disabled
                          />
                        </td>
                        <td className="d-flex">
                          <div>
                            <TextArea
                              type="text"
                              name="manager_remarks"
                              className="form-control"
                              value={record.manager_remarks}
                              autoSize={{
                                minRows: 2,
                                maxRows: 6,
                              }}
                              style={{ width: "12rem" }}
                              onChange={(e) => handleInputChange(index, e)}
                              placeholder=""
                              required
                              // disabled={record.formDisabled || formDisabled}
                              // disabled={formDisabled}
                            />
                          </div>
                          <div style={{ display: "flex" }}>
                            <CheckOutlined
                              style={{ color: "green", marginLeft: "1rem" }}
                              onClick={() => saveTask(index)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
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

export default ManagerViewTask;
