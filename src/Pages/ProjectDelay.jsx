import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { getEmployeeReport, CONFIG_OBJ } from "../Config";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Input,
  DatePicker,
  Button,
  Select,
  Tag,
  Flex,
  Progress,
  Col,
  Row,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { faFilePdf, faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { NavLink, useNavigate, useParams, useLocation } from "react-router-dom";
const { Search } = Input;
const { RangePicker } = DatePicker;

const ProjectDelay = () => {
  const dateFormat = "DD/MM/YYYY";
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [search, setSearch] = useState("");
  const user_id = sessionStorage.getItem("id");
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [moduleDelayData, setModuleDelayData] = useState([]);
  const [projectStageFilter, setProjectStageFilter] = useState("all");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const manager_id = user?.employee_id;
  const navigate = useNavigate();
  const location = useLocation();
  const { project_id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const project_name = queryParams.get("project_name").replace(/%20/g, " ");
  console.log("manager id", manager_id);
  console.log("dates", dayjs().subtract(1, "D"), dayjs().format("DD/MM/YYYY"));
  //    const getEmployeeReportHandler = async (page, formattedFromDate, formattedToDate) => {
  //        try {
  //            const response = await axios.get(
  //                `${getEmployeeReport}/${user_id}?page=${page}&pageSize=${pageSize}&name=${search}&fromDate=${formattedFromDate}&toDate=${formattedToDate}`
  //            );

  //            setModuleDelayData(response.data);
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
        `http://localhost:8000/api/project/delay/module/${project_id}`,
        CONFIG_OBJ
      );
      console.log("response", response);
      setModuleDelayData(response.data);
      // setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize));
      // Rest of the function...
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getEmployeeReportHandler(currentPage);
  }, [toDate, fromDate, currentPage, projectStageFilter]);
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
  // Function to handle expand all rows
  const [expandedRows, setExpandedRows] = useState([]);

  const handleExpandAll = () => {
    if (expandedRows.length === moduleDelayData.length) {
      setExpandedRows([]);
      // setExpandedRow(null);
    } else {
      const newExpandedRows = moduleDelayData.map((_, index) => index);
      setExpandedRows(newExpandedRows);
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
  const handleNavigation = (project_id) => {
    console.clear();
    const filteredReportData = moduleDelayData.filter(
      (item) => item.project_id === project_id
    );
    console.log(filteredReportData);
    navigate(`/manager/report/project/detailed/${project_id}`, {
      state: { data: filteredReportData },
    });
  };
  // export to excel and pdf file function
  const exportToExcel = async () => {
    window.confirm("Do you want to download record!");
    // const response = await axios.get(
    //   `http://localhost:8000/api/project/report/detailed/${manager_id}/?&search=${search}&toDate=${toDate}&fromDate=${fromDate}&page=1&pageSize=10000`
    // );
    // console.log("excel response", response.data);
    const htmlTable = document.getElementById("reportTablepw");
    const wb = XLSX.utils.table_to_book(htmlTable);
    XLSX.writeFile(wb, "employee_reportPW.xlsx");
  };

  const exportToPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // 'portrait' or 'landscape'

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);
    const title = "Project Detailed Report";
    const headers = [["S.No.", "Project Name", "Alloc hrs", "Man hrs"]];

    //   const data = moduleDelayData.map((item, index) => [
    //     index + 1,
    //     item.project_name,
    //     `${item.schedule_start_date.slice(8, 10)}/${item.schedule_start_date.slice(5, 7)}/${item.schedule_start_date.slice(0, 4)}`,
    //     `${item.schedule_end_date.slice(8, 10)}/${item.schedule_end_date.slice(5, 7)}/${item.schedule_end_date.slice(0, 4)}`,
    //     item.total_allocated_hours,
    //     item.total_actual_hours,
    // ]);

    let data = [];
    moduleDelayData.forEach((item, index) => {
      const row = [
        index + 1,
        item.project_name,
        item.total_allocated_hours,
        item.total_actual_hours,
        "", // Placeholder for tasks
      ];
      data.push(row);
      if (expandedRows.includes(index) || expandedRow === index) {
        item.tasks_details.forEach((task, index) => {
          const taskRow = [
            // { content: task.task, styles: { color: 'blue' } },
            index,
            task.employee_name,
            task.task, // Task
            `${task.created_at.slice(8, 10)}/${task.created_at.slice(
              5,
              7
            )}/${task.created_at.slice(0, 4)}`,
            task.status,
            task.allocated_time,
            task.actual_time,
          ];
          data.push(taskRow);
        });
      }
    });

    let content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content); // Ensure you're using autoTable correctly here
    doc.save("employee_reportPW.pdf");
  };

  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            <div className="row mt-5">
              <div className="col-12 mx-auto">
                <h3 className="text-primary text-capitalize">{project_name}</h3>
                <h4 className="text-primary">Modules Delay</h4>
                <hr className="bg-primary border-4" />
                {/* <Row gutter={24}>
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <label className="text-capitalize fw-bold text-info">
                      Employee Search
                    </label>
                    <Search
                      placeholder="Search Employee"
                      allowClear
                      onSearch={onSearch}
                      style={{
                        width: 200,
                      }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </Col>
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <label className="text-capitalize textcolumntitle fw-bold text-info">
                      Project Stage
                    </label>
                    <Select
                      defaultValue="All stages"
                      style={{
                        width: 160,
                      }}
                      onChange={(value) => setProjectStageFilter(value)}
                      options={[
                        {
                          value: "all",
                          label: "All Stages",
                        },
                        {
                          value: "inprocess",
                          label: "Inprocess",
                        },
                        {
                          value: "completed",
                          label: "Completed",
                        },
                      ]}
                    />
                  </Col>
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginLeft: "auto",
                    }}
                  >
                    <label className="text-capitalize textcolumntitle fw-bold text-info">
                      Select Date Range
                    </label>
                    <RangePicker
                      disabledDate={disabledDate}
                      onChange={handleDateRangeChange}
                      defaultValue={[dayjs().subtract(30, "day"), dayjs()]}
                      placeholder="From Date"
                      style={{
                        width: "100%",
                      }}
                      className="rounded-2"
                      format={dateFormat}
                      showTime={false}
                    />
                  </Col>
                </Row> */}

                {/* <div className="d-flex justify-content-end mt-3 mr-2">
                  <Button onClick={handleExpandAll} className="text-info mr-3">
                    {!expandedRows || expandedRows.length < moduleDelayData.length
                      ? "Expand"
                      : "Collapse"}
                  </Button>
                  <div className="d-flex gap-3 align-items-center">
                    <FontAwesomeIcon
                      icon={faFileExcel}
                      size="xl"
                      style={{ color: "#74C0FC" }}
                      onClick={exportToExcel}
                    />
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      style={{ color: "#ee445e" }}
                      size="xl"
                      onClick={exportToPDF}
                    />
                  </div>
                </div> */}
                <div className="d-flex justify-content-between mt-3 mr-2">
                  <Col>
                    <NavLink
                      to={`/manager/report/project/detailed/`}
                      className=" d-flex align-items-center"
                    >
                      <ArrowLeftOutlined style={{ fontSize: "1.5rem" }} />
                      &nbsp; Back{" "}
                    </NavLink>
                  </Col>
                  <div>
                    <span>(Time in days)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 mx-auto">
                {/* table */}
                <table id="reportTablepw" className="table table-striped  mt-2">
                  <thead>
                    <tr>
                      <th scope="col" className="text-center">
                        S.No.
                      </th>
                      <th scope="col">Module Name</th>
                      <th scope="col">
                        <div
                          className="d-flex flex-column"
                          style={{ width: "6rem" }}
                        >
                          <span>Schd. St. Dt.</span>
                          <span>Schd. End Dt.</span>
                        </div>
                      </th>

                      <th scope="col" className="">
                        Task Name
                      </th>
                      {/* <th scope="col" className="">
                        Assigned To
                      </th> */}
                      <th scope="col" className="">
                        Delay Days
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {moduleDelayData.map((task, taskIndex) => (
                      <tr key={taskIndex}>
                        <td className="text-center">{`${taskIndex + 1}`}</td>
                        <td className="text-capitalize">
                          {task.module_name !== "null" ? (
                            task.module_name
                          ) : (
                            <span className="d-flex justify-content-center align-items-center">
                              -
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex flex-column ">
                            <span className="">
                              {moment.utc(task.from_date).format("DD/MM/YYYY")}
                            </span>
                            <span className="">
                              {moment.utc(task.to_date).format("DD/MM/YYYY")}
                            </span>
                          </div>
                        </td>
                        <td className="text-capitalize">
                          {task.task_name !== null ? (
                            <NavLink
                              to={`/manager/module/delay/${task.module_id}/?project_id=${project_id}&module_name=${task.module_name}&project_name=${project_name}`}
                            >
                              {task.task_name}
                            </NavLink>
                          ) : (
                            <span className="center">-</span>
                          )}
                        </td>
                        <td className="text-capitalize">
                          {task.max_delay_days !== null ? (
                            task.max_delay_days
                          ) : (
                            <span className="center">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* pagination */}
                <div className="row float-right">
                  {/* <nav
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
                  </nav> */}
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

export default ProjectDelay;
