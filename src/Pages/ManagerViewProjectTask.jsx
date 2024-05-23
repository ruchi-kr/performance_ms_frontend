import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, NavLink } from "react-router-dom";
import Header from "../Components/Header";
import SideNavbar from "../Components/SideNavbar";
import Footer from "../Components/Footer";
import { CONFIG_OBJ } from "../Config";
import { Flex, Space, Table, Tag, Input } from "antd";
const { Search } = Input;


const ManagerViewProjectTask = () => {
  const { project_id } = useParams();
  console.log("project_id", project_id);
  const [taskRecords, setTaskRecords] = useState([]);
  const [search, setSearch] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const manager_id = user.employee_id;
  console.log("manager id", manager_id);
  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/project/employee/report/${manager_id}/null/${project_id}/?search=${search}`,CONFIG_OBJ
      );
      setTaskRecords(response.data.data);
      console.log("task records", response.data.data);
      // Function to add project name to tasks

      // setTaskRecords(tasksWithProjectName);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);
  console.log("project id", project_id);

  // search functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch();
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);
  const onSearch = async () => {
    if (search === null || search === undefined) return;
    fetchTasks();
  };
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
                    {taskRecords[0]?.project_name} Daily Task Sheet
                  </h3>
                  <NavLink to={"/assignteam"}>
                    <i class="bi bi-backspace">back to Teams</i>
                    <h5 className="text-secondary ">back to teams</h5>
                  </NavLink>
                </div>
                <hr className="bg-primary border-4" />
                <div className=" col-2 flex-end mt-4">
                  {/* <label className="text-capitalize fw-bold text-info">
                    Search by name
                  </label> */}

                  <Search
                    placeholder="search by name"
                    allowClear
                    // onSearch={onSearch}
                    style={{
                      width: 200,
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <table className="table table-bordered table-hover table-responsive-sm mt-4">
                  <thead>
                    <tr>
                      <th className="form-label lightgreen fs-6">S.No.</th>

                      <th className="form-label lightgreen fs-6">
                        Employee Name<span style={{ color: "red" }}></span>
                      </th>
                      <th className="form-label lightgreen fs-6">
                        Task<span style={{ color: "red" }}></span>
                      </th>
                      <th className="form-label lightgreen fs-6">
                        Alloc.hrs<span style={{ color: "red" }}></span>
                      </th>
                      <th className="form-label lightgreen fs-6">
                        Act.hrs<span style={{ color: "red" }}></span>
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
                          <NavLink
                            to={`/view/teammember/tasks/${record?.employee_id}`}
                          >
                            <Tag color="blue">{record.name}</Tag>
                          </NavLink>
                        </td>
                        <td>
                          <textarea
                            type="text"
                            name="task"
                            rows={5}
                            className="form-control"
                            value={record.task}
                            // onChange={(e) => handleInputChange(index, e)}
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
                            // onChange={(e) => handleInputChange(index, e)}
                            disabled
                            style={{ maxWidth: "4rem" }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="actual_time"
                            className="form-control"
                            value={record.actual_time}
                            // onChange={(e) => handleInputChange(index, e)}
                            disabled
                            style={{ maxWidth: "4rem" }}
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
                              disabled
                              // onChange={(e) => handleInputChange(index, e)}
                              placeholder=""
                              required
                            />
                          </div>
                          {/* <div style={{ display: "flex" }}>
                            <CheckOutlined
                              style={{ color: "green", marginLeft: "1rem" }}
                              onClick={() => saveTask(index)}
                            /> */}
                          {/* <CloseOutlined
                            style={{ color: "red", marginLeft: "1rem" }}
                            onClick={() => handleDeleteTask(record.id)}
                          /> */}
                          {/* </div> */}
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

export default ManagerViewProjectTask;
