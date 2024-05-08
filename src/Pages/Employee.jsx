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
  getCurrentTime,
} from "../Config.js";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { toast } from "react-toastify";
import { Select, Modal, Input, Button } from "antd";
import dayjs from "dayjs";
import { Space } from "antd";
const { TextArea } = Input;

const { Option } = Select;
const { confirm } = Modal;
// Function to get the disabled state from local storage
const getDisabledStateFromStorage = () => {
  const disabledState = localStorage.getItem("taskRecordsDisabledState");
  return disabledState ? JSON.parse(disabledState) : {};
};

const Employee = () => {
  const [showSelect, setShowSelect] = useState(false);
  // for adhoc
  const [adhoc, setAdhoc] = useState(0);
  const [project_id, setProject_id] = useState(null);
  // for disable form
  const [formDisabled, setFormDisabled] = useState(false);
  const [taskSaved, setTaskSaved] = useState(false);
  const [projectManagerName, setProjectManagerName] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  // user_id
  const user_id = sessionStorage.getItem("id");
  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log("user data", user.employee_id);
  const employee_id = user.employee_id;
  // for project list
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const [projectList, setProjectList] = useState([]);
  const [moduleList, setModuleList] = useState([]);
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

  //To get modules per project
  useEffect(() => {
    async function getModules(value) {
      try {
        const result = await axios.get(
          `http://localhost:8000/api/admin/getAllModule/`
        );
        console.log("modeule data", result.data);
        setModuleList(result.data[0].module_name);
        console.log("module list", result.data[0].module_name);
      } catch (error) {
        console.log("Error fetching project list data", error);
      }
    }
    getModules();
  }, []);

  useEffect(() => {
    // get all projects function
    const getAllEmployees = async () => {
      try {
        const response = await axios.get(`${getAllEmployeeslist}`);

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
      // setAdhoc(response.data.adhoc)
      // console.log("adhoc value",adhoc)
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    setAdhoc(1);
    // Disable all existing rows
    const updatedTaskRecords = taskRecords.map((record) => ({
      ...record,
      formDisabled: true,
    }));

    // Add a new row with formDisabled set to false
    const newTaskRecord = {
      project_id: "",
      module_id: "",
      user_id: user_id,
      employee_id: employee_id,
      manager_id: "",
      task: "",
      allocated_time: "",
      actual_time: "",
      task_percent: "",
      status: "",
      remarks: "",
      formDisabled: false, // Enable the newly added row
      adhoc: 1,
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
    setAdhoc(0);

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
      confirm({
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
    if (value === "completed") {
      updatedTaskRecords[index].task_percent = 100;
    } else if (value === "notstarted") {
      updatedTaskRecords[index].task_percent = 0;
    }
    setTaskRecords(updatedTaskRecords);
  };

  // Function to save task changes
  // const saveTask = async (index) => {
  //   const task = taskRecords[index];
  //   try {
  //     if (task.id) {
  //       const payload = {
  //         user_id: user_id,
  //         employee_id: employee_id,
  //       };
  //       // If the task already has an ID, it's an existing task, so update it
  //       const response1 = await axios.put(
  //         `${editTask}${task.id}`,
  //         task,
  //         payload
  //       );
  //       if (response1.status === 200) {
  //         setTaskSaved(true);
  //         setFormDisabled(true);
  //         setAdhoc(0);
  //         toast.success("Task Updated Successfully");
  //       } else {
  //         toast.error("Task Not Updated");
  //       }
  //     } else {
  //       const payload = {
  //         user_id: user_id,
  //       };

  //       // If the task doesn't have an ID, it's a new task, so create it
  //       const response2 = await axios.post(`${addTask}`, task, payload);
  //       if (response2.status === 200) {
  //         setTaskSaved(true);
  //         setFormDisabled(true);
  //         setAdhoc(1);
  //         toast.success("Task added Successfully");
  //         setFormDisabled(true);

  //         console.log("form disabled", formDisabled);
  //       } else {
  //         toast.error("Task Not added");
  //       }
  //     }
  //     // Refresh tasks after saving
  //     fetchTasks();
  //   } catch (error) {
  //     console.error("Error saving task:", error);
  //   }
  // };

  const saveTask = async (index) => {
    const task = taskRecords[index];
    try {
      if (!task.project_id || !task.module_id || !task.task || !task.allocated_time || !task.status) {
        toast.error("Please fill required the fields");
        // return false
      }
      if (task.id) {
        // If the task already has an ID, it's an existing task, so update it
        let payload = {
          user_id: user_id,
          employee_id: employee_id,
        };
        if (dayjs(currentTime).hour() >= 12) {
          payload = {
            user_id: user_id,
            employee_id: employee_id,
            adhoc: adhoc,
          }; // Add adhoc=1 to the payload if it's after 12 PM
        }
        const response1 = await axios.put(
          `${editTask}${task.id}`,
          task,
          payload
        );
        if (response1.status === 200) {
          setTaskSaved(true);
          setFormDisabled(true);
          setAdhoc(0);
          toast.success("Task Updated Successfully");
        } else {
          toast.error("Task Not Updated");
        }
      } else {
        let payload = {
          user_id: user_id,
        };
        if (dayjs(currentTime).hour() >= 12) {
          payload = {
            user_id: user_id,
            employee_id: employee_id,
            adhoc: adhoc,
          };

          // payload.adhoc = 1; // Add adhoc=1 to the payload if it's after 12 PM
        }
        // If the task doesn't have an ID, it's a new task, so create it
        const response2 = await axios.post(`${addTask}`, task, payload);
        if (response2.status === 200) {
          setTaskSaved(true);
          setFormDisabled(true);
          setAdhoc(1);
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

  const handleProjectChange = (index, value) => {
    console.log("value**********", value);
    const updatedTaskRecords = [...taskRecords];
    const temp = projectList.filter((project) => project.project_id === value);
    console.log("temp", temp);
    console.log("temp manager", temp[0]?.reporting_manager_id);
    setProjectManagerName(temp[0]?.reporting_manager_id);
    updatedTaskRecords[index].manager_id = temp[0]?.reporting_manager_id;
    setProject_id(value);
    updatedTaskRecords[index].project_id = value;
    setTaskRecords(updatedTaskRecords);
    console.log("task records", taskRecords);
  };
  // Function to handle changes in module selection
  const handleModuleChange = (index, value) => {
    console.log("value**********", value);
    const updatedTaskRecords = [...taskRecords];
    updatedTaskRecords[index].module_id = value;
    setTaskRecords(updatedTaskRecords);
    console.log("task records", taskRecords);
  };
  // Function to handle changes in manager selection
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

  // function to fetch current time
  const getCurrentTimehandle = async () => {
    try {
      const response = await axios.get(`${getCurrentTime}`);
      setCurrentTime(response.data.currentTimeStamp);
      console.log("current time", response.data.currentTimeStamp);

      //    // Check the current time and reload the page if the desired time is reached
      // const reloadTime = dayjs(response.data.currentTimeStamp).hour() === 15 && dayjs(response.data.currentTimeStamp).minute() === 50;
      // console.log("reload time", reloadTime);
      // if (reloadTime) {
      //   reloadPage();
      // }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCurrentTimehandle();
  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  // Check the current time and reload the page if the desired time is reached
  // setInterval(() => {
  //   // const currentTime = new Date();
  //   // const reloadTime = dayjs(currentTime).hour() === 12;
  //   const reloadTime = dayjs(currentTime).hour() === 15 && dayjs(currentTime).minute() === 55;
  //   if (reloadTime) {
  //     reloadPage();
  //   }
  // }, 60000); // Check every minute
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
                <table className="table table-bordered table-hover table-responsive-sm table-responsive-md mt-5">
                  <thead>
                    <tr>
                      <th className="form-label text-info fs-6 text-center">
                        S.No.
                      </th>
                      <th className="form-label text-info fs-6 text-center" style={{

                        width:
                          window.location.pathname !== "/plan" && dayjs(currentTime).hour() >= 12
                            ? "150px"
                            : '250px',
                      }}>
                        <div>
                          Project Name<span style={{ color: "red" }}>*</span>
                        </div>
                        <div>
                          Module Name<span style={{ color: "red" }}>*</span>
                        </div>
                      </th>
                      <th className="form-label text-info fs-6 text-center">
                        Task<span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label text-info fs-6 text-center">
                        All.hrs<span style={{ color: "red" }}>*</span>
                      </th>
                      {window.location.pathname !== "/plan" &&
                      dayjs(currentTime).hour() > 12 ? (
                        <>
                          <th className="form-label text-info fs-6 text-center">
                            Act.hrs
                            <span style={{ color: "red", width: "3rem" }}>
                              *
                            </span>
                            <br />
                            Percent
                          </th>

                          <th className="form-label text-info fs-6 text-center">
                            Status<span style={{ color: "red" }}>*</span>
                          </th>
                          <th className="form-label text-info fs-6 text-center">
                            Remarks<span style={{ color: "red" }}>*</span>
                          </th>
                          <th className="form-label text-info fs-6 text-center">
                            Manager's Remarks
                          </th>
                        </>
                      ) : null}
                      {(window.location.pathname !== "/plan" &&
                        dayjs(currentTime).hour() > 13) ||
                      (window.location.pathname === "/plan" &&
                        dayjs(currentTime).hour() < 12) ? (
                        <>
                          <th>
                            <Button
                              onClick={handleAddTask}
                              className="d-flex justify-content-center align-items-center text-info m-0"
                            >
                              <PlusOutlined />
                              Add Task
                            </Button>
                          </th>
                        </>
                      ) : (
                        <></>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(taskRecords) &&
                      taskRecords.map((record, index) => (
                        <tr key={index}>
                          <td>
                            {index + 1}
                            {record.adhoc === 1 ? (
                              <span className="text-info fs-3">*</span>
                            ) : (
                              ""
                            )}
                          </td>
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
                                  window.location.pathname !== "/plan" &&
                                  dayjs(currentTime).hour() >= 12
                                    ? "150px"
                                    : "100%",
                                marginBottom: "0.5rem",
                              }}
                              className="rounded-2"
                              value={record.project_id}
                              onChange={(value) =>
                                handleProjectChange(index, value)
                              }
                              required
                              disabled={
                                record.formDisabled ||
                                formDisabled ||
                                (dayjs(currentTime).hour() >= 12 && adhoc !== 1)
                              }
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
                            <Select
                              allowClear
                              placeholder="Select Module"
                              // style={{ width: "150px" }}
                              style={{
                                width:
                                  window.location.pathname !== "/plan" &&
                                  dayjs(currentTime).hour() > 12
                                    ? "150px"
                                    : "100%",
                              }}
                              className="rounded-2"
                              value={record.module_id}
                              onChange={(value) =>
                                handleModuleChange(index, value)
                              }
                              required
                              disabled={
                                record.formDisabled ||
                                formDisabled ||
                                (dayjs(currentTime).hour() >= 12 && adhoc !== 1)
                              }
                            >
                              {moduleList?.map((module) => (
                                <Option
                                  key={module.module_id}
                                  value={module.module_id}
                                  label={module.item}
                                >
                                  {module.item}
                                </Option>
                              ))}
                            </Select>
                            {!record.project_id || !record.module_id && <span className="text-danger">*</span>}
                          </td>

                          {showSelect && (
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
                          )}

                          <td>
                            <TextArea
                              type="text"
                              name="task"
                              className="form-control"
                              value={record.task}
                              autoSize={{
                                minRows: 1,
                                maxRows: 6,
                              }}
                              onChange={(e) => handleInputChange(index, e)}
                              placeholder=""
                              required
                              disabled={
                                record.formDisabled ||
                                formDisabled ||
                                (dayjs(currentTime).hour() >= 12 && adhoc !== 1)
                              }
                              // disabled={formDisabled}
                            />
                            {!record.task && <span className="text-danger">*</span>}
                          </td>
                          <td>
                            <input
                              type="number"
                              name="allocated_time"
                              // style={{ width: "70px" }}
                              style={{
                                width:
                                  window.location.pathname !== "/plan" &&
                                  dayjs(currentTime).hour() >= 12
                                    ? "3rem"
                                    : "100%",
                              }}
                              className="form-control"
                              value={record.allocated_time}
                              onChange={(e) => handleInputChange(index, e)}
                              required
                              disabled={
                                record.formDisabled ||
                                formDisabled ||
                                (dayjs(currentTime).hour() >= 12 && adhoc != 1)
                              }
                              min="1"
                              max="24"
                              defaultValue="0"
                            />
                            {!record.allocated_time && <span className="text-danger">*</span>}
                          </td>
                          {window.location.pathname !== "/plan" &&
                          dayjs(currentTime).hour() >= 12 ? (
                            <>
                              <td className="text-center">
                                <Space direction="vertical">
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
                                    onChange={(e) =>
                                      handleInputChange(index, e)
                                    }
                                    required
                                    min={0}
                                    disabled={
                                      record.formDisabled || formDisabled
                                    }
                                  />

                                  {record.status === "transfer" ||
                                  record.status === "inprocess" ? (
                                    <input
                                      type="number"
                                      name="task_percent"
                                      style={{
                                        width:
                                          window.location.pathname !== "/plan"
                                            ? "3rem"
                                            : "100%",
                                      }}
                                      defaultValue={0}
                                      className="form-control"
                                      value={record.task_percent}
                                      onChange={(e) =>
                                        handleInputChange(index, e)
                                      }
                                      required
                                      min={0}
                                      disabled={
                                        record.formDisabled || formDisabled
                                      }
                                    />
                                  ) : null}
                                </Space>
                                {!record.actual_time && <span className="text-danger">*</span>}
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
                                  <option value="" disabled>
                                    Select
                                  </option>
                                  <option
                                    value="notstarted"
                                    className="text-danger"
                                  >
                                    Not Started
                                  </option>
                                  <option
                                    value="inprocess"
                                    className="text-warning"
                                  >
                                    Work In Progress
                                  </option>
                                  <option
                                    value="transfer"
                                    className="text-primary"
                                  >
                                    Transfered
                                  </option>
                                  <option
                                    value="completed"
                                    className="text-success"
                                  >
                                    Completed
                                  </option>
                                </select>
                                {!record.status && <span className="text-danger">*</span>}
                              </td>
                              <td>
                                <TextArea
                                  type="text"
                                  name="remarks"
                                  // rows={5}
                                  autoSize={{
                                    minRows: 1,
                                    maxRows: 6,
                                  }}
                                  className="form-control"
                                  value={record.remarks}
                                  onChange={(e) => handleInputChange(index, e)}
                                  placeholder=""
                                  required
                                  disabled={record.formDisabled || formDisabled}
                                />
                                {!record.remarks && <span className="text-danger">*</span>}
                              </td>
                              <td>
                                <TextArea
                                  type="text"
                                  name="manager_remarks"
                                  // rows={5}
                                  autoSize={{
                                    minRows: 1,
                                    maxRows: 6,
                                  }}
                                  className="form-control"
                                  value={record.manager_remarks}
                                  onChange={(e) => handleInputChange(index, e)}
                                  placeholder=""
                                  required
                                  disabled
                                />
                              </td>
                            </>
                          ) : null}

                          <td className="d-flex gap-3">
                            {dayjs(currentTime).hour() < 12 &&
                              window.location.pathname === "/plan" && (
                                <CloseOutlined
                                  style={{ color: "red" }}
                                  onClick={() => handleDeleteTask(record.id)}
                                />
                              )}

                            {!record.formDisabled &&
                              !taskSaved &&
                              window.location.pathname !== "/plan" &&
                              dayjs(currentTime).hour() >= 12 && (
                                <CheckOutlined
                                  style={{ color: "green" }}
                                  onClick={() => saveTask(index)}
                                />
                              )}
                            {!record.formDisabled &&
                              !taskSaved &&
                              window.location.pathname === "/plan" &&
                              dayjs(currentTime).hour() < 12 && (
                                <CheckOutlined
                                  style={{ color: "green" }}
                                  onClick={() => saveTask(index)}
                                />
                              )}
                            {window.location.pathname !== "/plan" &&
                              dayjs(currentTime).hour() >= 12 && (
                                <EditOutlined
                                  style={{ color: "blue" }}
                                  onClick={() => handleEditTask(index)}
                                />
                              )}

                            {window.location.pathname === "/plan" &&
                              dayjs(currentTime).hour() < 12 && (
                                <EditOutlined
                                  style={{ color: "blue" }}
                                  onClick={() => handleEditTask(index)}
                                />
                              )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  {/* <tr>
  <td colSpan="12" className="text-center">
    <h5 className="text-info">Additional Tasks</h5>
  </td>
</tr> */}
                  {/* Array.isArray(taskRecords) && taskRecords.filter((record) => record.adhoc===1).map((record, index) */}
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
