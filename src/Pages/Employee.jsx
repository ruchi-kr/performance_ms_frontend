import React, { useState, useEffect } from 'react';
import { PlusOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";
import axios from 'axios';
import SideNavbar from '../Components/SideNavbar'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { getAllProjects, addTask, getTask } from '../Config.js'
import { Select } from 'antd';

const { Option } = Select;

const Employee = () => {

  // const [allTaskRecords, setAllTaskRecords] = useState([])

  const [taskRecords, setTaskRecords] = useState([{ project: '', task: '', start_time: '', end_time: '', status: '', remarks: '' }]);

  const addTask = () => {
    setTaskRecords([...taskRecords, { project: '', task: '', start_time: '', end_time: '', status: '', remarks: '' }]);
  };

  // CREATE
  const createTask = async (task) => {
    try {
      const response = await axios.post('/api/user/addTask', task);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  // READ (GET)
  const getTasks = async () => {
    try {
      const response = await axios.get(`${getTask}`);
      console.log(response.data);
      setTaskRecords(response.data);
    } catch (error) {
      console.log('Error fetching tasks:', error);
      // throw error;
    }
  };
  useEffect(() => {
    getTasks();
  }, [])


  // UPDATE
  const updateTask = async (taskId, updatedTask) => {
    try {
      const response = await axios.put(`/api/user/updateTask/${taskId}`, updatedTask);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  // DELETE
  // const deleteTask = async (taskId) => {
  //   try {
  //     const response = await axios.delete(`/api/user/deleteTask/${taskId}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error deleting task:', error);
  //     throw error;
  //   }
  // };
  // const addTask = async (index) => {
  //   const newTask = taskRecords[index];
  //   try {
  //     await createTask(newTask);
  // Remove the added task from the local state

  const deleteTask = (index) => {
    const newPayments = taskRecords.filter((_, idx) => idx !== index);
    setTaskRecords(newPayments);
  };

  // delete task function
  // const deleteTask = async (id) => {                            //creating a function for deleting data
  //   try {
  //     await axios.delete(`${deleteTask}` + id)          // deleting data from server
  //     window.location.reload()                             //reloading the page
  //   } catch (err) {
  //     console.log("error deleting task", err);                                 //if error occurs then log it
  //   }
  // }


  // for project list
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const [projectList, setProjectList] = useState([]);

  const getProjects = async (value) => {
    try {
      const result = await axios.get(`${getAllProjects}`);
      setProjectList(result.data);
      console.log("project list", result.data);
    } catch (error) {

      console.log('Error fetching project list data', error)
    }
  }
  useEffect(() => {
    getProjects();
  }, []);
  // const handleManagerSearch = (value) => {
  //     setManager(value)
  // }


  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            <div className="row my-5">
              <div className="col-10 mx-auto">
                <div className='d-flex justify-content-between'>
                  <h3 className='text-primary'>Daily Tracking Sheet</h3>
                </div>
                <hr className='bg-primary border-4' />
                <table className="table table-bordered table-hover table-responsive-sm mt-5">
                  <thead>
                    <tr>
                      <th className="form-label lightgreen fs-6">S.No.</th>
                      <th className="form-label lightgreen fs-6">Project
                        <span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label lightgreen fs-6">Task
                        <span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label lightgreen fs-6">Start time
                        <span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label lightgreen fs-6">End time
                        <span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label lightgreen fs-6">Status
                        <span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label lightgreen fs-6">Remarks
                        <span style={{ color: "red" }}>*</span>
                      </th>


                      <th>
                        <a className="">
                          <PlusOutlined
                            onClick={addTask}
                          />
                        </a>
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
                            filterOption={filterOption}
                            // onChange={handleManagerSearch}
                            style={{ width: "150px" }}
                            className="rounded-2"
                            required
                          >

                            <Option value="">Select</Option>

                            {projectList.map((project, index) => (
                              <Option
                                key={index}
                                value={project.project_id}
                                label={project.project_name}
                              >
                                {project.project_name}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>
                          <input
                            type="text"
                            name="description"
                            className="form-control"
                            // value={record.task}

                            // onChange={(e) => handlePaymentChange(index, e)}
                            placeholder=""
                            required
                          />
                        </td>

                        <td>
                          <input
                            type="datetime-local"
                            name="start_time"
                            // disabled={formdisabled}
                            className="form-control"
                            // value={record.start_time}
                            // onChange={}
                            // value={typeof record.percent == 'number' ? record.percent.toFixed(2) : record.percent}
                            // onChange={(e) => handlePaymentChange(index, e)}
                            placeholder="0"
                            required

                          />


                        </td>

                        <td>
                          <input
                            type="datetime-local"

                            name="end_time"
                            // value={record.end_time}
                            className="form-control"
                            // onChange={(e) => handlePaymentChange(index, e)}
                            placeholder="0"

                          />
                        </td>

                        <td>
                          <select name="status" id="status"
                            style={{ width: "100px" }}
                            className="form-control"
                            // onChange={(e) => handlePaymentChange(index, e)}
                            required
                          >
                            <option value="">Select</option>
                            <option value="inprocess"
                             defaultValue={record.status === "inprocess"}
                            
                            >In Process</option>
                            <option value="completed" defaultValue={record.status === "completed"}>Completed</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            name="description"
                            className="form-control"
                            // value={record.remarks}

                            // onChange={(e) => handlePaymentChange(index, e)}
                            placeholder=""
                            required
                          />
                        </td>

                        <td className='d-flex gap-3'>
                          <CloseOutlined
                            style={{ color: "red" }}
                            onClick={() => deleteTask(index)}

                          />
                          <CheckOutlined
                            style={{ color: "green" }}
                            onClick={() => addTask(index)}
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
  )
}

// export default function PaymentTerms({ paymentRecords, addPayment, formdisabled, handlePaymentChange, deletePayment }) {

// }


export default Employee