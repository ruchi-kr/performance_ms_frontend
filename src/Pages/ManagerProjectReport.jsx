import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { getEmployeeReport } from "../Config";
import { Input, DatePicker, Button, Tag } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { toast } from "react-toastify";
const { Search } = Input;
const { RangePicker } = DatePicker;

const ManagerProjectReport = () => {
  const dateFormat = "DD/MM/YYYY";
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [search, setSearch] = useState("");
  const user_id = sessionStorage.getItem("id");
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [reportData, setReportData] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const manager_id = user.employee_id;
  console.log("manager id", manager_id);

  //    const getEmployeeReportHandler = async (page, formattedFromDate, formattedToDate) => {
  //        try {
  //            const response = await axios.get(
  //                `${getEmployeeReport}/${user_id}?page=${page}&pageSize=${pageSize}&name=${search}&fromDate=${formattedFromDate}&toDate=${formattedToDate}`
  //            );

  //            setReportData(response.data);
  //            const tasksArray = JSON.parse(response.data[3].tasks);
  //            setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize));
  //        } catch (err) {
  //            console.log(err);
  //        }
  //    };

  // ?page=${page}&pageSize=${pageSize} page,
  const getEmployeeReportHandler = async (page) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/employee/report/${manager_id}&search=${search}&toDate=${toDate}&fromDate=${fromDate}`
      );
      console.log("response", response);
      setReportData(response.data);
      // setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize));
      // Rest of the function...
    } catch (err) {
      console.log(err);
    }
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber == 0 ? 1 : pageNumber);
    getEmployeeReportHandler(pageNumber == 0 ? 1 : pageNumber);
  };

  const [expandedRow, setExpandedRow] = useState(null);
  const handleRowClick = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
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
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current >= dayjs().endOf("day");
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
                <h3 className="text-primary">Project-wise Report</h3>
                <hr className="bg-primary border-4" />
                <div className="d-flex justify-content-between">
                  <div className="col-2">
                    <label className="text-capitalize fw-bold text-info">
                      Project name
                    </label>

                    <Search
                      placeholder="search by employee name"
                      allowClear
                      onSearch={onSearch}
                      style={{
                        width: 200,
                      }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="col-sm-4 col-md-3 col-lg-8">
                      <div className="mb-3">
                        <label className="text-capitalize textcolumntitle fw-bold text-info">
                          Select Date Range
                        </label>
                        <RangePicker
                          disabledDate={disabledDate}
                          onChange={handleDateRangeChange}
                          placeholder="From Date"
                          style={{
                            width: "100%",
                            boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.2)",
                          }}
                          className="rounded-2"
                          format={dateFormat}
                          showTime={false}
                        />
                      </div>
                    </div>

                    {/* <div className="col-sm-4 col-md-1 col-lg-1 ">
                      <Button
                        className="py-1 px-2 mt-3 btn btn-info btn-sm rounded-2"
                        onClick={handleSearchByDateRange}
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
                    <tr>
                      <th scope="col">S.No.</th>
                      <th scope="col">Project Name</th>
                      <th scope="col">Alloc hrs</th>
                      <th scope="col">Man hrs</th>
                    </tr>
                  </thead>

                  <tbody className="table-group-divider">
                    {reportData &&
                      reportData.map((item, index) => (
                        <React.Fragment key={item.employee_id}>
                          <tr onClick={() => handleRowClick(index)}>
                            <th scope="row">{index + 1}</th>
                            <td className="text-capitalize">{item.name}</td>
                            <td>{item.total_allocated_time}</td>
                            <td>{item.total_actual_time}</td>
                          </tr>
                          {expandedRow === index && (
                            <tr>
                              <td colSpan="12">
                                <table className="col-11 mx-auto">
                                  <thead>
                                    <tr>
                                      <th>Employee Name</th>
                                      <th>Task</th>
                                      <th>Date</th>
                                      <th>Status</th>
                                      <th>Allocated Time</th>
                                      <th>Actual Time</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item?.tasks_details &&
                                      item?.tasks_details.map(
                                        (task, taskIndex) => (
                                          <tr key={taskIndex}>
                                            <td>{task.project_name}</td>
                                            <td>{task.task}</td>
                                            <td>
                                              {moment
                                                .utc(task.created_at)
                                                .format("DD/MM/YYYY")}
                                            </td>
                                            {task.status === "completed" ? (
                                              <td>
                                                <Tag color="green">
                                                  {task.status}
                                                </Tag>
                                              </td>
                                            ) : (
                                              <td>
                                                <Tag color="red">
                                                  {task.status}
                                                </Tag>
                                              </td>
                                            )}
                                            <td>{task.allocated_time}</td>
                                            <td>{task.actual_time}</td>
                                          </tr>
                                        )
                                      )}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
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

export default ManagerProjectReport;
