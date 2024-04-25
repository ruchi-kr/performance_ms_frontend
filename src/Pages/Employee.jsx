import React, { useState, useEffect } from "react";
import { PlusOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
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

const Employee = () => {
  // user_id
  const user_id = sessionStorage.getItem("id");
  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log("user data", user.employee_id);
  const employee_id = user.employee_id;
  // for project list
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const [projectList, setProjectList] = useState([]);
  const [allEmployeeData, setAllEmployeeData] = useState(null);
  const [managerList, setManagerList] = useState([]);
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

  useEffect(() => {
    // get all projects function
    const getAllEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/getEmployees"
        );
        console.log("employee list get all employees", response.data);
        const filteredUsers = response?.data?.filter(
          (user) => user.manager_id != null
        );
        const filteredManagers = response?.data?.filter(
          (user) => user.manager_id === null
        );
        setAllEmployeeData(filteredUsers);
        setManagerList(filteredManagers);
        console.log("manager list", filteredManagers);
      } catch (err) {
        console.log(err);
      }
    };
    getAllEmployees();
  }, []);

  const [taskRecords, setTaskRecords] = useState([]);

  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${getTask}/${user_id}`);
      setTaskRecords(response.data);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to add a new task
  const handleAddTask = () => {
    setTaskRecords([
      ...taskRecords,
      {
        project_id: "",
        user_id: user_id,
        employee_id:employee_id,
        manager_id: "",
        task: "",
        allocated_time: "",
        actual_time: "",
        status: "",
        remarks: "",
      },
    ]);
  };

  // Function to delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`${deleteTask}/${taskId}`);
      setTaskRecords(taskRecords.filter((task) => task.id !== taskId));
      if (response.status === 200) {
        toast.success("Task Deleted Successfully");
        // window.location.reload()
      } else {
        toast.error("Task Not Deleted");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Function to handle task status change
  const handleStatusChange = (index, value) => {
    const updatedTaskRecords = [...taskRecords];
    updatedTaskRecords[index].status = value;
    setTaskRecords(updatedTaskRecords);
  };

  // Function to save task changes
  const saveTask = async (index) => {
    const task = taskRecords[index];
    try {
      if (task.id) {
        const payload = {
          user_id: user_id,
          employee_id: employee_id,
        };
        // If the task already has an ID, it's an existing task, so update it
        const response1 = await axios.put(
          `${editTask}${task.id}`,
          task,
          payload
        );
        if (response1.status === 200) {
          toast.success("Task Updated Successfully");
        } else {
          toast.error("Task Not Updated");
        }
      } else {
        const payload = {
          user_id: user_id,
        };

        // If the task doesn't have an ID, it's a new task, so create it
        const response2 = await axios.post(`${addTask}`, task, payload);
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

  // Function to handle changes in project selection
  const handleProjectChange = (index, value) => {
    const updatedTaskRecords = [...taskRecords];
    updatedTaskRecords[index].project_id = value;
    setTaskRecords(updatedTaskRecords);
  };
  // Function to handle changes in project selection
  const handleManagerChange = (index, value) => {
    const updatedTaskRecords = [...taskRecords];
    console.log("manager id selected", value);
    updatedTaskRecords[index].manager_id = value;
    setTaskRecords(updatedTaskRecords);
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
            <div className="row my-5">
              <div className="col-11 mx-auto">
                <div className="d-flex justify-content-between">
                  <h3 className="text-primary">Daily Tracking Sheet</h3>
                </div>
                <hr className="bg-primary border-4" />
                <table className="table table-bordered table-hover table-responsive-sm mt-5">
                  <thead>
                    <tr>
                      <th className="form-label text-info fs-6 text-center">
                        S.No.
                      </th>
                      <th className="form-label text-info fs-6 text-center">
                        Project Name<span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label text-info fs-6 text-center">
                        Reporting Manager<span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label text-info fs-6 text-center">
                        Task<span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label text-info fs-6 text-center">
                        Alloc.hrs<span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label text-info fs-6 text-center">
                        Act.hrs<span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label text-info fs-6 text-center">
                        Status<span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label text-info fs-6 text-center">
                        Remarks<span style={{ color: "red" }}>*</span>
                      </th>
                      <th>
                        <PlusOutlined onClick={handleAddTask} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskRecords.map((record, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
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
                            style={{ width: "150px" }}
                            className="rounded-2"
                            value={record.project_id}
                            onChange={(value) =>
                              handleProjectChange(index, value)
                            }
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
                        </td>
                        <td>
                          <Select
                            allowClear
                            placeholder="Select Reporting Manager"
                            style={{ width: "150px" }}
                            className="rounded-2"
                            value={record.manager_id}
                            onChange={(value) =>
                              handleManagerChange(index, value)
                            }
                            required
                          >
                            {managerList.map((manager) => (
                              <Option
                                key={manager.employee_id}
                                value={manager.employee_id}
                                label={manager.name}
                              >
                                {manager.name}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>
                          <input
                            type="text"
                            name="task"
                            className="form-control"
                            value={record.task}
                            // style={{ width: "150px" }}
                            onChange={(e) => handleInputChange(index, e)}
                            placeholder=""
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="allocated_time"
                            style={{ width: "70px" }}
                            className="form-control"
                            value={record.allocated_time}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="actual_time"
                            style={{ width: "70px" }}
                            className="form-control"
                            value={record.actual_time}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                          />
                        </td>
                        <td>
                          <select
                            name="status"
                            className="form-control"
                            value={record.status}
                            onChange={(e) =>
                              handleStatusChange(index, e.target.value)
                            }
                            required
                          >
                            <option value="">Select</option>
                            <option value="inprocess">In Process</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            name="remarks"
                            className="form-control"
                            value={record.remarks}
                            onChange={(e) => handleInputChange(index, e)}
                            placeholder=""
                            required
                          />
                        </td>
                        <td className="d-flex gap-3">
                          <CloseOutlined
                            style={{ color: "red" }}
                            onClick={() => handleDeleteTask(record.id)}
                          />
                          <CheckOutlined
                            style={{ color: "green" }}
                            onClick={() => saveTask(index)}
                          />
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

export default Employee;
