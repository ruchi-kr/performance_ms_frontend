import React, { useState, useEffect } from 'react'
import axios from 'axios';
import SideNavbar from '../Components/SideNavbar'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { getAllEmployees, createEmployee, editEmployee, deleteEmployee, getManagerList } from '../Config.js';
import { toast } from 'react-toastify';
import { Col, Form, Input, Modal, Row, Select } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
const EmployeeMaster = () => {

    const [allEmployeeData, setAllEmployeeData] = useState([])

    // get all projects function
    const getAllEmployeesHandler = async () => {

        try {
            const response = await axios.get(`${getAllEmployees}`);
            setAllEmployeeData(response.data)
            console.log("employee details data", response.data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getAllEmployeesHandler();
    }, []);

    // create project
    // const employeeFormSubmit = (values) => {
    //     employeeForm.validateFields()
    //         .then((values) => {
    //             try {
    //                 const requestData = { ...values, id: editingEmployee ? editingEmployee.employee_id : null };
    //                 const url = editingEmployee ? `${editEmployee}/${editingEmployee.employee_id}` : `${createEmployee}`;
    //                 const response = axios.post(url, formatDates(requestData));
    //                 if (response.status === 200) {
    //                     if (editingEmployee && editingEmployee.project_id !== null) {
    //                         toast.success('Employee Details Updated Successfully!');
    //                     } else {
    //                         toast.success('Employee Added Successfully!');
    //                     }
    //                     employeeForm.resetFields();
    //                     setModalVisible(false);

    //                     getAllEmployeesHandler();
    //                 } else {
    //                     console.log("error employee",response.data);
    //                     // toast.error(error.response.data.error);
    //                 }
    //             } catch (error) {
    //                 console.log("error",error);
    //                 toast.error(error);
    //             }
    //         })
    //         .catch((errorInfo) => {
    //             console.log('Validation failed:', errorInfo);
    //         });
    // };

    const employeeFormSubmit = (values) => {
        employeeForm.validateFields()
            .then((values) => {
                try {
                    const requestData = { ...values, id: editingEmployee ? editingEmployee.employee_id : null };
                    const url = editingEmployee ? `${editEmployee}/${editingEmployee.employee_id}` : `${createEmployee}`;
                    axios.post(url, formatDates(requestData))
                        .then((response) => {
                            if (response.status === 200) {
                                if (editingEmployee && editingEmployee.project_id !== null) {
                                    toast.success('Employee Details Updated Successfully!');
                                } else {
                                    toast.success('Employee Added Successfully!');
                                }
                                employeeForm.resetFields();
                                setModalVisible(false);
                                getAllEmployeesHandler();
                            }
                        })
                        .catch((error) => {
                            if (error.response && error.response.data.error === "User with this email already registered") {
                                toast.error('User with this email already exists');
                            } else {
                                console.log("error employee", error.response.data);
                                // toast.error(error.response.data.error);
                            }
                        });
                } catch (error) {
                    console.log("error", error);
                    toast.error(error);
                }
            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });
    };

    const formatDates = (data) => {
        // Extract only the date part from the datetime string
        const formattedData = {
            ...data,
            doj: data.doj.split('T')[0],

        };
        return formattedData;
    };


    // delete projects function
    const deleteEmployeeHandler = async (id) => {                            //creating a function for deleting data
        try {
            await axios.delete(`${deleteEmployee}` + id)          // deleting data from server
            window.location.reload()                             //reloading the page
        } catch (err) {
            console.log("error deleting project", err);                                 //if error occurs then log it
        }
    }
    // edit projects function

    const [employeeForm] = Form.useForm();
    let [project_id, SetProjectId] = useState(null);
    let [modalVisible, setModalVisible] = useState(false);
    const [formDisabled, setFormDisabled] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const employeeData = {
        name: '',
        designation: '',
        doj: '',
        experience: '',
        skills: '',
        mobile_no: '',
        email: "",

    };

    const openEmployeeAdd = () => {
        window.scrollTo(0, 0);
        setModalVisible(true);
        setEditingEmployee(null);
        // SetProjectId(null);
        employeeForm.setFieldsValue(employeeData);
        setFormDisabled(false);
    }


    const openEmployeeEdit = async (employee) => {
        setEditingEmployee(employee);
        setModalVisible(true);
        employeeForm.setFieldsValue({
            name: employee.name,
            designation: employee.designation,
            doj: employee.doj.split('T')[0],
            experience: employee.experience,
            skills: employee.skills,
            mobile_no: employee.mobile_no,
            email: employee.email,
            reporting_manager_id: employee.reporting_manager_id,
        });
    };

    // reporting manager list
    const filterOption = (input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
    const [managerList, setManagerList] = useState([]);
    const [manager, setManager] = useState([]);
    const getManagers = async (value) => {
        try {
            const result = await axios.get(`${getManagerList}`);
            setManagerList(result.data);
            console.log("manager list", result.data);
        } catch (error) {

            console.log('Error fetching manager list data', error)
        }
    }
    useEffect(() => {
        getManagers();
    }, []);
    const handleManagerSearch = (value) => {
        setManager(value)
    }


    return (
        <>
            <Header />
            <SideNavbar />
            <div className="content-wrapper bg-white">
                <div className="content">
                    <div className="container-fluid bg-white">
                        {/* 1st row */}
                        <div className="row my-5">
                            <div className="col-12 mx-auto">
                                {/* employee master detailed table */}

                                <div className='d-flex justify-content-between'>
                                    <h3 className='text-primary'>Employee Details</h3>

                                    <button className='btn btn-sm btn-info d-flex align-items-center' onClick={openEmployeeAdd} >
                                        <span className='fs-4'> + </span>&nbsp;Add Employee
                                    </button>
                                </div>
                                <hr className='bg-primary border-4' />
                                {/* modal */}
                                <Modal title={editingEmployee ? 'Edit Employee' : 'Add Employee'} visible={modalVisible}
                                    onOk={employeeFormSubmit}
                                    onCancel={() => {
                                        setModalVisible(false);
                                        setEditingEmployee(null);
                                    }}
                                    okText="Submit"
                                    okButtonProps={{ style: { display: formDisabled ? 'none' : '' } }}
                                    width={500}
                                    centered
                                >
                                    <Form form={employeeForm} onFinish={employeeFormSubmit} layout="vertical" disabled={formDisabled}>
                                        <p className='text-info text-decoration-underline'>Employee Details</p>
                                        <Row gutter={[8, 4]}>
                                            <Col span={12}>
                                                <Form.Item name="name" label={<span className='text-info'>Employee Name</span>}
                                                    rules={[
                                                        { required: true, message: 'Employee Name is required' },
                                                        {
                                                            pattern: /^[&,.\-_\w\s]{1,50}$/,
                                                            message: 'Please enter a valid Employee Name (up to 50 characters, only &, , ., -, _ special characters are allowed)'
                                                        }
                                                    ]}
                                                >
                                                    <Input placeholder='employee name' />
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
                                                    <Input placeholder='designation' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={[8, 4]}>
                                            <Col span={12}>
                                                <Form.Item name="doj" label={<span className='text-info'>D.O.J</span>}
                                                    rules={[
                                                        { required: true, message: 'D.O.J is required' },

                                                    ]}
                                                >
                                                    <Input type="date" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name="experience" label={<span className='text-info'>Experience</span>}
                                                    rules={[
                                                        { required: true, message: 'Experience is required' },

                                                    ]}
                                                >
                                                    <Input type="number" placeholder="experience(in years)" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={[8, 4]}>
                                            <Col span={12}>
                                                <Form.Item name="mobile_no" label={<span className='text-info'>Mobile No.</span>}
                                                    rules={[
                                                        { required: true, message: 'Mobile No. is required' },

                                                    ]}
                                                >
                                                    <Input type="number" placeholder="mobile no." />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name="email" label={<span className='text-info'>Email</span>}
                                                    rules={[
                                                        { required: true, message: 'Email is required' },

                                                    ]}
                                                >
                                                    <Input type="email" placeholder="you@example.com" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name="reporting_manager_id" label={<span className='text-info'>Reporting Manager</span>}
                                                    rules={[
                                                        { required: true, message: 'Reporting Manager is required' },

                                                    ]}
                                                >
                                                    <Select
                                                        showSearch
                                                        allowClear
                                                        placeholder="Select"
                                                        optionFilterProp="children"
                                                        filterOption={filterOption}
                                                        onChange={handleManagerSearch}
                                                        style={{ width: "100%" }}
                                                        className="rounded-2"
                                                    >

                                                        <Option value="">Select</Option>

                                                        {managerList.map((manager, index) => (
                                                            <Option
                                                                key={index}
                                                                value={manager.reporting_manager_id}
                                                                label={manager.name}
                                                            >
                                                                {manager.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={[8, 4]}>
                                            <Col span={24}>
                                                <Form.Item name="skills" label={<span className='text-info'>Skills</span>}
                                                    rules={[
                                                        { required: true, message: 'Skills is required' },

                                                    ]}
                                                >
                                                    <TextArea
                                                        placeholder="write relevant skills here"
                                                        autoSize={{
                                                            minRows: 2,
                                                            maxRows: 6,
                                                        }}
                                                    />

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
                                            <th scope="col">Id</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Designation</th>
                                            <th scope="col">D.O.J</th>
                                            <th scope="col">Experience(in years)</th>
                                            <th scope="col">Skills</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Contact No.</th>
                                            <th scope='col'>Reporting Manager</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {
                                            allEmployeeData.map((data, index) => {
                                                return (
                                                    <tr key={data.employee_id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{data.employee_id}</td>
                                                        <td className='text-capitalize'>{data.name}</td>
                                                        <td className='text-capitalize'>{data.designation}</td>
                                                        <td>{data.doj.slice(8, 10)}/{data.doj.slice(5, 7)}/{data.doj.slice(0, 4)}</td>
                                                        <td>{data.experience}</td>
                                                        <td className='text-wrap'>{data.skills}</td>
                                                        <td>{data.email}</td>
                                                        <td>{data.mobile_no}</td>
                                                        <td>{data.reporting_name}</td>
                                                        {/* <td>{manager}</td> */}
                                                        <td className='d-flex gap-2'>
                                                            <button className="btn btn-primary btn-sm" onClick={() => openEmployeeEdit(data)} >Edit</button>
                                                            <button className="btn btn-danger btn-sm" onClick={() => deleteEmployeeHandler(data.employee_id)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
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

export default EmployeeMaster