import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { getEmployeeReport } from "../Config";
import { Input } from "antd";
import { toast } from "react-toastify";
const { Search } = Input;
const ProjectReport = () => {
  const user_id = sessionStorage.getItem("id");
  // for pagination
  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [reportData, setReportData] = useState([]);
  const [projectActualStartDate, setProjectActualStartDate] = useState(null);
  // get all reports function
  const getEmployeeReportHandler = async (page) => {
    try {
      // const response = await axios.get(`${getEmployeeReport}/${user_id}?page=${page}&pageSize=${pageSize}&name=${search}`);
      // ?page=${page}&pageSize=${pageSize}
      const response = await axios.get(
        "http://localhost:8000/api/project/report/22"
      );
      setReportData(response.data);
      console.log("report data", response.data);
      setTotalPages(Math.ceil(response.headers["x-total-count"] / pageSize));

      const projectExtraDetails = await axios.get(
        "http://localhost:8000/api/project/actualStartDate/22"
      );
      console.log("project extra details", projectExtraDetails.data);
      setProjectActualStartDate(projectExtraDetails.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getEmployeeReportHandler(currentPage);
  }, [currentPage, search]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber == 0 ? 1 : pageNumber);
    getEmployeeReportHandler(pageNumber == 0 ? 1 : pageNumber);
  };
  const findActualStartDate = (projectId) => {
    const project = projectActualStartDate?.find(
      (item) => item.project_id === projectId
    );
    return project ? project.actual_start_date : null;
  };
  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            <div className="row mt-5">
              <div className="col-11 mx-auto">
                <h3 className="text-primary">Reports</h3>
                <hr className="bg-primary border-4" />
                <div className="col-2 flex-end">
                  <label className="text-capitalize fw-bold text-info">
                    project name
                  </label>

                  <Search
                    placeholder="search by project name"
                    allowClear
                    // onSearch={onSearch}
                    style={{
                      width: 200,
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-11 mx-auto">
                {/* table */}
                <table className="table table-striped table-hover mt-5">
                  <thead>
                    <tr>
                      <th scope="col">S.No.</th>
                      <th scope="col">Project Name</th>
                      <th scope="col">
                        <div>Schd. Start Date</div>
                        <div>Schd. End Date</div>
                      </th>
                      <th scope="col">
                        <div>Act. Start Date</div>
                        <div>Act. End Date</div>
                      </th>
                      <th scope="col">Man Hours</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {reportData.map((item, index) => {
                      const totalActualTime = item.report.reduce(
                        (acc, i) => acc + i.actual_time,
                        0
                      );
                      return (
                        <tr key={item.user_id}>
                          <th scope="row">{index + 1}</th>
                          <td className="text-capitalize">
                            {item.project_name}
                          </td>
                          <td>
                            <div>
                              {item.schedule_start_date.slice(8, 10)}/
                              {item.schedule_start_date.slice(5, 7)}/
                              {item.schedule_start_date.slice(0, 4)}
                            </div>
                            <div>
                              {item.schedule_end_date.slice(8, 10)}/
                              {item.schedule_end_date.slice(5, 7)}/
                              {item.schedule_end_date.slice(0, 4)}
                            </div>
                          </td>
                          <td>
                            <div>
                              {findActualStartDate(item.project_id).slice(
                                8,
                                10
                              )}
                              /
                              {findActualStartDate(item.project_id).slice(5, 7)}
                              /
                              {findActualStartDate(item.project_id).slice(0, 4)}
                              {/* {item.schedule_start_date.slice(8, 10)}/
                              {item.schedule_start_date.slice(5, 7)}/
                              {item.schedule_start_date.slice(0, 4)} */}
                            </div>
                            <div>
                              {/* {item.schedule_end_date.slice(8, 10)}/
                              {item.schedule_end_date.slice(5, 7)}/
                              {item.schedule_end_date.slice(0, 4)} */}
                            </div>
                          </td>

                          {/* <td>
                            {item.report.map((i) => (
                              <div key={i.employee_id}>
                                <p>
                                  {i.name} ---> {i.actual_time} hrs
                                </p>
                              </div>
                            ))}
                            <div>Total:{totalActualTime}</div>
                          </td> */}
                          <td>
                            <table className="">
                              <thead>
                                <tr>
                                  <th scope="col">S.No.</th>
                                  <th scope="col">Name</th>
                                  <th scope="col">Time Taken</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.report.map((i, index) => (
                                  <tr>
                                    <th scope="row">{index + 1}</th>
                                    <td>{i.name} </td>
                                    <td>{i.actual_time}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* pagination */}
                <div className="row float-right">
                  <nav
                    aria-label="Page navigation example"
                    className="d-flex align-self-end mt-3"
                  >
                    <ul className="pagination">
                      <li className="page-item">
                        {/* <a  href="#" aria-label="Previous" onClick={() => handlePageChange(currentPage - 1)}>
                                                    <span aria-hidden="true">«</span>
                                                </a> */}
                      </li>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                        >
                          {/* <a  href="#" onClick={() => handlePageChange(index + 1)}>
                                                        {index + 1}
                                                    </a> */}
                        </li>
                      ))}
                      <li className="page-item">
                        {/* <a  href="#" aria-label="Next" onClick={() => handlePageChange(currentPage + 1)}>
                                                    <span aria-hidden="true">»</span>
                                                </a> */}
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProjectReport;
