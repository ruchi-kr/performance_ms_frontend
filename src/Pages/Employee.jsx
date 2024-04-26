import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  CloseOutlined,
  CheckOutlined,
  EditOutlined,
} from "@ant-design/icons";
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
  getAllEmployeeslist,
} from "../Config.js";
import { Select, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { toast } from "react-toastify";

const { Option } = Select;
const { confirm } = Modal;
// Function to get the disabled state from local storage
const getDisabledStateFromStorage = () => {
  const disabledState = localStorage.getItem("taskRecordsDisabledState");
  return disabledState ? JSON.parse(disabledState) : {};
};

const Employee = () => {
  // for disable form
  const [formDisabled, setFormDisabled] = useState(false);
  const [taskSaved, setTaskSaved] = useState(false);
  const [projectManagerName, setProjectManagerName] = useState(null);

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
      const projectUnderManager = result.data.filter(
        (project) => project.reporting_manager_id !== null
      );
      setProjectList(projectUnderManager);
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
        const response = await axios.get(`${getAllEmployeeslist}`);
        //   "http://localhost:8000/api/admin/getEmployees"
        // );
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
      console.log("task records", response.data);
      setTaskRecords(response.data);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    // Disable all existing rows
    const updatedTaskRecords = taskRecords.map((record) => ({
      ...record,
      formDisabled: true,
    }));

    // Add a new row with formDisabled set to false
    const newTaskRecord = {
      project_id: "",
      user_id: user_id,
      employee_id: employee_id,
      manager_id: "",
      task: "",
      allocated_time: "",
      actual_time: "",
      status: "",
      remarks: "",
      formDisabled: false, // Enable the newly added row
    };

    // Update the task records with the new row
    setTaskRecords([...updatedTaskRecords, newTaskRecord]);
    setTaskSaved(false);
    setFormDisabled(false); // Ensure the entire form is enabled

    // Store the updated disabled state in local storage
    localStorage.setItem(
      "taskRecordsDisabledState",
      JSON.stringify([...updatedTaskRecords, newTaskRecord])
    );
  };

  // Function to edit a task
  const handleEditTask = (index) => {
    // Enable the row for editing
    const updatedTaskRecords = taskRecords.map((record, i) => ({
      ...record,
      formDisabled: i === index ? false : true,
    }));
    setTaskRecords(updatedTaskRecords);
    setFormDisabled(false); // Disable all other rows for editing
    setTaskSaved(false);

    // Store the updated disabled state in local storage
    localStorage.setItem(
      "taskRecordsDisabledState",
      JSON.stringify(updatedTaskRecords)
    );
  };

  useEffect(() => {
    // Set the disabled state from local storage when component mounts
    const disabledState = getDisabledStateFromStorage();
    setTaskRecords(disabledState);
    setFormDisabled(true);
  }, []);

  // Function to delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await confirm({
        title: "Do you want to delete these items?",
        icon: <ExclamationCircleFilled />,
        content: "Be sure before deleting, this process is irreversible!",
        async onOk() {
          try {
            const response = await axios.delete(`${deleteTask}/${taskId}`);
            setTaskRecords(taskRecords.filter((task) => task.id !== taskId));
            fetchTasks();
            if (response.status === 200) {
              toast.success("Task Deleted Successfully");
              // window.location.reload()
            } else {
              toast.error("Task Not Deleted");
            }
          } catch (err) {
            console.log("error deleting project", err);
          }
        },
        onCancel() {},
      });
    } catch (error) {
      console.log(error);
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
          setTaskSaved(true);
          setFormDisabled(true);
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
          setTaskSaved(true);
          setFormDisabled(true);
          toast.success("Task added Successfully");
          setFormDisabled(true);

          console.log("form disabled", formDisabled);
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
  //useEffect to populate manager automatically
  // useEffect(()=>{},[updatedTaskRecords])
  // Function to handle changes in project selection
  const handleProjectChange = (index, value) => {
    console.log("value**********", value);
    const updatedTaskRecords = [...taskRecords];
    const temp = projectList.filter((project) => project.project_id === value);
    console.log("temp", temp);
    console.log("temp manager", temp[0]?.reporting_manager_id);
    setProjectManagerName(temp[0]?.reporting_manager_id);
    updatedTaskRecords[index].manager_id = temp[0]?.reporting_manager_id;

    updatedTaskRecords[index].project_id = value;
    setTaskRecords(updatedTaskRecords);
    console.log("task records", taskRecords);
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
                  {window.location.pathname !== "/plan" ? (
                    <>
                      <h3 className="text-primary">Daily Tracking Sheet</h3>
                    </>
                  ) : (
                    <>
                      <h3 className="text-primary">Plan Sheet</h3>
                    </>
                  )}
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
                        All.hrs<span style={{ color: "red" }}>*</span>
                      </th>
                      {window.location.pathname !== "/plan" ? (
                        <>
                          <th className="form-label text-info fs-6 text-center">
                            Act.hrs<span style={{ color: "red" }}>*</span>
                          </th>
                          <th className="form-label text-info fs-6 text-center">
                            Status<span style={{ color: "red" }}>*</span>
                          </th>
                          <th className="form-label text-info fs-6 text-center">
                            Remarks<span style={{ color: "red" }}>*</span>
                          </th>
                        </>
                      ) : null}

                      <th>
                        <PlusOutlined onClick={handleAddTask} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(taskRecords) &&
                      taskRecords.map((record, index) => (
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
                              // style={{ width: "150px" }}
                              style={{
                                width:
                                  window.location.pathname !== "/plan"
                                    ? "150px"
                                    : "100%",
                              }}
                              className="rounded-2"
                              value={record.project_id}
                              onChange={(value) =>
                                handleProjectChange(index, value)
                              }
                              required
                              disabled={record.formDisabled || formDisabled}
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
                              style={{
                                width:
                                  window.location.pathname !== "/plan"
                                    ? "150px"
                                    : "100%",
                              }}
                              className="rounded-2"
                              value={record.manager_id}
                              // defaultValue={projectManagerName}
                              onChange={(value) =>
                                handleManagerChange(index, value)
                              }
                              required
                              disabled
                              // disabled={record.formDisabled || formDisabled}
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
                              style={{ width: "6rem" }}
                              onChange={(e) => handleInputChange(index, e)}
                              placeholder=""
                              required
                              disabled={record.formDisabled || formDisabled}
                              // disabled={formDisabled}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="allocated_time"
                              // style={{ width: "70px" }}
                              style={{
                                width:
                                  window.location.pathname !== "/plan"
                                    ? "3rem"
                                    : "100%",
                              }}
                              className="form-control"
                              value={record.allocated_time}
                              onChange={(e) => handleInputChange(index, e)}
                              required
                              disabled={record.formDisabled || formDisabled}
                              min="1"
                              max="24"
                              defaultValue="0"
                            />
                          </td>
                          {window.location.pathname !== "/plan" ? (
                            <>
                              <td>
                                <input
                                  type="number"
                                  name="actual_time"
                                  style={{
                                    width:
                                      window.location.pathname !== "/plan"
                                        ? "3rem"
                                        : "100%",
                                  }}
                                  defaultValue={0}
                                  className="form-control"
                                  value={record.actual_time}
                                  onChange={(e) => handleInputChange(index, e)}
                                  required
                                  min={0}
                                  disabled={record.formDisabled || formDisabled}
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
                                  disabled={record.formDisabled || formDisabled}
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
                                  disabled={record.formDisabled || formDisabled}
                                />
                              </td>
                            </>
                          ) : null}
                          <td className="d-flex gap-3">
                            <CloseOutlined
                              style={{ color: "red" }}
                              onClick={() => handleDeleteTask(record.id)}
                            />
                            {/* <CheckOutlined
                            style={{ color: "green" }}
                            onClick={() => saveTask(index)}
                            // disabled={formDisabled}
                            // display=

                          /> */}
                            {!record.formDisabled && !taskSaved && (
                              <CheckOutlined
                                style={{ color: "green" }}
                                onClick={() => saveTask(index)}
                              />
                            )}
                            <EditOutlined
                              style={{ color: "blue" }}
                              onClick={() => handleEditTask(index)}
                              // disabled={formDisabled} // Disable the "Edit" button when form is disabled
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
