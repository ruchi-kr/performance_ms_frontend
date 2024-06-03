import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { getEmployeeReportDW, CONFIG_OBJ } from "../Config";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { faFilePdf, faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker, Button,Progress } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const EmployeeReportDateWise = () => {
  const user_id = sessionStorage.getItem("id");
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [reportData, setReportData] = useState([]);

  // for date range search
  const dateFormat = "DD/MM/YYYY";
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleFromDateChange = (date) => {
    setFromDate(date);
    if (date === null) {
      handleDateClear();
    }
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    if (date === null) {
      handleDateClear();
    }
  };

  const handleSearchByDateRange = (value) => {
    console.log(value);
    const currentDate = moment();
    if (fromDate && fromDate.isAfter(currentDate)) {
      toast.error("From date cannot be a future date");
    } else if (toDate && toDate.isAfter(currentDate)) {
      toast.error("To date cannot be a future date");
    } else if (fromDate && toDate && fromDate.isAfter(toDate)) {
      toast.error("From date cannot be greater than to date");
    } else {
      const formattedFromDate = fromDate ? fromDate.format("YYYY-MM-DD") : null;
      const formattedToDate = toDate ? toDate.format("YYYY-MM-DD") : null;

      getEmployeeReportHandler(currentPage, formattedFromDate, formattedToDate);
    }
  };
  const handleDateClear = () => {
    console.log("got called on clear");

    getEmployeeReportHandler(currentPage);
  };
  const getEmployeeReportHandler = async (
    page,
    formattedFromDate,
    formattedToDate
  ) => {
    try {
      let url = `${getEmployeeReportDW}/${user_id}?page=${page}&pageSize=${pageSize}`;
      if (formattedFromDate && formattedToDate) {
        url += `&fromDate=${formattedFromDate}&toDate=${formattedToDate}`;
      }

      const response = await axios.get(url, CONFIG_OBJ);

      setReportData(response.data);
      console.log("report data", response.data);
      setTotalPages(Math.ceil(response.headers["x-total-count"] / pageSize));
      //   const totalCount = parseInt(response.headers['x-total-count']);
      // const totalPages = Math.ceil(totalCount / pageSize);
      // setTotalPages(totalPages);
      console.log("total pages after math ceil", totalPages);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    console.log("total pages after math", totalPages);
  }, [totalPages]);
  useEffect(() => {
    getEmployeeReportHandler(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber == 0 ? 1 : pageNumber);
    getEmployeeReportHandler(pageNumber == 0 ? 1 : pageNumber);
  };

  const exportToExcel = () => {
    const htmlTable = document.getElementById("reportTable");
    const wb = XLSX.utils.table_to_book(htmlTable);
    XLSX.writeFile(wb, "employee_reportDW.xlsx");
  };

  const exportToPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // 'portrait' or 'landscape'

    const marginLeft = 30;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);
    const title = "Employee Report Date-Wise";

    const table = document.getElementById("reportTable");

    // Extract headers and data from the table
   const headers = [
      ['S.No.', 'Date', '', '', '', '','','',''],
      ['', '', 'Project Name', '', '', '','','',''],
      ['', '', '','Module Name', '', '', '','',''],
      ['', '', '','','Task','Alloc hrs', 'Act hrs', '% Completion' ,'Status'],
    ];
    const data = [];
    const rows = table.querySelectorAll("tr");
    const cells = table.querySelectorAll("th");

    // Extract data
    rows.forEach((row, index) => {
      if (index > 2) {
        // Skip the first three row (table header)
        const rowData = [];
        const cells = row.querySelectorAll("td");
        cells.forEach((cell) => {
          const content = cell.textContent.trim();
          rowData.push(content);
        });
        data.push(rowData);
      }
    });
    const content = {
      startY: 70,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 30);
    doc.autoTable(content);
    doc.save("employee_reportDW.pdf");
  };

  const memoizedProjectNames = useMemo(() => {
    const names = [];
    reportData.forEach((report) => {
      report.projects.forEach((project) => {
        if (!names.includes(project.project_name)) {
          names.push(project.project_name);
        }
      });
    });
    return names;
  }, [reportData]);
  

  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            <div className="row mt-5">
              <div className="col-11 mx-auto">
                <h3 className="text-primary">Employee Daily Task Report</h3>
                <hr className="bg-primary border-4" />
              </div>
            </div>
            <div className="row d-flex align-items-center mx-5">
              <div className="col-sm-4 col-md-3 col-lg-2">
                <div className="mb-3">
                  <label className="text-capitalize textcolumntitle  fw-bold">
                    From Date
                  </label>
                  <DatePicker
                    onChange={handleFromDateChange}
                    placeholder="From Date"
                    style={{ width: "100%" }}
                    className="rounded-2"
                    format={dateFormat}
                    showTime={false}
                    allowClear
                    onClear={handleDateClear}
                    defaultValue={dayjs().subtract(30, "day")}
                  />
                </div>
              </div>
              <div className="col-sm-4 col-md-3 col-lg-2">
                <div className="mb-3">
                  <label className="text-capitalize textcolumntitle  fw-bold">
                    To Date
                  </label>
                  <DatePicker
                    onChange={handleToDateChange}
                    placeholder="To Date"
                    style={{ width: "100%" }}
                    className="rounded-2"
                    format={dateFormat}
                    showTime={false}
                    allowClear
                    onClear={handleDateClear}
                    defaultValue={ dayjs()}
                  />
                </div>
              </div>
              <div className="col-sm-4 col-md-1 col-lg-2">
                <Button
                  className="py-1 px-2 mt-3 btn btn-info btn-sm rounded-2"
                  onClick={handleSearchByDateRange}
                >
                  Search
                </Button>
              </div>
            </div>
            <div className="row d-flex justify-content-end">
              <div className="col-1 me-2">
                <div className="mb-2 d-flex gap-3">
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
            <div className="row">
              <div className="col-11 mx-auto">
                <table id="reportTable" className="table table-bordered ">
                  <thead
                    className="sticky-top border border-dark"
                    style={{ zIndex: "10" }}
                  >
                    <tr>
                      <th rowSpan={4}>S.No.</th>
                      <th rowSpan={4}>Date</th>
                      {/* <th colSpan={7}>Activities</th> Spanning 5 columns */}
                    </tr>
                    <tr>
                      <th colSpan={7} className="text-primary">
                        Project Name
                      </th>{" "}
                      {/* Spanning 5 columns */}
                    </tr>
                    <tr>
                      <th></th>
                      <th colSpan={7} className="text-success">
                        Module Name
                      </th>{" "}
                      {/* Spanning 5 columns */}
                    </tr>
                    <tr>
                      <th></th>
                      <th></th>
                      <th>Task</th>
                      <th>Alloc hrs</th>
                      <th>Act hrs</th>
                      <th>% Completion</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                

