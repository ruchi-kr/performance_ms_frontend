import React, { useEffect, useState } from "react";
import axios from "axios";
import { getEmployeeReport, CONFIG_OBJ } from "../Config";
import { Input, DatePicker, Button, Flex, Progress } from "antd";
import { faFilePdf, faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { faArrowUpRightFromSquare,faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, Link, useParams } from "react-router-dom";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from "moment";
import { toast } from "react-toastify";
const EmployeeReportPwBifur = () => {
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
      setTotalPages(Math.ceil(response.headers["x-total-count"] / pageSize));
      // Rest of the function...
    } catch (err) {
      console.log(err);
    }
  };

  const calculateAverageEfficiency = (modules) => {
    if (!modules || modules.length === 0) return 0;

    const totalEfficiency = modules.reduce((sum, module) => {
      if (!module.tasks || module.tasks.length === 0) return sum;
      return (
        sum +
        module.tasks.reduce(
          (moduleSum, task) => moduleSum + (task.per_task_efficiency || 0),
          0
        )
      );
    }, 0);

    const totalTasks = modules.reduce(
      (sum, module) => sum + (module.tasks ? module.tasks.length : 0),
      0
    );

    // return totalEfficiency / totalTasks;
    const averageEfficiency =
      totalTasks !== 0 ? (totalEfficiency / totalTasks).toFixed(2) : 0;

    return parseFloat(averageEfficiency);
  };

  useEffect(() => {
    getEmployeeReportHandler(currentPage);
  }, [currentPage, search]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber == 0 ? 1 : pageNumber);
    getEmployeeReportHandler(pageNumber == 0 ? 1 : pageNumber);
  };

  const { expandedRowIndex } = useParams();
  console.log("expandedRowIndex", expandedRowIndex);
  const [expandedRows, setExpandedRows] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    // Add the expanded row index to the state
    setExpandedRows((prevExpandedRows) => [
      ...prevExpandedRows,
      expandedRowIndex,
    ]);
  }, [expandedRowIndex]);


  const handleExcel = () => {
   
    // handleExpandAll();
    exportToExcel();
    
  };
  
   
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
  
  
    const exportToPDF = () => {
        const unit = 'pt';
        const size = 'A4'; // Use A1, A2, A3 or A4
        const orientation = 'landscape'; // 'portrait' or 'landscape'    
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
      
        doc.setFontSize(10);
        const title = 'Employee Report Project-Wise';
        const headers = [
          ['S.No.', 'Project Name', 'Schd.Start Date', 'Schd.End Date', 'Alloc hrs', 'Man hrs','My Efficiency (%)','---------','-----------'],         
        ];
           
        let data = [];
        reportData.forEach((item, index) => {
          if (index == expandedRowIndex) {
            const row = [
              index + 1,
              item.project_name,
              `${item.schedule_start_date.slice(8, 10)}/${item.schedule_start_date.slice(5, 7)}/${item.schedule_start_date.slice(0, 4)}`,
              `${item.schedule_end_date.slice(8, 10)}/${item.schedule_end_date.slice(5, 7)}/${item.schedule_end_date.slice(0, 4)}`,
              item.total_allocated_hours,
              item.total_actual_hours,
              `${item.modules && calculateAverageEfficiency(item.modules)}`,
            //   '','',
            ];
            data.push(row);
          }
      
          if (index == expandedRowIndex && (expandedRows.includes(expandedRowIndex) || expandedRow == expandedRowIndex)) {
            const taskheaders = [['S. No.', 'Module Name','Task', 'Start Date', 'End Date', 'status','%Completion', 'Alloc hrs', 'Act hrs']];
           
            data.push(taskheaders[0]); // Include task headers
            item.modules.forEach((module, moduleIndex) => {
                if (index == expandedRowIndex) {
              const moduleRow = [
                index + 1 + '. ' + (moduleIndex + 1),
                module.module_name,
                '', // Placeholder for tasks
                '', // Placeholder for start date
                '', // Placeholder for end date
                '', // Placeholder for status
                '', // Placeholder for alloc hrs
                '','', // Placeholder for man hrs
              ];
              data.push(moduleRow);
            }
              module.tasks.forEach((task, taskIndex) => {
                if (index == expandedRowIndex) {
                    const taskRow = [
                        '', // Empty cell for module row
                        `${index+1}.${moduleIndex+1} ${String.fromCharCode(97 + taskIndex)}`, // Empty cell for module name
                        task.task_name,
                        `${task.created_at.slice(8, 10)}/${task.created_at.slice(5, 7)}/${task.created_at.slice(0, 4)}`,
                        task.updated_at ? `${task.updated_at.slice(8, 10)}/${task.updated_at.slice(5, 7)}/${task.updated_at.slice(0, 4)}` : '---',
                        task.status === 'transfer' ? 'Transfered' : task.status,
                        task.task_percent,
                        task.employee_allocated_time,
                        task.employee_actual_time,
                      ];
                      data.push(taskRow); 
                }
              
              });
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

        // doc.autoTable(content, {
        //     didDrawCell: (data) => {
        //         if ( data.section =='body' && data.row.index == 1) {
        //             data.cell.styles.textColor = 0; // Blue color
        //         }
        //     }
        // });
    
        doc.save('employee_reportPW.pdf');
      };

  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            <div className="row mt-5 d-flex justify-content-end mx-4">
              <div className="col-6 me-4">
                <div className="d-flex align-items-center justify-content-end">
                  <div className="col-sm-4 col-md-3 col-lg-3">
                    <div className="mb-3">
                      <label className="text-capitalize textcolumntitle fw-bold text-info">
                        From Date
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

                  <div className="col-sm-4 col-md-3 col-lg-3">
                    <div className="mb-3">
                      <label className="text-capitalize textcolumntitle fw-bold text-info">
                        To Date
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
            <div className="row d-flex justify-content-between align-items-center ">
                <div className="col-2 mx-5">
                <Link to="/reportproject-wise"><FontAwesomeIcon icon={faArrowLeft} />&nbsp;Back</Link> 
                </div>
              <div className="col-2">
                <div className=" d-flex gap-3 align-items-center">
                 <FontAwesomeIcon icon={faFileExcel} size="xl" style={{ color: "#74C0FC", }} onClick={handleExcel} />
                  <FontAwesomeIcon icon={faFilePdf} style={{ color: "#ee445e", }} size="xl" onClick={exportToPDF} />                
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-11 mx-auto">
                <table id="reportTablepw" className="table table-striped my-4">
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
                          {index == expandedRowIndex && (
                            <tr>
                              <th scope="row">{index + 1}</th>
                              <td className="text-capitalize">
                                <NavLink
                                  to={`/projectplan/?project_id=${item.project_id}`}
                                  className="text-decoration-underline"
                                >
                                  {item.project_name}
                                </NavLink>
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
                                {item.modules &&
                                  calculateAverageEfficiency(item.modules)}
                              </td>
                            </tr>
                          )}
                          {index == expandedRowIndex &&
                            (expandedRows.includes(expandedRowIndex) ||
                              expandedRow == expandedRowIndex) && (
                              <tr>
                                <td colSpan="12">
                                  <table className="col-11 mx-auto ">
                                    <thead>
                                      <tr>
                                        <th>S. No.</th>
                                        <th>Module Name</th>
                                        <th>Task</th>

                                        <th className="text-sm d-flex flex-column">
                                          Start Date
                                          <span>End Date</span>
                                        </th>
                                        <th>Status</th>
                                        <th>% Completion</th>
                                        <th>Alloc hrs</th>
                                        <th>Actual hrs</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {item.modules &&
                                        item.modules.map(
                                          (module, moduleIndex) => {
                                            if (index == expandedRowIndex) {
                                              return (
                                                <React.Fragment
                                                  key={moduleIndex}
                                                >
                                                  <tr className="module-row">
                                                    <td className="text-primary">
                                                      {index + 1}.
                                                      {moduleIndex + 1}
                                                    </td>
                                                    <td
                                                      className="text-capitalize text-primary"
                                                      colSpan="7"
                                                    >
                                                      {module.module_name}
                                                    </td>
                                                  </tr>
                                                  {module.tasks &&
                                                    module.tasks.map(
                                                      (task, taskIndex) => (
                                                        <tr
                                                          key={taskIndex}
                                                          className="task-row"
                                                        >
                                                          <td></td>
                                                          <td>
                                                            {index + 1}.
                                                            {moduleIndex + 1}{" "}
                                                            {String.fromCharCode(
                                                              97 + taskIndex
                                                            )}
                                                          </td>
                                                          {/* <td></td> */}
                                                          <td className="text-capitalize">
                                                            {task.task_name}
                                                          </td>

                                                          <td className="text-sm d-flex flex-column">
                                                            <span>
                                                              {task.created_at.slice(
                                                                8,
                                                                10
                                                              )}
                                                              /
                                                              {task.created_at.slice(
                                                                5,
                                                                7
                                                              )}
                                                              /
                                                              {task.created_at.slice(
                                                                0,
                                                                4
                                                              )}
                                                            </span>
                                                            {task.updated_at ? (
                                                              <span>
                                                                {task.updated_at.slice(
                                                                  8,
                                                                  10
                                                                )}
                                                                /
                                                                {task.updated_at.slice(
                                                                  5,
                                                                  7
                                                                )}
                                                                /
                                                                {task.updated_at.slice(
                                                                  0,
                                                                  4
                                                                )}
                                                              </span>
                                                            ) : (
                                                              <td className="text-primary">
                                                                ---
                                                              </td>
                                                            )}
                                                          </td>
                                                          <td
                                                            className="text-capitalize"
                                                            style={{
                                                              color:
                                                                task.status ===
                                                                "inprocess"
                                                                  ? "orange"
                                                                  : task.status ===
                                                                    "notstarted"
                                                                  ? "red"
                                                                  : task.status ===
                                                                    "transfer"
                                                                  ? "blue"
                                                                  : "green",
                                                            }}
                                                          >
                                                            {task.status ===
                                                            "transfer"
                                                              ? "Transfered"
                                                              : task.status}
                                                          </td>

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
                                                          <td>
                                                            {
                                                              task.employee_allocated_time
                                                            }
                                                          </td>
                                                          <td>
                                                            {
                                                              task.employee_actual_time
                                                            }
                                                          </td>
                                                        </tr>
                                                      )
                                                    )}
                                                </React.Fragment>
                                              );
                                            } else {
                                              return null;
                                            }
                                          }
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmployeeReportPwBifur;
