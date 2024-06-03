import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { getEmployeeReport, CONFIG_OBJ } from "../Config";
import { Input, DatePicker, Button,Flex, Progress } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { faFilePdf, faFileExcel} from '@fortawesome/free-regular-svg-icons';
import {faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, Link } from "react-router-dom";
const { Search } = Input;
const { RangePicker } = DatePicker;


const EmployeeReport = () => {
  // for search by date
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

  const handleSearchByDateRange = () => {
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

  const user_id = sessionStorage.getItem("id");
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [reportData, setReportData] = useState([]);

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
      let url = `${getEmployeeReport}/${user_id}?page=${page}&pageSize=${pageSize}&name=${search}`;
      if (formattedFromDate && formattedToDate) {
        url += `&fromDate=${formattedFromDate}&toDate=${formattedToDate}`;
      }

      const response = await axios.get(url, CONFIG_OBJ);
      setReportData(response.data);
      const tasksArray = JSON.parse(response.data[3].tasks);
      setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize));
      // Rest of the function...
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
  if (expandedRows.length === reportData.length) {
    setExpandedRows([]);
    setExpandedRow(null);
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
  //   console.log(wb)
  //   XLSX.writeFile(wb, 'employee_reportPW.xlsx');
  // };
 
  const exportToExcel = () => {
    const htmlTable = document.getElementById('reportTablepw');
    const wb = XLSX.utils.table_to_book(htmlTable);
    const ws = wb.Sheets[wb.SheetNames[0]];

    // Remove unwanted rows
    const rows = ws['!ref'].split(':');
    const start = XLSX.utils.decode_cell(rows[0]);
    const end = XLSX.utils.decode_cell(rows[1]);
    let newEnd = { ...end }; // Initialize newEnd

    for (let rowNum = start.r; rowNum <= end.r; rowNum++) {
        const cell = ws[XLSX.utils.encode_cell({ r: rowNum, c: start.c })];
        if (cell && cell.t === 's' && cell.v.startsWith('S. No.Module NameTaskStart DateEnd DateStatus% CompletionAlloc hrsActual hrs')) {
            for (let i = start.c; i <= end.c; i++) {
                delete ws[XLSX.utils.encode_cell({ r: rowNum, c: i })];
            }
            newEnd.r--; // Decrease row count for each removed row
        }
    }

    // Update the range
    ws['!ref'] = XLSX.utils.encode_range(start, newEnd);

    XLSX.writeFile(wb, 'employee_reportPW.xlsx');
};


const handleExpandRowClick = (index) => {
  // Redirect to another page with the index of the expanded row
  return `/expanded-row/${index}`;
};

  
  // to pdf file function
  const exportToPDF = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'landscape'; // 'portrait' or 'landscape'

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);
    const title = 'Employee Report Project-Wise';
    const headers = [['S.No.', 'Project Name', 'Schd. Start Date', 'Schd. End Date', 'Alloc hrs', 'Man hrs']];

    let data = [];
    reportData.forEach((item, index) => {
      const row = [
        index + 1,
        item.project_name,
        `${item.schedule_start_date.slice(8, 10)}/${item.schedule_start_date.slice(5, 7)}/${item.schedule_start_date.slice(0, 4)}`,
        `${item.schedule_end_date.slice(8, 10)}/${item.schedule_end_date.slice(5, 7)}/${item.schedule_end_date.slice(0, 4)}`,
        item.total_allocated_hours,
        item.total_actual_hours,
        '', // Placeholder for tasks
      ];
      data.push(row);
      if(expandedRows.includes(index) || expandedRow === index) {
        const taskheaders = [['S. No.', 'Module Name','Task', 'Date', 'status', 'Alloc hrs', 'Man hrs']];
        data.push(taskheaders[0]); // Include task headers
        JSON.parse(item.tasks).forEach(task => {
          // const taskheaders = [['Task', 'Date', 'status', 'Alloc hrs', 'Man hrs']];
          const taskRow = [
           
            task.task, // Task
            `${task.created_at.slice(8, 10)}/${task.created_at.slice(5, 7)}/${task.created_at.slice(0, 4)}`,
            task.status,
            task.allocated_time,
            task.actual_time
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
    doc.save('employee_reportPW.pdf');
  };

const[moduleEfficiencySums, setModuleEfficiencySums] = useState([]);
 
const calculateAverageEfficiency = (modules) => {
  if (!modules || modules.length === 0) return 0;

  const totalEfficiency = modules.reduce((sum, module) => {
    if (!module.tasks || module.tasks.length === 0) return sum;
    return sum + module.tasks.reduce((moduleSum, task) => moduleSum + (task.per_task_efficiency || 0), 0);
  }, 0);

  const totalTasks = modules.reduce((sum, module) => sum + (module.tasks ? module.tasks.length : 0), 0);

  // return totalEfficiency / totalTasks;
  const averageEfficiency = totalTasks !== 0 ? (totalEfficiency / totalTasks).toFixed(2) : 0;

  return parseFloat(averageEfficiency);
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
                      project name
                    </label>

                    <Search
                      placeholder="search by project name"
                      allowClear

                      style={{
                        width: 200,
                      }}
                      value={search} onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className='d-flex align-items-center justify-content-end me-3'>
                    <div className="col-sm-4 col-md-3 col-lg-4 ">
                      <div className="mb-3">
                        <label className="text-capitalize textcolumntitle fw-bold text-info">
                          From Start Date
                        </label>
                        <DatePicker
                          onChange={handleFromDateChange}
                          placeholder="From Date"
                          style={{ width: "100%" }}
                          className="rounded-2"
                          format={dateFormat}
                          showTime={false}
                        />
                      </div>
                    </div>


                    <div className="col-sm-4 col-md-3 col-lg-4">
                      <div className="mb-3">
                        <label className="text-capitalize textcolumntitle fw-bold text-info">
                          To Start Date
                        </label>
                        <DatePicker
                          onChange={handleToDateChange}
                          placeholder="To Date"
                          style={{ width: "100%" }}
                          className="rounded-2"
                          format={dateFormat}
                          showTime={false}
                        />
                      </div>
                    </div>
                    <div className="col-sm-4 col-md-1 col-lg-1 ">
                      <Button
                        className="py-1 px-2 mt-3 btn btn-info btn-sm rounded-2"
                        onClick={handleSearchByDateRange}
                      >
                        Search
                      </Button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
            <div className="row d-flex justify-content-end">
              <div className="col-2">
                <div className=" d-flex gap-3 align-items-center">
                <Button onClick={handleExpandAll} className="text-info">{!expandedRows || expandedRows.length < reportData.length ? 'Expand' : 'Collapse'}</Button>
                 <FontAwesomeIcon icon={faFileExcel} size="xl" style={{ color: "#74C0FC", }} onClick={handleExcel} />
                  <FontAwesomeIcon icon={faFilePdf} style={{ color: "#ee445e", }} size="xl" onClick={exportToPDF} />
                  
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-11 mx-auto">
                {/* table */}
                <table id="reportTablepw" className="table table-striped mt-3">
                  <thead className="sticky-top">
                    <tr>
                      <th scope="col">S.No.</th>
                      <th scope="col">Project Name</th>
                      <th scope="col">Schd. Start Date</th>
                      <th scope="col">Schd. End Date</th>

                      <th scope="col">Alloc hrs</th>
                      <th scope="col">Man hrs</th>
                      
                      <th scope="col">My Efficiency (%)</th>
                    </tr>
                  </thead>

                  <tbody className="table-group-divider">
                    {reportData &&
                      reportData.map((item, index) => (
                       
                        <React.Fragment key={item.user_id}>
                          <tr style={{ cursor: "pointer" }} onClick={() => handleRowClick(index)}>
                            <th scope="row">{index + 1}</th>
                            <td className="text-capitalize">
                            <NavLink
                              to={`/projectplan/?project_id=${item.project_id}`}
                              className="text-decoration-underline"
                            >
                              {item.project_name}

                            </NavLink>&nbsp; &nbsp; <Link to={handleExpandRowClick(index)}>
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    size="xs"
                    // Add any additional onClick logic if needed
                  />
                </Link>
                            </td>
                            <td>
                              {item.schedule_start_date.slice(8, 10)}/
                              {item.schedule_start_date.slice(5, 7)}/
                              {item.schedule_start_date.slice(0, 4)}
                            </td>
                            <td>
                              {item.schedule_end_date.slice(8, 10)}/
                              {item.schedule_end_date.slice(5, 7)}/
                              {item.schedule_end_date.slice(0, 4)}
                            </td>

                            <td>{item.total_allocated_hours}</td>
                            <td>{item.total_actual_hours}</td>
                            <td>
                  {item.modules && calculateAverageEfficiency(item.modules)}
                </td>
                          </tr>
                          {(expandedRows.includes(index) || expandedRow === index) &&   (
                            <tr >
                              <td colSpan="12">
                                <table className="col-11 mx-auto ">
                                  <thead>
                                    <tr>
                                      <th>S. No.</th>
                                      <th>Module Name</th>
                                      <th>Task</th>
                                      {/* <th>Start Date</th>
                                      <th>End Date</th> */}
                                      <th className="text-sm d-flex flex-column">
  Start Date
  <span>End Date</span>
</th>
<th>Alloc hrs</th>
                                      <th>Actual hrs</th>
                                      <th>% Completion</th>
                                      <th>Status</th>
                                      <th>Alloc hrs/Act hrs (%)</th>
                                      {/* <th>per task</th> */}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.modules &&
                                      (item.modules).map(
                                        (module, moduleIndex) => (
                                          <React.Fragment key={moduleIndex}>
                                          <tr className="module-row">
                                            <td className="text-primary" style={{cursor:"default"}}>{index+1}.{moduleIndex+1}</td>
                                            <td className="text-capitalize text-primary" colSpan="8" style={{cursor:"default"}} >{module.module_name}</td>
                                          </tr>
                                            {module.tasks && ((module.tasks).map(
                                              (task, taskIndex) => (
                                              
                                                <tr key={taskIndex} className="task-row">
                                                  <td></td>
                                                  <td>{index+1}.{moduleIndex+1} {String.fromCharCode(97 + taskIndex)}</td>
                                                  {/* <td></td> */}
                                                  <td className="text-capitalize">{task.task_name}</td>
                                                  {/* <td>
                                                    {task.created_at.slice(8, 10)}/
                                                    {task.created_at.slice(5, 7)}/
                                                    {task.created_at.slice(0, 4)}
                                                  </td>
                                                  { task.updated_at ?<td>
                                                    {task.updated_at?.slice(8, 10)}/
                                                    {task.updated_at?.slice(5, 7)}/
                                                    {task.updated_at?.slice(0, 4)}
                                                  </td> : <td className=" text-primary">---</td>} */}
                                                  <td className="text-sm d-flex flex-column">
  <span>
    {task.created_at.slice(8, 10)}/
    {task.created_at.slice(5, 7)}/
    {task.created_at.slice(0, 4)}
  </span>
  {task.updated_at ? (
    <span>
      {task.updated_at.slice(8, 10)}/
      {task.updated_at.slice(5, 7)}/
      {task.updated_at.slice(0, 4)}
    </span>
  ) : (
    <td className="text-primary">---</td>
  )}
</td>
<td>{task.employee_allocated_time}</td>
                                                  <td>{task.employee_actual_time}</td>
                                              {/* <td>{task.status}</td> */}
                                                  {/* <td>{task.task_percent}</td> */}
                                                  <Progress
      percent={task.task_percent}
      status={task.task_percent === 100 ? "" : "active"}  
      strokeColor={{
        from: "#108ee9",
        to: "#87d068",
      }}
    />
             <td className="text-capitalize" style={{ color: task.status === 'inprocess' ? 'orange' : task.status === 'notstarted' ? 'red' : task.status === 'transfer' ? 'blue' : 'green' }}>{task.status==="transfer" ? "Transfered":task.status}</td> 
                                    
                                                  <td>{((task.employee_allocated_time/task.employee_actual_time)*100).toFixed(2)}</td>
                                                  {/* <td>{!task.per_task_efficiency ? "---": task.per_task_efficiency}</td> */}
                                                </tr>
                                              )
                                            ))}
                                           {/* <td>
                  {module.tasks.reduce((sum, task) => sum + (task.per_task_efficiency || 0), 0)}
                </td> */}
                                           </React.Fragment>
                                        ))}
                                   
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
                          className={`page-item ${currentPage === index + 1 ? "active" : ""
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

export default EmployeeReport;
