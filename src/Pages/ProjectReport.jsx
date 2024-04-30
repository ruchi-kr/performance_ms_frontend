import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import moment from "moment";
import { getEmployeeReport } from "../Config";
import { Input, Button, DatePicker, Tag } from "antd";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
const { Search } = Input;
const { RangePicker } = DatePicker;
const ProjectReport = () => {
  const user_id = sessionStorage.getItem("id");
  // for pagination
  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [reportData, setReportData] = useState([]);
  const [projectActualStartDate, setProjectActualStartDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const manager_id = user.employee_id;
  console.log("manager id", manager_id);
  // get all reports function
  const getEmployeeReportHandler = async (page) => {
    try {
      // const response = await axios.get(`${getEmployeeReport}/${user_id}?page=${page}&pageSize=${pageSize}&name=${search}`);
      // ?page=${page}&pageSize=${pageSize}
      const response = await axios.get(
        `http://localhost:8000/api/project/report/${manager_id}/?search=${search}&toDate=${toDate}&fromDate=${fromDate}&page=${currentPage}&pageSize=${10}`
      );
      setReportData(response.data);
      console.log("report data", response.data);
      setTotalPages(Math.ceil(response.headers["x-total-count"] / pageSize));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getEmployeeReportHandler(currentPage);
  }, [currentPage, toDate, fromDate]);

  useEffect(() => {
    async function fetchScheduleStartDate() {
      const projectExtraDetails = await axios.get(
        `http://localhost:8000/api/project/actualStartDate/${manager_id}`
      );
      console.log("project extra details", projectExtraDetails.data);
      setProjectActualStartDate(projectExtraDetails.data);
    }
    fetchScheduleStartDate();
  }, []);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber == 0 ? 1 : pageNumber);
    getEmployeeReportHandler(pageNumber == 0 ? 1 : pageNumber);
  };
  const findActualStartDate = (projectId) => {
    const project = projectActualStartDate?.find(
      (item) => item?.project_id === projectId
    );
    console.log("date", project?.actual_start_date);
    return project ? project?.actual_start_date : null;
  };
  // search functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);
  const onSearch = async () => {
    if (search === null || search === undefined) return;
    getEmployeeReportHandler();
  };
  const handleDateRangeChange = (dates, dateStrings) => {
    console.log("dates", dates);
    console.log("dateStrings", dateStrings);

    const formattedDates = dateStrings.map((date) =>
      moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")
    );
    console.log("new date format", formattedDates);
    if (dates) {
      setToDate(formattedDates[0]);
      setFromDate(formattedDates[1]);
    }
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
                <h3 className="text-primary">All Project Reports</h3>
                <hr className="bg-primary border-4" />
                <div className="d-flex justify-content-between">
                  <div className="col-2">
                    <label className="text-capitalize fw-bold text-info">
                      project name
                    </label>

                    <Search
                      placeholder="search by project name"
                      allowClear
                      onSearch={onSearch}
                      style={{
                        width: 200,
                      }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex-end">
                    <div className="col-sm-4 col-md-3 col-lg-8">
                      <div className="mb-3">
                        <label className="text-capitalize textcolumntitle fw-bold text-info">
                          Select Date Range
                        </label>
                        <RangePicker
                          onChange={handleDateRangeChange}
                          style={{
                            width: "100%",
                            boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.2)",
                          }}
                          className="rounded-2"
                          format={"DD/MM/YYYY"}
                          showTime={false}
                        />
                      </div>
                    </div>

                    {/* <div className="col-sm-4 col-md-1 col-lg-1 ">
                      <Button
                        className="py-1 px-2 mt-3 btn btn-info btn-sm rounded-2"
                        // onClick={handleSearchByDateRange}
                      >
                        Search
                      </Button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-11 mx-auto">
                {/* table */}
                <table className="table table-striped table-hover mt-5">
                  <thead>
                    <tr className="table-info">
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
                      <th scope="col" className="text-center ">
                        Man Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {reportData?.map((item, index) => {
                      const totalActualTime = item?.report?.reduce(
                        (acc, i) => acc + i.total_actual_time,
                        0
                      );
                      const totalAllocatedTime = item?.report?.reduce(
                        (acc, i) => acc + i.total_allocated_time,
                        0
                      );
                      return (
                        <tr key={item.user_id}>
                          <th scope="row">{index + 1}</th>
                          <td className="text-capitalize">
                            <NavLink
                              to={`/view/project/tasks/${item.project_id}`}
                              replace={true}
                            >
                              <Tag color="gray">{item.project_name}</Tag>
                            </NavLink>
                          </td>
                          <td>
                            <div>
                              {moment
                                .utc(item.schedule_start_date)
                                .format("DD/MM/YYYY")}
                            </div>
                            <div>
                              {moment
                                .utc(item.schedule_end_date)
                                .format("DD/MM/YYYY")}
                            </div>
                          </td>
                          <td>
                            <div>
                              {findActualStartDate(item?.project_id) !== null
                                ? moment
                                    .utc(findActualStartDate(item?.project_id))
                                    .format("DD/MM/YYYY")
                                : "Not yet started"}
                            </div>
                          </td>

                          <td>
                            <table className="mx-auto">
                              <thead>
                                <tr>
                                  <th scope="col">S.No.</th>
                                  <th scope="col">Name</th>
                                  <th scope="col">Alloc. Time</th>
                                  <th scope="col">Act. Taken</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item?.report?.map((i, index) =>
                                  i.name !== null ? (
                                    <tr className="">
                                      <th scope="row" className="text-center">
                                        {index + 1}
                                      </th>
                                      <td>{i.name} </td>
                                      <td className="text-center">
                                        {i.total_allocated_time}
                                      </td>
                                      <td className="text-center">
                                        {i.total_actual_time}
                                      </td>
                                    </tr>
                                  ) : (
                                    ""
                                  )
                                )}
                                {totalAllocatedTime - totalActualTime < 0 ? (
                                  <tr className="table-danger">
                                    <td colSpan={2}>
                                      <span style={{ fontWeight: "bolder" }}>
                                        Grand total
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      <span style={{ fontWeight: "bolder" }}>
                                        {totalAllocatedTime}
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      <span style={{ fontWeight: "bolder" }}>
                                        {totalActualTime}
                                      </span>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr className="table-info">
                                    <td colSpan={2}>
                                      <span style={{ fontWeight: "bolder" }}>
                                        Grand total
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      <span style={{ fontWeight: "bolder" }}>
                                        {totalAllocatedTime}
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      <span style={{ fontWeight: "bolder" }}>
                                        {totalActualTime}
                                      </span>
                                    </td>
                                  </tr>
                                )}
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
                        <a
                          className="page-link"
                          href="#"
                          aria-label="Previous"
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <span aria-hidden="true">«</span>
                        </a>
                      </li>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                        >
                          <a
                            className="page-link"
                            href="#"
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </a>
                        </li>
                      ))}
                      <li className="page-item">
                        <a
                          className="page-link"
                          href="#"
                          aria-label="Next"
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <span aria-hidden="true">»</span>
                        </a>
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
