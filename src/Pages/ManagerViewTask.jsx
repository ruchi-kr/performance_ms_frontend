import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDate } from "../utils/dateFormatter.js";
import { PlusOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Flex, Space, Table, Tag, Input } from "antd";
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
      console.log("modified task", tasksWithProjectName);
      // setTaskRecords(tasksWithProjectName);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  // Function to handle changes in other inputs
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedTaskRecords = [...taskRecords];
    updatedTaskRecords[index][name] = value;
    setTaskRecords(updatedTaskRecords);
  };
  return (
    <>
      return (
      <>
        <Header />
        <SideNavbar />
        <div className="content-wrapper bg-white">
          <div className="content">
            <div className="container-fluid bg-white">
              <div className="row my-5">
                <div className="col-10 mx-auto">
                  <div className="d-flex justify-content-between">
                    <h3 className="text-primary ">
                      {taskRecords[0]?.name}'s Daily Task Sheet
                    </h3>
                    <NavLink to={"/assignteam"}>
                      <i class="bi bi-backspace">back to Teams</i>
                      <h5 className="text-secondary ">back to teams</h5>
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
                        <th
                          className="form-label lightgreen fs-6"
                          style={{ width: "100px" }}
                        >
                          <p>Task</p>
                        </th>
                        <th className="form-label lightgreen fs-6">
                          <div>
                            Alloc.hrs<span style={{ color: "red" }}></span>
                          </div>
                          <div>
                            Act.hrs<span style={{ color: "red" }}></span>
                          </div>
                          <div>
                            Percent<span style={{ color: "red" }}></span>
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
                                >
                                  {record.project_name}
                                </Tag>
                              </NavLink>
                            }
                          </td>
                          <td className="w-4">
                            <p className="text-justify text-wrap ">
                              {record.task}
                            </p>
                          </td>
                          <td>
                            <p className="font-weight-bold text-center">
                              {record.allocated_time}
                            </p>
                            <p className="font-weight-bold text-center">
                              {record.actual_time}
                            </p>
                            <p className="font-weight-bold text-center">
                              {record.actual_time}%
                            </p>
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
                            className="text-truncate"
                          >
                            {/* <p className="text-wrap text-justify "> */}
                            {/* <span className="text-truncate" style={{maxWidth:"3rem"}} > */}
                            {record.remarks}
                            {/* </span> */}
                            {/* </p> */}
                          </td>
                          <td style={{ display: "flex" }}>
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
      )
    </>
  );
};

export default ManagerViewTask;
