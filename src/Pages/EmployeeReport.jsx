import React, { useEffect, useState } from 'react'
import axios from 'axios';
import SideNavbar from '../Components/SideNavbar'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { getEmployeeReport } from '../Config'
import { Input } from 'antd';
import { toast } from 'react-toastify';
const { Search } = Input;

const EmployeeReport = () => {
    const user_id = sessionStorage.getItem("id");
    // for pagination
    const pageSize = 10; // Number of items per page
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [reportData, setReportData] = useState([])
    // get all reports function
    const getEmployeeReportHandler = async (page) => {

        try {
            const response = await axios.get(`${getEmployeeReport}/${user_id}?page=${page}&pageSize=${pageSize}&name=${search}`);
            // ?page=${page}&pageSize=${pageSize}
            setReportData(response.data)
            console.log("report data", response.data);
            const tasksArray = JSON.parse(response.data[3].tasks);

            // Now you can access individual tasks
            console.log("task array", tasksArray);
            setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize));
        } catch (err) {
            console.log(err);
        }
    }
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


    return (
        <>
            <Header />
            <SideNavbar />
            <div className="content-wrapper bg-white">
                <div className="content">
                    <div className="container-fluid bg-white">
                        <div className="row mt-5">
                            <div className="col-11 mx-auto">
                                <h3 className='text-primary'>Reports</h3>
                                <hr className='bg-primary border-4' />
                                <div className="col-2 flex-end">
                                    <label className="text-capitalize fw-bold text-info">
                                        project name
                                    </label>

                                    <Search
                                        placeholder="search by project name"
                                        allowClear
                                        // onSearch={onSearch}
                                        style={{
                                            width: 200,
                                        }}
                                        value={search} onChange={(e) => setSearch(e.target.value)}
                                    />
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
                                            <th scope="col">Schd. Start Date</th>
                                            <th scope="col">Schd. End Date</th>
                                            <th scope="col">Man hrs</th>
                                            <th scope="col">Alloc hrs</th>
                                        </tr>
                                    </thead>
                                    {/* <tbody className="table-group-divider">

                                        {
                                            reportData.map((item, index) => {
                                                return (
                                                    <tr key={item.user_id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td className='text-capitalize'>{item.project_name}</td>
                                                        <td>{item.schedule_start_date.slice(8, 10)}/{item.schedule_start_date.slice(5, 7)}/{item.schedule_start_date.slice(0, 4)}</td>
                                                        <td>{item.schedule_end_date.slice(8, 10)}/{item.schedule_end_date.slice(5, 7)}/{item.schedule_end_date.slice(0, 4)}</td>

                                                        <td>{item.total_actual_hours}</td>

                                                        <td>{item.total_allocated_hours}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody> */}
                                    <tbody className="table-group-divider">
                                        {reportData.map((item, index) => (
                                            <React.Fragment key={item.user_id}>
                                                <tr onClick={() => handleRowClick(index)}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td className='text-capitalize'>{item.project_name}</td>
                                                    <td>{item.schedule_start_date.slice(8, 10)}/{item.schedule_start_date.slice(5, 7)}/{item.schedule_start_date.slice(0, 4)}</td>
                                                    <td>{item.schedule_end_date.slice(8, 10)}/{item.schedule_end_date.slice(5, 7)}/{item.schedule_end_date.slice(0, 4)}</td>
                                                    <td>{item.total_actual_hours}</td>
                                                    <td>{item.total_allocated_hours}</td>
                                                </tr>
                                                {expandedRow === index && (

                                                    <tr>
                                                        <td colSpan="12">
                                                            {/* <p>
                                                            {JSON.parse(item.tasks).map((task, taskIndex) => (
                                                                // <span key={taskIndex}>
                                                                //      {task.task}, Status: {task.status}, Allocated Time: {task.allocated_time}, Actual Time: {task.actual_time}
                                                                //     <br />
                                                                // </span>
                                                                // <p key={taskIndex}>Task: {task.task}, Status: {task.status}, Allocated Time: {task.allocated_time}, Actual Time: {task.actual_time}</p>
                                                            ))}
                                                        </p> */}
                                                            <table className='col-11 mx-auto'>
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
                                                                    {JSON.parse(item.tasks).map((task, taskIndex) => (
                                                                        <tr key={taskIndex}>
                                                                            <td>{task.task}</td>
                                                                            <td>{task.created_at.slice(8,10)}/{task.created_at.slice(5,7)}/{task.created_at.slice(0,4)}</td>
                                                                            <td>{task.status}</td>
                                                                            <td>{task.allocated_time}</td>
                                                                            <td>{task.actual_time}</td>
                                                                        </tr>
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
                                <div className="row float-right">
                                    <nav aria-label="Page navigation example" className='d-flex align-self-end mt-3'>
                                        <ul className="pagination">
                                            <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Previous" onClick={() => handlePageChange(currentPage - 1)}>
                                                    <span aria-hidden="true">«</span>
                                                </a>
                                            </li>
                                            {Array.from({ length: totalPages }, (_, index) => (
                                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                    <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                                                        {index + 1}
                                                    </a>
                                                </li>
                                            ))}
                                            <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Next" onClick={() => handlePageChange(currentPage + 1)}>
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
    )
}

export default EmployeeReport