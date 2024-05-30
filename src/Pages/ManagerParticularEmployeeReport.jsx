import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { getEmployeeReport, CONFIG_OBJ } from "../Config";
import {
  ArrowLeftOutlined,
  
} from "@ant-design/icons";
import {
  Input,
  DatePicker,
  Button,
  Tag,
  Progress,
  Flex,
  Row,
  Col,
  Select,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { faFilePdf, faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useParams } from "react-router-dom";
const { Search } = Input;
const { RangePicker } = DatePicker;

const ManagerParticularEmployeeReport = () => {
  const dateFormat = "DD/MM/YYYY";
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [search, setSearch] = useState("");
  const user_id = sessionStorage.getItem("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportData, setReportData] = useState([]);
  const [projectStageFilter, setProjectStageFilter] = useState("all");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const manager_id = user.employee_id;
  const { employee_id } = useParams();
  console.log("manager id", manager_id);
  // Function to handle expand all rows
  const [expandedRows, setExpandedRows] = useState([]);

  const getEmployeeReportHandler = async (page) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/employee/report/${manager_id}/${employee_id}/?search=${search}&toDate=${toDate}&fromDate=${fromDate}&stage=${projectStageFilter}&page=${currentPage}&pageSize=${10}`,
        CONFIG_OBJ
      );
      console.log("response", response);
      setReportData(response.data);
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

  const [expandedRow, setExpandedRow] = useState(null);
  const handleRowClick = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };
  const handleDateRangeChange = (dates, dateStrings) => {
    const formattedDates = dateStrings.map((date) =>
      moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")
    );
    if (dates) {
      setToDate(formattedDates[0]);
      setFromDate(formattedDates[1]);
    }
  };
  const disabledDate = (current) => {
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
    let transfered = 0;
    let completed = 0;
    let inprocess = 0;
    let notStarted = 0;

    taskRecords?.forEach((task) => {
      if (task.status !== "notstarted") {
        const weightedPercentage =
          (task.allocated_time / task.actual_time) * task.task_percent;
        totalWeightedPercentage += weightedPercentage;
        totalWeightedActualHours += weightedPercentage;
        count++;
      }
      if (task.status === "completed") completed++;
      else if (task.status === "inprocess") inprocess++;
      else if (task.status === "transfer") transfered++;
      else if (task.status === "notstarted") notStarted++;
    });
    console.log("total weighted hours", totalWeightedPercentage);
    console.log("total allocated hours", totalAllocatedHours);
    const efficiency = totalWeightedPercentage / count;
    return efficiency.toFixed(2);
  };

  const handleExpandAll = () => {
    if (expandedRows.length === reportData.length) {
      setExpandedRows([]);
      setExpandedRow(null);
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
                <h3 className="text-primary">Employee Detailed Report</h3>
                <hr className="bg-primary border-4" />
                <Row gutter={24}>
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <label className="text-capitalize fw-bold text-info">
                      Project Search
                    </label>

                    <Search
                      placeholder="Search Project"
                      allowClear
                      onSearch={onSearch}
                      style={{
                        width: 200,
                      }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </Col>
                  {/* <Col
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
                  </Col> */}
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
                      placeholder="From Date"
                      style={{
                        width: "100%",
                      }}
                      className="rounded-2"
                      format={dateFormat}
                      defaultValue={[dayjs().subtract(30, "day"), dayjs()]}
                      showTime={false}
                    />
                  </Col>
                </Row>
                <div className="row mt-3 ">
                  <div className="d-flex justify-content-end mt-3 mr-2">
                    <div className="d-flex gap-3 align-items-center">
                      {/* <Button onClick={handleExpandAll} className="text-info">
                        {!expandedRows ||
                        expandedRows.length < reportData.length
                          ? "Expand"
                          : "Collapse "}
                      </Button> */}
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
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-3 mr-2">
                  <Col>
                    <NavLink
                      to={`/manager/report/employee`}
                      className=" d-flex align-items-center"
                    >
                      <ArrowLeftOutlined style={{ fontSize: "1.5rem" }} />
                      &nbsp; Back{" "}
                    </NavLink>
                  </Col>
                  <div>
                    <span className="text-danger">*</span>
                    <span>Time in hours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-11 mx-auto">
                <table id="reportTablepw" className="table table-striped mt-2">
                  <thead>
                    <tr className="">
                      <th scope="col">S.No.</th>
                      <th scope="col">Employee Name</th>
                      <th scope="col" className="text-center">
                        Allocated Man hrs
                      </th>
                      <th scope="col" className="text-center">
                        Actual Man hrs
                      </th>
                      <th scope="col" className=" text-center">
                        Efficiency (%)
                      </th>
                    </tr>
                  </thead>

                  <tbody className="table-group-divider">
                    {reportData &&
                      reportData.map((item, index) => {
                        let efficiency = calculateEfficiency(
                          item.tasks_details
                        );

                        return (
                          <React.Fragment key={item.employee_id}>
                            <tr onClick={() => handleRowClick(index)}>
                              <td>{index + 1}.</td>
                              <td className="text-capitalize">
                                {/* <NavLink
                                  to={`/manager/report/employee/${item.employee_id}`}
                                > */}
                                {/* <Tag color={"blue"}>{item.name}</Tag> */}
                                {item.name}
                                {/* </NavLink> */}
                              </td>
                              <td className="text-center">
                                {item.total_allocated_time}{" "}
                              </td>
                              <td className="text-center">
                                {item.total_actual_time}{" "}
                              </td>
                              <td className=" text-center">{efficiency}</td>
                            </tr>
                            {(expandedRows.includes(index) ||
                              expandedRow === index) && (
                              <tr>
                                <td colSpan="12">
                                  <table className="col-12 mx-auto">
                                    <thead>
                                      <tr>
                                        <th>S.No.</th>
                                        <th>Project Name</th>
                                        <th>Module Name</th>
                                        <th>Task</th>
                                        <th>
                                          <div className="d-flex flex-column">
                                            <span>Start Date</span>
                                            <span>End Date</span>
                                          </div>
                                        </th>
                                        <th className="text-center">
                                          Alloc. Time
                                        </th>
                                        <th className="text-center">
                                          Act. Time
                                        </th>
                                        <th>
                                          <div className="d-flex flex-column text-center">
                                            <span>% Work Done</span>
                                            <span>Status</span>
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {item?.tasks_details &&
                                        item?.tasks_details.map(
                                          (task, taskIndex) => (
                                            <tr key={taskIndex}>
                                              <td>{`${index + 1}.${
                                                taskIndex + 1
                                              }`}</td>
                                              <td className="text-capitalize">
                                                {task.project_name}
                                              </td>
                                              <td className="text-capitalize">
                                                {task.module_name}
                                              </td>
                                              <td className="text-capitalize">
                                                {task.task}
                                              </td>
                                              <td>
                                                <div className="d-flex flex-column">
                                                  <span className="text-center">
                                                    {moment
                                                      .utc(task.created_at)
                                                      .format("DD/MM/YYYY")}
                                                  </span>
                                                  <span className="text-center">
                                                    {task.status ===
                                                    "completed" ? (
                                                      moment
                                                        .utc(
                                                          task.actual_end_date
                                                        )
                                                        .format("DD/MM/YYYY")
                                                    ) : task.status ===
                                                        "inprocess" ||
                                                      task.status ===
                                                        "notstarted" ? (
                                                      <span className="text-center">
                                                        -
                                                      </span>
                                                    ) : (
                                                      moment
                                                        .utc(task.updated_at)
                                                        .format("DD/MM/YYYY")
                                                    )}
                                                  </span>
                                                </div>
                                              </td>
                                              <td className="text-center">
                                                {task.allocated_time}
                                              </td>
                                              <td className="text-center">
                                                {task.actual_time}
                                              </td>
                                              <td>
                                                <Flex vertical gap="middle">
                                                  <Flex
                                                    vertical
                                                    gap="small"
                                                    style={{
                                                      width: 120,
                                                    }}
                                                  >
                                                  <Progress
                                                      percent={
                                                        task.task_percent
                                                      }
                                                      status={
                                                        task.task_percent ===
                                                        100
                                                          ? ""
                                                          : "active"
                                                      }
                                                      strokeColor={{
                                                        from: "#108ee9",
                                                        to: "#87d068",
                                                      }}
                                                    />
                                                  </Flex>
                                                  {(() => {
                                                    let className =
                                                      "text-capitalize ";
                                                    let style = {};

                                                    switch (task.status) {
                                                      case "completed":
                                                        className +=
                                                          "text-success";
                                                        break;
                                                      case "inprocess":
                                                        style.color = "orange";

                                                        break;
                                                      case "not started":
                                                        style.color = "red";
                                                        break;
                                                      case "transfer":
                                                        style.color = "blue";
                                                        break;
                                                      default:
                                                        className +=
                                                          "text-secondary";
                                                        style.color = "gray";
                                                        break;
                                                    }

                                                    return (
                                                      <span
                                                        className={className}
                                                        style={style}
                                                      >
                                                        {task.status}
                                                      </span>
                                                    );
                                                  })()}
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ManagerParticularEmployeeReport;
