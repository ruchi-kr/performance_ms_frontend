import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { getEmployeeReport,CONFIG_OBJ } from "../Config";
import { Input, DatePicker, Button, Tag, Progress, Flex } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { faFilePdf, faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
const { Search } = Input;
const { RangePicker } = DatePicker;

const ManagerEmployeeReport = () => {
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
  // Function to handle expand all rows
  const [expandedRows, setExpandedRows] = useState([]);
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
        `http://localhost:8000/api/employee/report/${manager_id}/?search=${search}&toDate=${toDate}&fromDate=${fromDate}&page=${currentPage}&pageSize=${10}`,CONFIG_OBJ
      );
      console.log("response", response);
      setReportData(response.data);
      // setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize));
      // Rest of the function...
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getEmployeeReportHandler(currentPage);
  }, [toDate, fromDate, currentPage]);
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

  // export to excel and pdf file function
  const exportToExcel = () => {
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
    const title = "Employee Report Project-Wise";
    const headers = [
      [
        "S.No.",
        "Project Name",
        "Schd. Start Date",
        "Schd. End Date",
        "Alloc hrs",
        "Man hrs",
      ],
    ];

    //   const data = reportData.map((item, index) => [
    //     index + 1,
    //     item.project_name,
    //     `${item.schedule_start_date.slice(8, 10)}/${item.schedule_start_date.slice(5, 7)}/${item.schedule_start_date.slice(0, 4)}`,
    //     `${item.schedule_end_date.slice(8, 10)}/${item.schedule_end_date.slice(5, 7)}/${item.schedule_end_date.slice(0, 4)}`,
    //     item.total_allocated_hours,
    //     item.total_actual_hours,
    // ]);

    let data = [];
    reportData.forEach((item, index) => {
      const row = [
        index + 1,
        item.project_name,
        `${item.schedule_start_date.slice(
          8,
          10
        )}/${item.schedule_start_date.slice(
          5,
          7
        )}/${item.schedule_start_date.slice(0, 4)}`,
        `${item.schedule_end_date.slice(8, 10)}/${item.schedule_end_date.slice(
          5,
          7
        )}/${item.schedule_end_date.slice(0, 4)}`,
        item.total_allocated_hours,
        item.total_actual_hours,
        "", // Placeholder for tasks
      ];
      data.push(row);
      if (expandedRow === index) {
        JSON.parse(item.tasks).forEach((task) => {
          const taskRow = [
            // { content: task.task, styles: { color: 'blue' } },
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
  const calculateEfficiency = (taskRecords) => {
    console.log("report data for each row", reportData);
    let totalAllocatedHours = 0;
    let totalWeightedActualHours = 0;
    let totalWeightedPercentage = 0;
    let efficency = 0;
    let count = 0;
    let completed = 0;
    let inprocess = 0;
    let transfered = 0;
    let notStarted = 0;

    taskRecords?.forEach((task) => {
      if (task.status !== "notstarted") {
        const weightedPercentage =
          (task.allocated_time / task.actual_time) * task.task_percent;
        totalWeightedPercentage += weightedPercentage;
        totalWeightedActualHours += weightedPercentage;
        count++;
      }
      //

      if (task.status === "completed") completed++;
      else if (task.status === "inprocess") inprocess++;
      else if (task.status === "transfer") transfered++;
      else if (task.status === "notstarted") notStarted++;
    });
    console.log("total weighted hours", totalWeightedPercentage);
    console.log("total allocated hours", totalAllocatedHours);
    const efficiency = totalWeightedPercentage / count;
    console.log("efficencyyyyyy", efficiency);
    // setEfficency(Math.ceil(efficiency));
    // setTotalTasks(count);
    // setCompletedTasks(completed);
    // setInprocessTasks(inprocess);
    // setTransferedTasks(transfered);
    // setNotStartedTasks(notStarted);
    return Math.ceil(efficiency);
  };
  
  const handleExpandAll = () => {
    if (expandedRows.length === reportData.length) {
      setExpandedRows([]);
    } else {
      const newExpandedRows = reportData.map((_, index) => index);
      setExpandedRows(newExpandedRows);
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
                <h3 className="text-primary">Employee-wise Report</h3>
                <hr className="bg-primary border-4" />
                <div className="d-flex justify-content-between">
                  <div className="col-2">
                    <label className="text-capitalize fw-bold text-info">
                      Employee name
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
                            // boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.2)",
                          }}
                          className="rounded-2"
                          format={dateFormat}
                          defaultValue={[dayjs().subtract(28, "day"), dayjs()]}
                          showTime={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-2 mt-4 d-flex justify-content-end">
                    <div className=" d-flex gap-3">
                      <FontAwesomeIcon
                        icon={faFileExcel}
                        size="2xl"
                        style={{ color: "#74C0FC" }}
                        onClick={exportToExcel}
                      />
                      <FontAwesomeIcon
                        icon={faFilePdf}
                        style={{ color: "#ee445e" }}
                        size="2xl"
                        onClick={exportToPDF}
                      />
                    </div>
                  </div>
                 
                </div>
                <div className="d-flex justify-content-end mt-3 mr-4">
                  <Button onClick={handleExpandAll} className="text-info">
                    {!expandedRows || expandedRows.length < reportData.length
                      ? "Expand All"
                      : "Collapse All"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-11 mx-auto">
                {/* table */}
                <table
                  id="reportTablepw"
                  className="table table-striped table-hover mt-2"
                >
                  <thead>
                    <tr className="table-info">
                      <th scope="col">S.No.</th>
                      <th scope="col">Employee Name</th>
                      <th scope="col">Allocated Time</th>
                      <th scope="col">Man Hours</th>
                      <th scope="col">Efficiency</th>
                    </tr>
                  </thead>

                  <tbody className="table-group-divider">
                    {reportData &&
                      reportData.map((item, index) => {
                        // let totalAllocatedTime = item?.tasks_details?.reduce(
                        //   (acc, i) => acc + i.allocated_time,
                        //   0
                        // );
                        console.log("in jsx part", item.tasks_details);
                        let efficiency = calculateEfficiency(
                          item.tasks_details
                        );

                        return (
                          <React.Fragment key={item.employee_id}>
                            <tr onClick={() => handleRowClick(index)}>
                              <th scope="row">{index + 1}</th>
                              <td className="text-capitalize">
                                <NavLink
                                  to={`/manager/report/employee/${item.employee_id}`}
                                >
                                  <Tag color={"blue"}>{item.name}</Tag>
                                </NavLink>
                              </td>
                              <td>{item.total_allocated_time} hrs.</td>
                              <td>{item.total_actual_time} hrs.</td>
                              <td>{efficiency} %</td>
                            </tr>
                            {(expandedRows.includes(index) || expandedRow === index) && (
                              <tr>
                                <td colSpan="12">
                                  <table className="col-12 mx-auto">
                                    <thead>
                                      <tr>
                                        <th>Project Name</th>
                                        <th>Module Name</th>
                                        <th>Task</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Alloc. Time</th>
                                        <th>Act. Time</th>
                                        <th>%&nbsp;Work Done</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {item?.tasks_details &&
                                        item?.tasks_details.map(
                                          (task, taskIndex) => (
                                            <tr key={taskIndex}>
                                              <td className="text-capitalize">
                                                {task.project_name}
                                              </td>
                                              <td className="text-capitalize">
                                                {task.module_name}
                                              </td>
                                              <td className="text-capitalize">{task.task}</td>
                                              <td>
                                                {moment
                                                  .utc(task.created_at)
                                                  .format("DD/MM/YYYY")}
                                              </td>
                                              <td className="text-center">{task.status==="completed"?
                                            moment
                                                .utc(task.actual_end_date)
                                                .format("DD/MM/YYYY"):
                                                (task.status==="inprocess" || task.status==="notstarted")?
                                                <span className="text-center">N.A.</span>:
                                                moment
                                                .utc(task.updated_at)
                                                .format("DD/MM/YYYY")
                                              
                                              }</td>
                                              {/* {task.status === "completed" ? (
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
                                            )} */}
                                              {task.status === "completed" ? (
                                                <td className="text-success text-capitalize text-small">
                                                  {task.status}
                                                </td>
                                              ) : (
                                                <td className="text-warning text-capitalize">
                                                  {task.status}
                                                </td>
                                              )}
                                              <td>
                                                {task.allocated_time} hrs.
                                              </td>
                                              <td>{task.actual_time} hrs.</td>
                                              <td>
                                                {/* {task.task_percent} % */}
                                                <Flex vertical gap="middle">
                                                  <Flex
                                                    vertical
                                                    gap="small"
                                                    style={{
                                                      width: 120,
                                                    }}
                                                  >
                                                    <Progress
                                                      percent={Number(
                                                        task.task_percent
                                                      )}
                                                      size={[120, 15]}
                                                    />
                                                  </Flex>
                                                </Flex>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
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

export default ManagerEmployeeReport;
