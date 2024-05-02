import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getEmployeeReportDW } from '../Config';
import SideNavbar from '../Components/SideNavbar';
import Header from '../Components/Header';
import Footer from '../Components/Footer';


const EmployeeReportDateWise = () => {
    const user_id = sessionStorage.getItem('id');
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [reportData, setReportData] = useState([]);

    const getEmployeeReportHandler = async (page) => {
        try {
            const response = await axios.get(
                `${getEmployeeReportDW}/${user_id}?page=${page}&pageSize=${pageSize}`
            );

            setReportData(response.data);
            setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getEmployeeReportHandler(currentPage);
    }, [currentPage]);

    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (index) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
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
                        <div className="row">
                            <div className="col-11 mx-auto">
                                <table className="table table-striped table-hover mt-5">
                                    <thead>
                                        <tr>
                                            <th scope="col">S.No.</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Project Name</th>
                                            <th scope="col">Alloc hrs</th>
                                            <th scope="col">Man hrs</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {reportData && reportData.map((item, index) => (
                                            <React.Fragment key={item.user_id}>
                                                <tr onClick={() => toggleRow(index)}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td className='text-capitalize'>{item.created_at.slice(8, 10)}/{item.created_at.slice(5, 7)}/{item.created_at.slice(0, 4)}</td>
                                                    <td className='text-capitalize'>{item.project_name}</td>
                                                    <td>{item.total_allocated_hours}</td>
                                                    <td>{item.total_actual_hours}</td>
                                                </tr>
                                                {expandedRows[index] && (
                                                    <tr>
                                                        <td colSpan="5">
                                                            <table className='col-11 mx-auto'>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Task</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {item.tasks && JSON.parse(item.tasks).map((task, taskIndex) => (
                                                                        <tr key={taskIndex}>
                                                                            <td>{task.task}</td>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default EmployeeReportDateWise;