<tbody>
  {reportData.map((report, index) => {
    const projects = report.projects;
    const date = report.date.slice(8, 10) + '/' + report.date.slice(5, 7) + '/' + report.date.slice(0, 4);

    console.log("stored date", date);
    let previousProjectName = null;
    let previousModuleName = null;

    return (
      <React.Fragment key={index}>
        <tr className="">
          <td>{index + 1}</td>
          <td>{date}</td>
          <td colSpan={6} className="">
            <p className='text-capitalize'>
              Task Completion Rate - {report.task_completion_rate}%
            </p>
          </td>
        </tr>
        {projects.map((project, projectIndex) => {
          const currentProjectName = project.project_name;
          const isSameProject = currentProjectName === previousProjectName;
          if (!isSameProject) {
            previousProjectName = currentProjectName; // Update previous project name
            return (
              <React.Fragment key={projectIndex}>
                <tr>
                  <td></td>
                  <td></td>
                  <td colSpan={7}>
                    <b className='text-primary text-capitalize'>
                      {currentProjectName}
                    </b>
                  </td>
                </tr>
                {project.modules.map((module, moduleIndex) => {
                  const currentModuleName = module.module_name;
                  const isSameModule = currentModuleName === previousModuleName;
                  if (!isSameModule) {
                    previousModuleName = currentModuleName; // Update previous module name
                    return (
                      <React.Fragment key={`${index}-${projectIndex}-${moduleIndex}`}>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td colSpan={6} className='text-capitalize text-success'>{currentModuleName}</td>                          
                        </tr>
                        {module.tasks.map((task, taskIndex) => (
                          <tr key={`${index}-${projectIndex}-${moduleIndex}-${taskIndex}`}>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="text-capitalize">{task.task_name}</td>
                            <td>{task.employee_allocated_time}</td>
                            <td>{task.employee_actual_time}</td>
                            <td><Progress
      percent={task.task_percent}
      status={task.task_percent === 100 ? "" : "active"}  
      strokeColor={{
        from: "#108ee9",
        to: "#87d068",
      }}
    /></td>
                                                  <td className="text-capitalize" style={{ color: task.status === 'inprocess' ? 'orange' : task.status === 'notstarted' ? 'red' : task.status === 'transfer' ? 'blue' : 'green' }}>{task.status==="transfer" ? "Transfered":task.status}</td> 
      
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  }
                  return module.tasks.map((task, taskIndex) => (
                    <tr key={`${index}-${projectIndex}-${moduleIndex}-${taskIndex}`}>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-capitalize">{task.task_name}</td>
                      <td>{task.employee_allocated_time}</td>
                            <td>{task.employee_actual_time}</td>
                            <td><Progress
      percent={task.task_percent}
      status={task.task_percent === 100 ? "" : "active"}  
      strokeColor={{
        from: "#108ee9",
        to: "#87d068",
      }}
    /></td>
                                                  <td className="text-capitalize" style={{ color: task.status === 'inprocess' ? 'orange' : task.status === 'notstarted' ? 'red' : task.status === 'transfer' ? 'blue' : 'green' }}>{task.status==="transfer" ? "Transfered":task.status}</td> 
      
                    </tr>
                  ));
                })}
              </React.Fragment>
            );
          }
          // Return modules directly if it's the same project
          return project.modules.map((module, moduleIndex) => {
            const currentModuleName = module.module_name;
            const isSameModule = currentModuleName === previousModuleName;
            if (!isSameModule) {
              previousModuleName = currentModuleName; // Update previous module name
              return (
                <React.Fragment key={`${index}-${projectIndex}-${moduleIndex}`}>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colSpan={6} className='text-capitalize text-success'>{module.module_name}</td>                          
                  </tr>
                  {module.tasks.map((task, taskIndex) => (
                    <tr key={`${index}-${projectIndex}-${moduleIndex}-${taskIndex}`}>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-capitalize">{task.task_name}</td>
                      <td>{task.employee_allocated_time}</td>
                            <td>{task.employee_actual_time}</td>
                            <td><Progress
      percent={task.task_percent}
      status={task.task_percent === 100 ? "" : "active"}  
      strokeColor={{
        from: "#108ee9",
        to: "#87d068",
      }}
    /></td>
                                                  <td className="text-capitalize" style={{ color: task.status === 'inprocess' ? 'orange' : task.status === 'notstarted' ? 'red' : task.status === 'transfer' ? 'blue' : 'green' }}>{task.status==="transfer" ? "Transfered":task.status}</td> 
      
                    </tr>
                  ))}
                </React.Fragment>
              );
            }
            // Return tasks directly if it's the same module
            return module.tasks.map((task, taskIndex) => (
              <tr key={`${index}-${projectIndex}-${moduleIndex}-${taskIndex}`}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-capitalize">{task.task_name}</td>
                <td>{task.employee_allocated_time}</td>
                            <td>{task.employee_actual_time}</td>
                            <td><Progress
      percent={task.task_percent}
      status={task.task_percent === 100 ? "" : "active"}  
      strokeColor={{
        from: "#108ee9",
        to: "#87d068",
      }}
    /></td>
                                                  <td className="text-capitalize" style={{ color: task.status === 'inprocess' ? 'orange' : task.status === 'notstarted' ? 'red' : task.status === 'transfer' ? 'blue' : 'green' }}>{task.status==="transfer" ? "Transfered":task.status}</td> 
      
              </tr>
            ));
          });
        })}
      </React.Fragment>
    );
  })}
</tbody>


                </table>
                {/* PAGINATION */}
                {/* <div className="row float-right">
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
                          <span aria-hidden="true">« Previous</span>
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
                          <span aria-hidden="true">Next »</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                  {totalPages <= currentPage ? (
                    <>
                      <p className="text-info">No records</p>
                    </>
                  ) : (
                    <></>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmployeeReportDateWise;
