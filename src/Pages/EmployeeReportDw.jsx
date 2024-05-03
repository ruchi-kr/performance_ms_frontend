import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getEmployeeReportDW } from '../Config';
import SideNavbar from '../Components/SideNavbar';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { faFilePdf, faFileExcel } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DatePicker, Button } from "antd";
import moment from "moment";
import { toast } from "react-toastify";

const EmployeeReportDateWise = () => {
  const user_id = sessionStorage.getItem('id');
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
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
  const getEmployeeReportHandler = async (page, formattedFromDate, formattedToDate) => {
    try {
      let url = `${getEmployeeReportDW}/${user_id}?page=${page}&pageSize=${pageSize}`;
      if (formattedFromDate && formattedToDate) {
        url += `&fromDate=${formattedFromDate}&toDate=${formattedToDate}`;
      }

      const response = await axios.get(url);

      setReportData(response.data);
      console.log('report data', response.data);
      setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getEmployeeReportHandler(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber == 0 ? 1 : pageNumber);
    getEmployeeReportHandler(pageNumber == 0 ? 1 : pageNumber);
  };

  const exportToExcel = () => {
    const htmlTable = document.getElementById('reportTable');
    const wb = XLSX.utils.table_to_book(htmlTable);
    XLSX.writeFile(wb, 'employee_reportDW.xlsx');
  };

  const exportToPDF = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'landscape'; // 'portrait' or 'landscape'

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);
    const title = 'Employee Report Date-Wise';

    const table = document.getElementById('reportTable');

    // Extract headers and data from the table
    const headers = [
      ['S.No.', 'Date', 'Activities', '', '', ''],
      ['', '', 'Project Name', '', '', ''],
      ['', '', 'Task', 'Status', 'Alloc hrs', 'Act hrs'],
    ];
    const data = [];
    const rows = table.querySelectorAll('tr');
    const cells = table.querySelectorAll('th');

     // Extract data
  rows.forEach((row, index) => {
    if (index > 2) { // Skip the first three row (table header)
      const rowData = [];
      const cells = row.querySelectorAll('td');
      cells.forEach((cell) => {
        const content = cell.textContent.trim();
        rowData.push(content);
      });
      data.push(rowData);
    }
  });
    const content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save('employee_reportDW.pdf');
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
                <h3 className='text-primary'>Date-wise Reports</h3>
                <hr className='bg-primary border-4' />
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
                  <FontAwesomeIcon icon={faFileExcel} size="xl" style={{ color: "#74C0FC", }} onClick={exportToExcel} />
                  <FontAwesomeIcon icon={faFilePdf} style={{ color: "#ee445e", }} size="xl" onClick={exportToPDF} />
                </div>
              </div>

            </div>
            <div className="row">
              <div className="col-11 mx-auto">
                <table id='reportTable' className="table table-bordered" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th rowSpan={3}>S.No.</th>
                      <th rowSpan={3}>Date</th>

                      <th colSpan={5}>Activities</th> {/* Spanning 5 columns */}
                    </tr>
                    <tr>

                      <th colSpan={5}>Project Name</th> {/* Spanning 5 columns */}
                    </tr>
                    <tr>

                      <th>Task</th>
                      <th>Status</th>
                      <th>Alloc hrs</th>
                      <th>Act hrs</th>
                    </tr>
                  </thead>


                  <tbody>
                    {reportData.map((report, index) => {
                      const projects = JSON.parse(report.projects);
                      const firstProject = projects[0];
                      const lastProject = projects[projects.length - 1];
                      const date = report.date.slice(8, 10) + '/' + report.date.slice(5, 7) + '/' + report.date.slice(0, 4);


                      console.log("stored date", date)
                      return (
                        <React.Fragment key={index}>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{date}</td>
                            <td colSpan={5}>
                              <b className='text-primary text-capitalize'>{firstProject.project_name}</b>
                            </td>
                          </tr>
                          {projects.map((project, projectIndex) => (
                            <React.Fragment key={projectIndex}>
                              {projectIndex === 0 || project.date != lastProject.date ? null : (
                                <tr>
                                  <td></td>
                                  <td></td>
                                  <td colSpan={5}>
                                    <b className='text-primary text-capitalize'>{project.project_name}</b>
                                  </td>
                                </tr>
                              )}
                              {JSON.parse(project.tasks).map((task, taskIndex) => (
                                <tr key={`${index}-${projectIndex}-${taskIndex}`}>
                                  <td></td>
                                  <td></td>
                                  <td>{task.task}</td>
                                  {/* <td>{task.status}</td> */}
                                  <td style={task.status === 'inprocess' ? { color: 'orange' } : { color: 'green' }}>{task.status}</td>
                                  <td>{task.allocated_time}</td>
                                  <td>{task.actual_time}</td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>

                </table>
                {/* PAGINATION */}
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

export default EmployeeReportDateWise;
