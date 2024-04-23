import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDate } from "../utils/dateFormatter.js";
import { PlusOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Flex, Space, Table, Tag } from "antd";
import {
  getAllProjects,
  addTask,
  getTask,
  editTask,
  deleteTask,
} from "../Config.js";
import { Select } from "antd";
import { toast } from "react-toastify";

const { Option } = Select;

const ManagerViewTask = () => {
  const { employee_id } = useParams();
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
      const response = await axios.get(`${getTask}/${employee_id}`);
      setTaskRecords(response.data);
      console.log("task records", response.data);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to delete a task
  //   const handleDeleteTask = async (taskId) => {
  //     try {
  //       const response = await axios.delete(`${deleteTask}/${taskId}`);
  //       setTaskRecords(taskRecords.filter((task) => task.id !== taskId));
  //       if (response.status === 200) {
  //         toast.success("Task Deleted Successfully");
  //         // window.location.reload()
  //       } else {
  //         toast.error("Task Not Deleted");
  //       }
  //     } catch (error) {
  //       console.error("Error deleting task:", error);
  //     }
  //   };

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
                    <h3 className="text-primary ">View Employee Task</h3>
                  </div>
                  <hr className="bg-primary border-4" />
                  <table className="table table-bordered table-hover table-responsive-sm mt-5">
                    <thead>
                      <tr>
                        <th className="form-label lightgreen fs-6">S.No.</th>
                        <th className="form-label lightgreen fs-6">
                          Project Name<span style={{ color: "red" }}></span>
                        </th>
                        <th className="form-label lightgreen fs-6">
                          Task<span style={{ color: "red" }}></span>
                        </th>
                        <th className="form-label lightgreen fs-6">
                          Allocated time<span style={{ color: "red" }}></span>
                        </th>
                        <th className="form-label lightgreen fs-6">
                          Actual time<span style={{ color: "red" }}></span>
                        </th>
                        <th className="form-label lightgreen fs-6">
                          Status<span style={{ color: "red" }}></span>
                        </th>
                        <th className="form-label lightgreen fs-6">
                          Remarks<span style={{ color: "red" }}></span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskRecords.map((record, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
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
                          <td>
                            <input
                              type="text"
                              name="task"
                              className="form-control"
                              value={record.task}
                              onChange={(e) => handleInputChange(index, e)}
                              placeholder=""
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="allocated_time"
                              className="form-control"
                              value={record.allocated_time}
                              onChange={(e) => handleInputChange(index, e)}
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="actual_time"
                              className="form-control"
                              value={record.actual_time}
                              onChange={(e) => handleInputChange(index, e)}
                              disabled
                            />
                          </td>
                          <td>
                            {record.status === "completed" ? (
                              <Tag color={"green"} key={"1ndwj"}>
                                {record.status.toUpperCase()}{" "}
                              </Tag>
                            ) : (
                              <Tag color={"blue"} key={"2eece"}>
                                {record.status.toUpperCase()}{" "}
                              </Tag>
                            )}
                          </td>
                          <td style={{ display: "flex" }}>
                            <div>
                              <input
                                type="text"
                                name="remarks"
                                className="form-control"
                                value={record.remarks}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder=""
                                required
                              />
                            </div>
                            <div style={{ display: "flex" }}>
                              <CheckOutlined
                                style={{ color: "green", marginLeft: "1rem" }}
                                onClick={() => saveTask(index)}
                              />
                              {/* <CloseOutlined
                                style={{ color: "red", marginLeft: "1rem" }}
                                onClick={() => handleDeleteTask(record.id)}
                              /> */}
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
