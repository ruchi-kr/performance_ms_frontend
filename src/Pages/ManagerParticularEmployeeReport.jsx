import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { getEmployeeReport } from "../Config";
import { Input, DatePicker, Button } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { faFilePdf, faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
const { Search } = Input;
const { RangePicker } = DatePicker;

const ManagerParticularEmployeeReport = () => {
  const { employee_id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const manager_id = user.employee_id;
  console.log("manager id", manager_id);
  console.log("empoyee_id", employee_id);
  const dateFormat = "DD/MM/YYYY";
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const user_id = sessionStorage.getItem("id");
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [reportData, setReportData] = useState([]);

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
        `http://localhost:8000/api/employee/report/${manager_id}/${employee_id}/?search=${search}&toDate=${toDate}&fromDate=${fromDate}&page=${currentPage}&pageSize=${10}`
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

  // Function to handle expand all rows
  const [expandedRows, setExpandedRows] = useState([]);

  const handleExpandAll = () => {
    if (expandedRows.length === reportData.length) {
      setExpandedRows([]);
    } else {
      const newExpandedRows = reportData.map((_, index) => index);
      setExpandedRows(newExpandedRows);
    }
  };

  const handleExcel = () => {
    // Call function1 first, then function2
    // handleExpandAll();
    exportToExcel();
    // setTimeout(exportToExcel(), 3000);
  };

  // export to excel file function
  // const exportToExcel = () => {

  //   const htmlTable = document.getElementById('reportTablepw');
  //   const wb = XLSX.utils.table_to_book(htmlTable);
  //   XLSX.writeFile(wb, 'employee_reportPW.xlsx');
  // };

  const exportToExcel = () => {
    const htmlTable = document.getElementById("reportTablepw");

    // Clone the table to avoid modifying the original
    const clonedTable = htmlTable.cloneNode(true);

    // Iterate through each row and remove the row if it contains the specified content
    const rowsToRemove = Array.from(clonedTable.rows).filter((row) => {
      const rowData = Array.from(row.cells).map((cell) =>
        cell.textContent.trim()
      );
      const rowContent = rowData.join("");
      return rowContent.includes("TaskDateStatusAllocated TimeActual Time");
    });

    rowsToRemove.forEach((row) => row.remove());

    // Convert the modified cloned table to a workbook
    const wb = XLSX.utils.table_to_book(clonedTable);

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, "employee_reportPW.xlsx");
  };

  // to pdf file function
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
      if (expandedRows.includes(index) || expandedRow === index) {
        const taskheaders = [
          ["Task", "Date", "status", "Alloc hrs", "Man hrs"],
        ];
        data.push(taskheaders[0]); // Include task headers
        JSON.parse(item.tasks).forEach((task) => {
          // const taskheaders = [['Task', 'Date', 'status', 'Alloc hrs', 'Man hrs']];
          const taskRow = [
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
    //  // Iterate through each row in the data and draw background rectangles
    // const totalPages = doc.internal.getNumberOfPages();
    // for (let i = 1; i <= totalPages; i++) {
    //   doc.setPage(i);
    //   for (let j = 0; j < data.length; j++) {
    //     if (j > 0 && j % 2 === 0) { // Change color of every second row starting from the second row
    //       const y = 50 + j * 20;
    //       const width = doc.internal.pageSize.width - 2 * 40;
    //       const height = 20;
    //       doc.setFillColor(211, 211, 211); // Gray color
    //       doc.rect(40, y, width, height, 'F');
    //     }
    //   }
    // }
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
              <div className="col-11 mx-auto">
                <h3 className="text-primary">Project-wise Reports</h3>
                <hr className="bg-primary border-4" />
                <div className="d-flex justify-content-between">
                  <div className="col-2">
                    <label className="text-capitalize fw-bold text-info">
                      project name
                    </label>

                    <Search
                      placeholder="search by project name"
                      allowClear
                      style={{
                        width: 200,
                      }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-end me-3">
                    <div className="col-sm-4 col-md-3 col-lg-4 ">
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
                          showTime={false}
                        />
                      </div>
                    </div>

                    <div className="col-sm-4 col-md-1 col-lg-1 ">
                      {/* <Button
                        className="py-1 px-2 mt-3 btn btn-info btn-sm rounded-2"
                        onClick={handleSearchByDateRange}
                      >
                        Search
                      </Button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row d-flex justify-content-end">
              <div className="col-2">
                <div className=" d-flex gap-3">
                  <Button onClick={handleExpandAll} className="text-info">
                    {!expandedRows || expandedRows.length < reportData.length
                      ? "Expand"
                      : "Collapse"}
                  </Button>
                  {/* <Button onClick={handleExpandAll}>{!expandedRow || expandedRow.length < reportData.length ? 'Expand All' : 'Collapse All'}</Button> */}
                  <FontAwesomeIcon
                    icon={faFileExcel}
                    size="xl"
                    style={{ color: "#74C0FC" }}
                    onClick={handleExcel}
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
            <div className="row">
              <div className="col-11 mx-auto">
                {/* table */}
                <table
                  id="reportTablepw"
                  className="table table-striped table-hover mt-3"
                >
                  <thead>
                    <tr>
                      <th scope="col">S.No.</th>
                      <th scope="col">Project Name</th>
                      <th scope="col">Schd. Start Date</th>
                      <th scope="col">Schd. End Date</th>

                      <th scope="col">Alloc hrs</th>
                      <th scope="col">Man hrs</th>
                    </tr>
                  </thead>

                  <tbody className="table-group-divider">
                    {reportData &&
                      reportData.map((item, index) => (
                        <React.Fragment key={item.user_id}>
                          <tr onClick={() => handleRowClick(index)}>
                            <th scope="row">{index + 1}</th>
                            <td className="text-capitalize">
                              {item.project_name}
                            </td>
                            <td>
                              {moment.utc(item.created_at).format("DD/MM/YYYY")}
                            </td>
                            <td>
                              {moment.utc(item.created_at).format("DD/MM/YYYY")}
                            </td>

                            <td>{item.total_allocated_hours}</td>
                            <td>{item.total_actual_hours}</td>
                          </tr>
                          {(expandedRows.includes(index) ||
                            expandedRow === index) && (
                            // expandedRow === index
                            <tr>
                              <td colSpan="12">
                                <table className="col-11 mx-auto">
                                  <thead>
                                    <tr>
                                      <th>Task</th>
                                      <th>Date</th>
                                      <th>Status</th>
                                      <th>Allocated Time</th>
                                      <th>Actual Time</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.tasks &&
                                      JSON.parse(item.tasks).map(
                                        (task, taskIndex) => (
                                          <tr key={taskIndex}>
                                            <td>{task.task}</td>
                                            <td>
                                              {task.created_at.slice(8, 10)}/
                                              {task.created_at.slice(5, 7)}/
                                              {task.created_at.slice(0, 4)}
                                            </td>
                                            <td>{task.status}</td>
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

export default ManagerParticularEmployeeReport;
