import React, { useState, useEffect } from 'react'
import SideNavbar from '../Components/SideNavbar'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { getAllManagers, createManager, editManager, deleteManager } from '../Config.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Col, Form, Input, Modal, Row } from 'antd';


const ReportingManagerMaster = () => {

    // get all manager function with pagination
    const pageSize = 10; // Number of items per page
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [allManagerData, setAllManagerData] = useState([]);

    const getAllManagersHandler = async (page) => {
        try {
            const response = await axios.get(`${getAllManagers}?page=${page}&pageSize=${pageSize}`);
            setAllManagerData(response.data);
            setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize));
        } catch (err) {
            console.log(err);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber == 0 ? 1 : pageNumber);
        getAllManagersHandler(pageNumber == 0 ? 1 : pageNumber);
    };

    useEffect(() => {
        getAllManagersHandler(currentPage);
    }, [currentPage]);


    // create manager
    const managerFormSubmit = (values) => {
        managerForm.validateFields()
            .then((values) => {
                try {
                    const requestData = { ...values, id: editingManager ? editingManager.reporting_manager_id : null };
                    const url = editingManager ? `${editManager}/${editingManager.reporting_manager_id}` : `${createManager}`;
                    const response = axios.post(url, requestData);
                    if (response.status) {
                        if (editingManager && editingManager.reporting_manager_id !== null) {
                            toast.success('Manager Details Updated Successfully!');
                        } else {
                            toast.success('Manager Added Successfully!');
                        }
                        console.log("response added", response.data);
                        managerForm.resetFields();
                        setModalVisible(false);
                        window.location.reload()

                        getAllManagersHandler();
                    } else {
                        console.log(response.data.message);
                        // toast.error(response.data.message);
                    }
                } catch (error) {
                    console.log(error);
                }
            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });
    };


    const deleteManagerHandler = async (id) => {
        try {
            const response = await axios.delete(`${deleteManager}` + id);
            if (response.status === 200) {
                // Manager deleted successfully
                console.log(response.data);
                window.location.reload();
            } else if (response.status === 400) {
                // Manager is assigned to an employee
                console.log("error reporting manager deletion", response.error);
                toast.error(response.data.error);
            }
        } catch (err) {
            console.log("error deleting manager", err);
            // Display a generic error message if there's an unexpected error
            toast.error("Manager cannot be deleted as it is assigned to an employee");
            // toast.error(response.data.error);
        }
    }

    // edit manager function

    const [managerForm] = Form.useForm();
    let [managerId, setManagerId] = useState(null);
    let [modalVisible, setModalVisible] = useState(false);
    const [formDisabled, setFormDisabled] = useState(false);
    const [editingManager, setEditingManager] = useState(null);

    const managerData = {
        name: '',
        designation: '',
        department: '',
    };

    const openManagerAdd = () => {
        window.scrollTo(0, 0);
        setModalVisible(true);
        setEditingManager(null);
        // SetProjectId(null);
        managerForm.setFieldsValue(managerData);
        setFormDisabled(false);
    }


    const openManagerEdit = async (manager) => {
        setEditingManager(manager);
        setModalVisible(true);
        managerForm.setFieldsValue({
            name: manager.name,
            designation: manager.designation,
            department: manager.department
        });
    };


    return (
        <>
            <Header />
            <SideNavbar />
            <div className="content-wrapper bg-white">
                <div className="content">
                    <div className="container-fluid bg-white">
                        {/* 1st row */}
                        <div className="row my-5">
                            <div className="col-11 mx-auto">
                                {/* reporting manager master detailed table */}

                                <div className='d-flex justify-content-between'>
                                    <h3 className='text-primary'>Reporting Manager Details</h3>
                                    <button className='btn btn-sm btn-info d-flex align-items-center' onClick={openManagerAdd} >
                                        <span className='fs-4'> + </span>&nbsp;Add Reporting Manager
                                    </button>
                                </div>
                                <hr className='bg-primary border-4' />
                                {/* modal */}
                                <Modal title={editingManager ? 'Edit Manager' : 'Add Manager'} visible={modalVisible}
                                    onOk={managerFormSubmit}
                                    onCancel={() => {
                                        setModalVisible(false);
                                        setEditingManager(null);
                                    }}
                                    okText="Submit"
                                    okButtonProps={{ style: { display: formDisabled ? 'none' : '' } }}
                                    width={500}
                                    centered
                                >
                                    <Form form={managerForm} onFinish={managerFormSubmit} layout="vertical" disabled={formDisabled}>
                                        <p className='text-info text-decoration-underline'>Manager Details</p>
                                        <Row gutter={[8, 4]}>
                                            <Col span={12}>
                                                <Form.Item name="name" label={<span className='text-info'>Reporting Manager Name</span>}
                                                    rules={[
                                                        { required: true, message: 'Reporting Manager Name is required' },
                                                        {
                                                            pattern: /^[&,.\-_\w\s]{1,50}$/,
                                                            message: 'Please enter a valid Reporting Manager Name (up to 50 characters, only &, , ., -, _ special characters are allowed)'
                                                        }
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name="designation" label={<span className='text-info'>Designation</span>}
                                                    rules={[
                                                        { required: true, message: 'Designation is required' },
                                                        {
                                                            pattern: /^[&,.\-_\w\s]{1,50}$/,
                                                            message: 'Please enter a valid Designation Name (up to 50 characters, only &, , ., -, _ special characters are allowed)'
                                                        }
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name="department" label={<span className='text-info'>Department</span>}
                                                    rules={[
                                                        { required: true, message: 'Department is required' },
                                                        {
                                                            pattern: /^[&,.\-_\w\s]{1,50}$/,
                                                            message: 'Please enter a valid Department Name (up to 50 characters, only &, , ., -, _ special characters are allowed)'
                                                        }
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Modal>
                                {/* table */}
                                <table className="table table-striped table-hover mt-5">
                                    <thead>
                                        <tr>
                                            <th scope="col">S.No.</th>
                                            {/* <th scope="col">Reporting Manager Id</th> */}
                                            <th scope="col">Reporting Manager Name</th>
                                            <th scope="col">Designation</th>
                                            <th scope="col">Department</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {
                                            allManagerData.map((data, index) => {
                                                return (
                                                    <tr key={data.reporting_manager_id}>
                                                        <th scope="row">{index + 1}</th>
                                                        {/* <td>{data.reporting_manager_id}</td> */}
                                                        <td className='text-capitalize'>{data.name}</td>
                                                        <td className='text-capitalize'>{data.designation}</td>
                                                        <td className='text-capitalize'>{data.department}</td>
                                                        <td className='d-flex gap-2'>
                                                            <button className="btn btn-primary btn-sm" onClick={() => openManagerEdit(data)} >Edit</button>
                                                            <button className="btn btn-danger btn-sm" onClick={() => deleteManagerHandler(data.reporting_manager_id)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                    <tfoot >
                                        <tr className='row' >
                                            {/* <nav aria-label="Page navigation example" className='d-flex align-self-end mt-3'>
                                                <ul className="pagination">
                                                    <li className="page-item">
                                                        <a className="page-link" href="#" aria-label="Previous">
                                                            <span aria-hidden="true">«</span>
                                                        </a>
                                                    </li>
                                                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                                    <li className="page-item">
                                                        <a className="page-link" href="#" aria-label="Next">
                                                            <span aria-hidden="true">»</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </nav> */}
                                            {/* Your component JSX code */}
                                            <nav aria-label="Page navigation example"className='d-flex align-self-end mt-3'>
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
                                        </tr>
                                    </tfoot>
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

export default ReportingManagerMaster