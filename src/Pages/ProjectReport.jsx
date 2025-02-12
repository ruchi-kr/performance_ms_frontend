import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import moment from "moment";
import { getEmployeeReport, CONFIG_OBJ } from "../Config";
import dayjs from "dayjs";
import { Input, Button, DatePicker, Tag, Row, Col, Select } from "antd";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { faFilePdf, faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { Search } = Input;
const { RangePicker } = DatePicker;
const ProjectReport = () => {
  const user_id = sessionStorage.getItem("id");
  // for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [reportData, setReportData] = useState([]);
  const [projectActualStartDate, setProjectActualStartDate] = useState(null);
  const [projectActualEndDate, setProjectActualEndDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [projectTotalManDaysData, setProjectTotalManDaysData] = useState([]);
  const [loadingFirstApi, setLoadingFirstApi] = useState(true);
  const [loadingSecondApi, setLoadingSecondApi] = useState(true);
  const [projectStageFilter, setProjectStageFilter] = useState("all");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const manager_id = user?.employee_id;

  // get all reports function
  const getTotalManDays = async () => {
    try {
      const resp = await axios.get(
        "http://localhost:8000/api/getProjectTotalManHours",
        CONFIG_OBJ
      );
      console.log("totoal man hrs data", resp.data.data);

      setProjectTotalManDaysData(resp.data.data);
      setLoadingSecondApi(false);
    } catch (error) {
      setLoadingSecondApi(false);
    }
  };

  const getEmployeeReportHandler = async () => {
    let response = [];
    try {
      // const response = await axios.get(`${getEmployeeReport}/${user_id}?page=${page}&pageSize=${pageSize}&name=${search}`);
      // ?page=${page}&pageSize=${pageSize}
      response = await axios.get(
        `http://localhost:8000/api/project/report/${manager_id}/?search=${search}&toDate=${toDate}&fromDate=${fromDate}&stage=${projectStageFilter}&page=${currentPage}&pageSize=${10}`,
        CONFIG_OBJ
      );

      console.log("report data", response.data);
      // setReportData(response.data);
      setLoadingFirstApi(false);
      const temp = response.data.map((team) => {
        return {
          ...team,
          report: team.report.filter((task) => task.employee_id !== null),
        };
      });
      console.log("modified values", temp);
      const newresp = temp?.map((item) => {
        const match = projectTotalManDaysData.find(
          (i) => i.project_id === item.project_id
        );

        // console.log("match found", match);
        return {
          ...item,
          total_allocated_man_days: match.total_man_days * 8,
        };
      });
      setReportData(newresp);
      // console.log("report data", newresp);
    } catch (err) {
      console.log(err);
      setLoadingFirstApi(false);
    }
  };
  useEffect(() => {
    getTotalManDays();
  }, []);
  useEffect(() => {
    console.log("man days data", projectTotalManDaysData);
    getEmployeeReportHandler();
  }, [projectTotalManDaysData]);
  useEffect(() => {
    getEmployeeReportHandler();
  }, [toDate, fromDate, projectStageFilter]);

  useEffect(() => {
    async function fetchScheduleStartDate() {
      const projectExtraDetails = await axios.get(
        `http://localhost:8000/api/project/actualStartDate/${manager_id}`,
        CONFIG_OBJ
      );
      // console.log("project extra details", projectExtraDetails.data);
      setProjectActualStartDate(projectExtraDetails.data);
    }
    fetchScheduleStartDate();
  }, []);
  useEffect(() => {
    async function fetchActualEndDate() {
      const projectExtraDetails = await axios.get(
        `http://localhost:8000/api/project/actualEndDate/${manager_id}`,
        CONFIG_OBJ
      );
      console.log(
        "project extra details actual end date---------->",
        projectExtraDetails.data
      );
      setProjectActualEndDate(projectExtraDetails.data);
    }
    fetchActualEndDate();
  }, []);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber == 0 ? 1 : pageNumber);
    getEmployeeReportHandler(pageNumber == 0 ? 1 : pageNumber);
  };
  const findActualStartDate = (projectId) => {
    const project = projectActualStartDate?.find(
      (item) => item?.project_id === projectId
    );
    return project ? project?.actual_start_date : null;
  };
  const findActualEndDate = (projectId) => {
    const project = projectActualEndDate?.find(
      (item) => item?.project_id === projectId
    );
    return project ? project?.actual_end_date : null;
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
    //   const unit = "pt";
    //   const size = "A4"; // Use A1, A2, A3 or A4
    //   const orientation = "landscape"; // 'portrait' or 'landscape'
    //   const marginLeft = 40;
    //   const doc = new jsPDF(orientation, unit, size);
    //   doc.setFontSize(15);
    //   const title = "Employee Report Project-Wise";
    //   const headers = [
    //     [
    //       "S.No.",
    //       "Project Name",
    //       "Schd. Start Date",
    //       "Schd. End Date",
    //       "Alloc hrs",
    //       "Man hrs",
    //     ],
    //   ];
    //   let data = [];
    //   reportData.forEach((item, index) => {
    //     const row = [
    //       index + 1,
    //       item.project_name,
    //       `${item.schedule_start_date.slice(
    //         8,
    //         10
    //       )}/${item.schedule_start_date.slice(
    //         5,
    //         7
    //       )}/${item.schedule_start_date.slice(0, 4)}`,
    //       `${item.schedule_end_date.slice(8, 10)}/${item.schedule_end_date.slice(
    //         5,
    //         7
    //       )}/${item.schedule_end_date.slice(0, 4)}`,
    //       item.total_allocated_hours,
    //       item.total_actual_hours,
    //       "", // Placeholder for tasks
    //     ];
    //     data.push(row);
    //     if (expandedRow === index) {
    //       JSON.parse(item.tasks).forEach((task) => {
    //         const taskRow = [
    //           // { content: task.task, styles: { color: 'blue' } },
    //           task.task, // Task
    //           `${task.created_at.slice(8, 10)}/${task.created_at.slice(
    //             5,
    //             7
    //           )}/${task.created_at.slice(0, 4)}`,
    //           task.status,
    //           task.allocated_time,
    //           task.actual_time,
    //         ];
    //         data.push(taskRow);
    //       });
    //     }
    //   });
    //   let content = {
    //     startY: 50,
    //     head: headers,
    //     body: data,
    //   };
    //   doc.text(title, marginLeft, 40);
    //   doc.autoTable(content); // Ensure you're using autoTable correctly here
    //   doc.save("employee_reportPW.pdf");
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
                <h3 className="text-primary">All Projects Reports</h3>
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
                      project name
                    </label>

                    <Search
                      placeholder="Search Project"
                      allowClear
                      onSearch={onSearch}
                      style={{
                        width: 200,
                        // boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.2)",
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
                      style={{
                        width: "100%",
                        // boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.2)",
                      }}
                      className="rounded-2"
                      format={"DD/MM/YYYY"}
                      defaultValue={[dayjs().subtract(30, "day"), dayjs()]}
                      showTime={false}
                    />
                  </Col>
                </Row>
                <div className="d-flex justify-content-between">
                  <div className="col-2"></div>
                  <div className="flex-end">
                    <div className="col-sm-4 col-md-3 col-lg-8">
                      <div className="mb-3"></div>
                    </div>
                  </div>
                  <div className="col-2 mt-4 d-flex justify-content-end">
                    <div className=" d-flex gap-3">
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
                <div className="d-flex justify-content-end mt-3 mr-2">
                  <span className="text-danger">*</span>
                  <span>Time in hours</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-11   mx-auto">
                {/* table */}
                <table
                  id="reportTablepw"
                  className="table table-striped mt-2 table-sm"
                >
                  <thead>
                    <tr className="">
                      <th scope="col" className="text-center">
                        S.No.
                      </th>
                      <th scope="col">Project Name</th>

                      <th scope="col">
                        <div className="d-flex flex-column">
                          <span>Schd. St. Dt.</span>
                          <span>Schd. End Dt.</span>
                        </div>
                      </th>
                      <th scope="col">
                        <div className="d-flex flex-column justify-content-center">
                          <span>Act. St. Date</span>
                          <span>Act. End Date</span>
                        </div>
                      </th>
                      <th scope="col">
                        <div className="d-flex flex-column">
                          <span>Project</span>
                          <span>Planned Hours</span>
                        </div>
                      </th>
                      <th scope="col" className="text-center ">
                        Actual Man Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {reportData?.map((item, index) => {
                      let totalActualTime = item?.report?.reduce(
                        (acc, i) => acc + i.total_actual_time,
                        0
                      );
                      let totalAllocatedTime = item?.report?.reduce(
                        (acc, i) => acc + i.total_allocated_time,
                        0
                      );
                      return (
                        <tr key={item.user_id}>
                          <td className="text-center">{index + 1}.</td>
                          <td className="text-capitalize">
                            <NavLink
                              to={`/manager/report/project/detailed/`}
                            >
                              {item.project_name}
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
                            <div className="d-flex flex-column justify-content-center">
                              <span>
                                {findActualStartDate(item?.project_id) !== null
                                  ? moment
                                      .utc(
                                        findActualStartDate(item?.project_id)
                                      )
                                      .format("DD/MM/YYYY")
                                  : "-"}
                              </span>
                              <span className="">
                                {item.stage === "completed"
                                  ? findActualEndDate(item?.project_id) !== null
                                    ? moment
                                        .utc(
                                          findActualEndDate(item?.project_id)
                                        )
                                        .format("DD/MM/YYYY")
                                    : "-"
                                  : "-"}
                              </span>
                            </div>
                          </td>
                          <td>{item.total_allocated_man_days}</td>
                          <td>
                            <table
                              className="mx-auto table table-sm table-borderless"
                              style={{ width: "100%" }}
                            >
                              <thead>
                                <tr>
                                  <th scope="col">S.No.</th>
                                  <th scope="col">Name</th>
                                  <th scope="col">Alloc. hrs.</th>
                                  <th scope="col">
                                    <div>Act. hrs.</div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {item?.report?.map((i, nestedIndex) =>
                                  i.name !== null ? (
                                    <tr className="">
                                      <td className="text-center">
                                        {`${index + 1}.${nestedIndex + 1}`}
                                      </td>
                                      <td className="text-capitalize">
                                        {i.name}
                                      </td>
                                      <td className="">
                                        {i.total_allocated_time}
                                      </td>
                                      <td className="">
                                        {i.total_actual_time}
                                      </td>
                                    </tr>
                                  ) : (
                                    ""
                                  )
                                )}
                                {totalAllocatedTime - totalActualTime < 0 ? (
                                  <tr
                                    style={{
                                      borderTop: "2px solid red",
                                      borderBottom: "2px solid red",
                                    }}
                                  >
                                    <td colSpan={2}>
                                      <span>Grand Total</span>
                                    </td>
                                    <td className="text-danger">
                                      <span>{totalAllocatedTime}</span>
                                    </td>
                                    <td className="">
                                      <span className="text-danger">
                                        {totalActualTime}
                                      </span>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr
                                    className=""
                                    style={{
                                      borderTop: "2px solid #dee2e6",
                                      borderBottom: "2px solid #dee2e6",
                                    }}
                                  >
                                    <td colSpan={2}>
                                      <p className=" text-primary">
                                        Grand Total
                                      </p>
                                    </td>
                                    <td className="">
                                      <span className="text-primary">
                                        {totalAllocatedTime}
                                      </span>
                                    </td>
                                    <td>
                                      <span className="text-primary">
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
