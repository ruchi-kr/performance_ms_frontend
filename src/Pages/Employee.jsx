import React, { useState, useEffect, useRef } from "react";
import {
  PlusOutlined,
  CloseOutlined,
  CheckOutlined,
  EditOutlined,
  PercentageOutlined,
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
  getManhours,
  CONFIG_OBJ,
} from "../Config.js";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { toast } from "react-toastify";
import { Select, Modal, Input, Button, Popover } from "antd";
import dayjs from "dayjs";
import {
  getAllModules,
  createModule,
  editModule,
  deleteModule,
  getProjectPlan,
} from "../Config.js";
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
  const [project_id, setProject_id] = useState(12);
  const [module_id, setModule_id] = useState(null);
  const [taskList, setTaskList] = useState([]);
  // for disable form
  const [formDisabled, setFormDisabled] = useState(false);
  const [taskSaved, setTaskSaved] = useState(false);
  const [projectManagerName, setProjectManagerName] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [planData, setPlanData] = useState([]);

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

  // for fetching man hrs
  const [manHrs, setManHrs] = useState(0);
 const getManHrs = async () => {
   try {
     const response = await axios.get(`${getManhours}`, CONFIG_OBJ);
     console.log("man hrs", response.data.data[0].manHrsPerDay);
     setManHrs(response.data.data[0].manHrsPerDay);
   } catch (error) {
     console.log("Error fetching man hrs", error);
 }
}
useEffect(() => {
  getManHrs();
},[]);

  const getProjects = async (value) => {
    try {
      const result = await axios.get(`${getAllProjects}`, CONFIG_OBJ);
      const projectUnderManager = result.data.filter(
        (project) => ((project.reporting_manager_id !== null && project.stage ==="inprocess" ) || project.project_name === "miscellaneous")
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

  // project plan w.r.t stage
  const getProjectPlanData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/getAllModule/${project_id}/?search=`, CONFIG_OBJ
      );
      console.log("project plan data", response.data.data);
      setModuleList(response.data.data);
      setPlanData(response.data);
    } catch (error) {
      console.log("Error fetching project plan data", error);
    }
  };

  useEffect(() => {
    getProjectPlanData();
  }, [project_id]);
  // [project_id!=="miscellaneous" ? project_id : null]
  const getTasks = async (moduleId) => {
    console.log("module id selected----->", moduleId);
    const tempModule = moduleList?.filter(
      (module) => module.module_id === moduleId
    );
    setTaskList(tempModule[0]?.tasks);
    console.log("temp modules", tempModule);
    console.log("temp modules task", tempModule[0]?.tasks);
  };

  useEffect(() => {
    getTasks(module_id);
  }, [module_id]);
  //To get modules per project
  // useEffect(() => {
  //   async function getModules(value) {
  //     try {
  //       const result = await axios.get(
  //         `http://localhost:8000/api/admin/getAllModule/12`
  //       );
  //       console.log("modeule data", result.data);
  //       setModuleList(result.data[0].module_name);
  //       console.log("module list", result.data[0].module_name);
  //     } catch (error) {
  //       console.log("Error fetching project list data", error);
  //     }
  //   }
  //   getModules();
  // }, []);

  useEffect(() => {
    // get all projects function
    const getAllEmployees = async () => {
      try {
        const response = await axios.get(`${getAllEmployeeslist}`, CONFIG_OBJ);

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
  const [totalAllocatedTime, setTotalAllocatedTime] = useState(0);
  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${getTask}/${user_id}`, CONFIG_OBJ);
      console.log("task records", response.data);
      setTaskRecords(response.data);
      setFormDisabled(true);
      
      // setAdhoc(response.data.adhoc)
      // console.log("adhoc value",adhoc)
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };
  useEffect(() => {
    const sumAllocatedTime = taskRecords && taskRecords.reduce((total, task) => Number(total) + Number(task.allocated_time), 0);
    setTotalAllocatedTime(sumAllocatedTime);
  }, [taskRecords.length > 0 ? taskRecords : '']);
  

  console.log("total allocated time",totalAllocatedTime)
  

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    setMiscellaneous(false);
    setAdhoc(1);
    // Disable all existing rows
    const updatedTaskRecords = taskRecords?.map((record) => ({
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
      task_id: "",
      allocated_time: "",
      actual_time: "",
      task_percent: "",
      status: "",
      remarks: "",
      formDisabled: false, // Enable the newly added row
      adhoc: dayjs(currentTime).hour() >= 12 ? 1 : 0,
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

  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const handleEditTask = (index) => {
    setEditingIndex(index);
    setIsEditing(true);
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
            const response = await axios.delete(`${deleteTask}/${taskId}`, CONFIG_OBJ);
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



  const saveTask = async (index) => {
    const task = taskRecords[index];

    try {
      if ((
        !task.project_id ||
        !task.module_id ||
        !task.task_id ||
        !task.allocated_time
      ) && project_id!="1"){
        toast.error("Please fill required fields");
        return false;
      }
      else if ((
        !task.project_id ||
        !task.module_id ||
        !task.task_id ||
        !task.allocated_time ||
        !task.remarks ||
        !task.actual_time 
      ) && project_id!="1" && dayjs(currentTime).hour() >= 12){
        toast.error("Please fill required fields");
        return false;
      }
      if (!task.status) {
        task.status = "notstarted";
      }
      console.log(manHrs-totalAllocatedTime, "manHrs-totalAllocatedTime");
      console.log(Number(manHrs)-Number(totalAllocatedTime), "Number(manHrs)-Number(totalAllocatedTime)");
      if(Number(totalAllocatedTime) > (Number(manHrs))){
        toast.error(`Total allocated time should be less than ${manHrs} hours`);
        return false;
      }
      
      if (task.id) {
        // If the task already has an ID, it's an existing task, so update it
        let payload = {
          user_id: user_id,
          employee_id: employee_id,
          // CONFIG_OBJ,
        };
        if (dayjs(currentTime).hour() >= 12) {
          payload = {
            user_id: user_id,
            employee_id: employee_id,
            adhoc: adhoc,
            // CONFIG_OBJ,

          }; // Add adhoc=1 to the payload if it's after 12 PM
        }
        console.log(CONFIG_OBJ, "payload CONFIG");
        const response1 = await axios.put(
          `${editTask}${task.id}`,  
          task,
          {...payload, ...CONFIG_OBJ} // Pass the payload object as payload
        );
        if (response1.status === 200) {
          setTaskSaved(true);
          setFormDisabled(true);
          setAdhoc(0);
          toast.success(response1.data.msg);
        } else {
          toast.error("Task Not Updated");
        }
      } else {
        let payload = {
          user_id: user_id,
          // CONFIG_OBJ,
        };
        if (dayjs(currentTime).hour() >= 12) {
          payload = {
            user_id: user_id,
            employee_id: employee_id,
            adhoc: adhoc,
            // CONFIG_OBJ,
          };

          // payload.adhoc = 1; // Add adhoc=1 to the payload if it's after 12 PM
        }
        // If the task doesn't have an ID, it's a new task, so create it
        const response2 = await axios.post(`${addTask}`, task, {...payload, ...CONFIG_OBJ});
        if (response2.status === 200) {
          setTaskSaved(true);
          setFormDisabled(true);
          setAdhoc(0);
          toast.success(response2.data.msg);
          setFormDisabled(true);

          console.log("form disabled", formDisabled);
          console.log("adhoc save task", adhoc);
        } else {
          toast.error("Task Not added");
        }
      }
      // Refresh tasks after saving
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(error.response.data.error);
    }
  };

  const handleProjectChange = (index, value) => {
    setMiscellaneous(false);
   setModule_id("");
    console.log("value**********", value);
    const updatedTaskRecords = [...taskRecords];
    
    const temp = projectList.filter((project) => project.project_id === value);
    console.log("temp", temp);
    console.log("temp manager", temp[0]?.reporting_manager_id);
    setProjectManagerName(temp[0]?.reporting_manager_id);
    updatedTaskRecords[index].manager_id = temp[0]?.reporting_manager_id;
    // updatedTaskRecords[index].manager_id = value === "miscellaneous" ? "" : temp[0]?.reporting_manager_id; 
    setProject_id(value);
    // setProject_id(value == "1" ? "" : value); 
    updatedTaskRecords[index].project_id = value;
    updatedTaskRecords[index].module_id = "";
    updatedTaskRecords[index].task_id ="";
    setTaskRecords(updatedTaskRecords);
    console.log("task records", taskRecords);
    // if(value=="miscellaneous"){
    //   setProject_id("");
    //   // updatedTaskRecords[index].project_id = value;
    // }
    // console.log("project id miscellaneous :", project_id);
  };
  // Function to handle changes in module selection selectedModule.module_id
  const handleModuleChange = (index, value) => {
    console.log("value**********", value);
    const updatedTaskRecords = [...taskRecords];
    updatedTaskRecords[index].module_id = value;
    updatedTaskRecords[index].task_id = "";

    // localStorage.setItem(

    setTaskRecords(updatedTaskRecords);
    console.log("task records", taskRecords);
    setModule_id(value);
  };

  // Function to handle changes in manager selection
  const handleManagerChange = (index, value) => {
    const updatedTaskRecords = [...taskRecords];
    console.log("manager id selected", value);
    updatedTaskRecords[index].manager_id = value;
    setTaskRecords(updatedTaskRecords);
  };
  // Function to handle changes in manager selection
  const handleTaskChange = (index, value) => {
    const updatedTaskRecords = [...taskRecords];
    console.log("task id selected", value);
    updatedTaskRecords[index].task_id = value;
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

  

  // for one by one start to end filling of input type
  const projectRef = useRef(null);
  const moduleRef = useRef(null);
  const taskRef = useRef(null);
  const allocatedTimeRef = useRef(null);
  const actualTimeRef = useRef(null);
  const statusRef = useRef(null);
  const taskPercentRef = useRef(null);
  const remarksRef = useRef(null);

  // Add more refs as needed for other input elements

  // Function to focus on the next input element
  const focusNextInput = (nextRef) => {
    if (nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  // for misacellaneous
const[ miscellaneous,setMiscellaneous]=useState(false);

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
                  <thead className="sticky-top">
                    <tr>
                      <th className="form-label text-info fs-6 text-center">
                        S.No.
                      </th>
                      <th
                        className="form-label text-info fs-6 text-center"
                        style={{
                          width:
                            window.location.pathname !== "/plan" &&
                            dayjs(currentTime).hour() >= 12
                              ? "150px"
                              : "250px",
                        }}
                      >
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
                      dayjs(currentTime).hour() >= 12 ? (
                        <>
                          <th className="form-label text-info fs-6 text-center lh-0">
                            Act.hrs
                            <span style={{ color: "red", width: "3rem" }}>
                              *
                            </span>
                            <hr className="bg-primary" />
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
                              ref={projectRef}
                              showSearch
                              allowClear
                              onClear={() => handleProjectChange(index, "")}
                              placeholder="Select Project"
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
                              onChange={(value) => {
                                handleProjectChange(index, value);
                                focusNextInput(moduleRef)
                                if(value == "1"){
                                  setMiscellaneous(true);
                                 record.module_id ="";
                                 record.task_id="";
                                 
                                };
                              }}
                              required
                              disabled={
                                record.formDisabled ||
                                formDisabled ||
                                (dayjs(currentTime).hour() >= 12 && adhoc !== 1)
                              }
                            >
                              {/* <Option
                                value="miscellaneous"
                                label="Miscellaneous"
                              >
                                Miscellaneous
                              </Option> */}
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
                              ref={moduleRef}
                              showSearch
                              allowClear
                              onClear={() => handleModuleChange(index, "")}
                              placeholder="Select Module"
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.label
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              style={{
                                width:
                                  window.location.pathname !== "/plan" &&
                                  dayjs(currentTime).hour() > 12
                                    ? "150px"
                                    : "100%",
                              }}
                              className="rounded-2"
                              // value={record.module_id}
                              value={
                                isEditing &&
                                !formDisabled &&
                                index === editingIndex
                                  ? record.module_id
                                  : record.module_name
                              }
                              onChange={(value) => {
                                handleModuleChange(index, value);
                                focusNextInput(taskRef);
                              }}
                              //                             value={record.module_name} // Initially set the value to module_name
                              // onChange={(value) => {
                              //   const selectedModule = moduleList.find((module) => module.module_name === value);
                              //   if (selectedModule && selectedModule.module_id) {
                              //     handleModuleChange(index, selectedModule.module_id);
                              //   }
                              // }}
                              required
                              disabled={
                                miscellaneous ||
                                record.formDisabled ||
                                formDisabled ||
                                (dayjs(currentTime).hour() >= 12 && adhoc !== 1)
                              }
                            >
                              {moduleList?.map((module) => (
                                <Option
                                  key={module.module_id}
                                  value={module.module_id}
                                  label={module.module_name}
                                >
                                  {module.module_name}
                                </Option>
                              ))}
                            </Select>
                            {!record.project_id ||
                              (!record.module_id && (
                                <span className="text-danger">*</span>
                              ))}
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
                            {/* <TextArea
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
                            {!record.task && (
                              <span className="text-danger">*</span>
                            )} */}
                            <Select
                              showSearch
                              allowClear
                              ref={taskRef}
                              placeholder="Select Task"
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.label
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              style={{
                                width:
                                  window.location.pathname !== "/plan"
                                    ? "150px"
                                    : "100%",
                              }}
                              className="rounded-2"
                              // value={record.task_id}
                              value={
                                isEditing &&
                                !formDisabled &&
                                index === editingIndex
                                  ? record.task_id
                                  : record.task_name
                              }
                              // defaultValue={projectManagerName}
                              onChange={(value) => {
                                handleTaskChange(index, value);
                                focusNextInput(allocatedTimeRef);
                              }}
                              required
                              disabled={
                               miscellaneous || 
                               record.formDisabled ||
                                formDisabled ||
                                (dayjs(currentTime).hour() >= 12 && adhoc !== 1)
                              }
                            >
                              {taskList?.map((task) => (
                                <Option
                                  key={task.task_id}
                                  value={task.task_id}
                                  label={task.task_name}
                                >
                                  {task.task_name}
                                </Option>
                              ))}
                            </Select>
                            {!record.task_id && (
                              <span className="text-danger">*</span>
                            )}
                          </td>
                          <td>
                            <input
                              ref={allocatedTimeRef}
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
                              onChange={(e) => {handleInputChange(index, e);
                                focusNextInput(actualTimeRef);
                              }}
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
                            {!record.allocated_time && (
                              <span className="text-danger">*</span>
                            )}
                          </td>
                          {window.location.pathname !== "/plan" &&
                          dayjs(currentTime).hour() >= 12 ? (
                            <>
                              <td className="text-center">
                                <Space direction="vertical">
                                  <input
                                    ref={actualTimeRef}
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
                                      {handleInputChange(index, e);
                                       focusNextInput(statusRef);                                       
                                      }
                                    }
                                    required
                                    min={0}
                                    disabled={
                                      record.formDisabled || formDisabled
                                    }
                                  />

                                  {record.status === "transfer" ||
                                  record.status === "inprocess" ? (
                                    <div className="d-flex">
                                      <input
                                        ref={taskPercentRef}
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
                                        onChange={(e) =>{
                                          handleInputChange(index, e);
                                         focusNextInput(remarksRef);
                                        }
                                        
                                        }
                                        required
                                        min={0}
                                        disabled={
                                          record.formDisabled || formDisabled
                                        }
                                      />
                                      <PercentageOutlined />
                                    </div>
                                  ) : null}
                                </Space>
                                {!record.actual_time && (
                                  <span className="text-danger">*</span>
                                )}
                              </td>

                              <td>
                                <select
                                  ref={statusRef}
                                  name="status"
                                  className="form-control"
                                  value={record.status || "notstarted"}
                                  onChange={(e) =>
                                    {handleStatusChange(index, e.target.value);
                                      if( record.status==="transfer" || record.status==="inprocess"){
                                        focusNextInput(taskPercentRef);
                                      }
                                      else{
                                        focusNextInput(remarksRef);
                                      }
                                    }
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
                                {!record.status && (
                                  <span className="text-danger">*</span>
                                )}
                              </td>
                              <td>
                                <TextArea
                                  ref={remarksRef}
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
                                {!record.remarks && (
                                  <span className="text-danger">*</span>
                                )}
                              </td>
                              <td>
                                <Popover
                                  placement="left"
                                  title={"Remarks"}
                                  content={
                                    record.manager_remarks
                                      ? record.manager_remarks
                                      : "No Remarks"
                                  }
                                  overlayStyle={{ maxWidth: "20rem" }}
                                >
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
                                    onChange={(e) =>
                                      handleInputChange(index, e)
                                    }
                                    placeholder=""
                                    required
                                    disabled
                                  />
                                </Popover>
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
                <p>
                  {" "}
                  <span className="text-info fs-3">*</span> Additional Tasks
                </p>
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
