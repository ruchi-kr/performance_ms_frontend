import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { getAllUsers, createUser, editUser, deleteUser, getEmployerList } from '../Config.js';
import SideNavbar from '../Components/SideNavbar'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { toast } from 'react-toastify';
import { Col, Form, Input, Modal, Row, Select } from 'antd';
const { Option } = Select;
const UserMaster = () => {

    const [allUserData, setAllUserData] = useState([])

    // get all projects function
    const getAllUsersHandler = async () => {

        try {
            const response = await axios.get(`${getAllUsers}`);
            setAllUserData(response.data)
            console.log("user details data", response.data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getAllUsersHandler();
    }, []);

    // create project
    const userFormSubmit = (values) => {
        userForm.validateFields()
            .then((values) => {
                try {
                    const requestData = { ...values, id: editingUser ? editingUser.user_id : null };
                    const url = editingUser ? `${editUser}/${editingUser.user_id}` : `${createUser}`;
                    const response = axios.post(url, requestData);
                    if (response.status) {
                        if (editingUser && editingUser.user_id !== null) {
                            toast.success('User Details Updated Successfully!');
                        } else {
                            toast.success('User Added Successfully!');
                        }
                        userForm.resetFields();
                        setModalVisible(false);
                        window.location.reload()

                        getAllUsersHandler();
                    } else {
                        // console.log(response.data.message);
                        // toast.error(response.data.message);
                    }
                } catch (error) {
                    console.log(error);
                }
            })
            .catch((errorInfo) => {
                console.log('Validation failed user:', errorInfo);
            });
    };


    // delete projects function
    const deleteUserHandler = async (id) => {                            //creating a function for deleting data
        try {
            await axios.delete(`${deleteUser}` + id)          // deleting data from server
            window.location.reload()                             //reloading the page
        } catch (err) {
            console.log("error deleting user", err);                                 //if error occurs then log it
        }
    }
    // edit projects function

    const [userForm] = Form.useForm();
    let [managerId, setManagerId] = useState(null);
    let [modalVisible, setModalVisible] = useState(false);
    const [formDisabled, setFormDisabled] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const userData = {
        employee_id: '',
        user_type: '',
        status: '',
        username: '',
        password: '',
    };

    const openUserAdd = () => {
        window.scrollTo(0, 0);
        setModalVisible(true);
        setEditingUser(null);
        // SetProjectId(null);
        userForm.setFieldsValue(userData);
        setFormDisabled(false);
    }


    const openUserEdit = async (user) => {
        setEditingUser(user);
        setModalVisible(true);
        userForm.setFieldsValue({
            username: user.username,
            password: user.password,
            user_type: user.user_type,
            status: user.status,
            employee_id: user.employee_id
        });
    };

    const [userType, setUserType] = useState('');
    const filterOption = (input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
    const [employerList, setEmployerList] = useState([]);
    const [employer, setEmployer] = useState('')
    const getEmployers = async (value) => {
        try {
            const result = await axios.get(`${getEmployerList}`);
            setEmployerList(result.data);
            console.log("employer list", result.data);
        } catch (error) {

            console.log('Error fetching employer list data', error)
        }
    }
    useEffect(() => {
        getEmployers();
    }, []);
    const handleUserTypeSearch = (value) => {
        setUserType(value)
    }
    const handleEmployerSearch = (value) => {
        setEmployer(value)
    }
    return (
        <>
            <Header />
            <SideNavbar />
            <div className="content-wrapper bg-white">
                <div className="content">
                    <div className="container-bg-white">
                        {/* 3rd row */}
                        <div className="row my-5">
                            <div className="col-10 mx-auto">
                                {/* user master detailed table */}

                                <div className='d-flex justify-content-between'>
                                    <h3 className='text-primary'>User Details</h3>
                                    <button className='btn btn-sm btn-info d-flex align-items-center' onClick={openUserAdd} >
                                        <span className='fs-4'> + </span>&nbsp;Add User
                                    </button>
                                </div>
                                <hr className='bg-primary border-4' />
                                {/* modal */}
                                <Modal title={editingUser ? 'Edit User' : 'Add User'} visible={modalVisible}
                                    onOk={userFormSubmit}
                                    onCancel={() => {
                                        setModalVisible(false);
                                        setEditingUser(null);
                                    }}
                                    okText="Submit"
                                    okButtonProps={{ style: { display: formDisabled ? 'none' : '' } }}
                                    width={500}
                                    centered
                                >
                                    <Form form={userForm} onFinish={userFormSubmit} layout="vertical" disabled={formDisabled}>
                                        <p className='text-info text-decoration-underline'>User Details</p>
                                        <Row gutter={[8, 4]}>
                                            <Col span={12}>
                                                <Form.Item name="employee_id" label={<span className='text-info'>Employer Name</span>}

                                                    rules={[
                                                        { required: true, message: 'Employer Name is required' },
                                                    ]}
                                                >
                                                    <Select
                                                        showSearch
                                                        allowClear
                                                        placeholder="Select"
                                                        optionFilterProp="children"
                                                        filterOption={filterOption}
                                                        onChange={handleEmployerSearch}
                                                        style={{ width: "100%" }}
                                                        className="rounded-2"
                                                    >

                                                        <Option value="">Select</Option>

                                                        {employerList.map((employer, index) => (
                                                            <Option
                                                                key={index}
                                                                value={employer.employee_id}
                                                                label={employer.name}
                                                            >
                                                                {employer.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item name="user_type" label={<span className='text-info'>User Type</span>}
                                                    rules={[
                                                        { required: true, message: 'User Type is required' },

                                                    ]}
                                                >

                                                    <Select
                                                        showSearch
                                                        allowClear
                                                        placeholder="Select"
                                                        optionFilterProp="children"
                                                        filterOption={filterOption}
                                                        onChange={handleUserTypeSearch}
                                                        style={{ width: "100%" }}
                                                        className="rounded-2"
                                                    >
                                                        <Option value="">Select</Option>
                                                        <Option value="1">Admin</Option>
                                                        <Option value="0">General</Option>
                                                    </Select>

                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name="status" label={<span className='text-info'>Status</span>}
                                                    rules={[
                                                        { required: true, message: 'Status is required' },

                                                    ]}
                                                >
                                                    <Select
                                                        showSearch
                                                        allowClear
                                                        placeholder="Select"
                                                        optionFilterProp="children"
                                                        filterOption={filterOption}
                                                        onChange={handleUserTypeSearch}
                                                        style={{ width: "100%" }}
                                                        className="rounded-2"
                                                    >
                                                        <Option value="">Select</Option>
                                                        <Option value="active" className='text-success'>Active</Option>
                                                        <Option value="inactive" className='text-danger'>Inactive</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name="username" label={<span className='text-info'>Username</span>}
                                                    rules={[
                                                        { required: true, message: 'Username is required' },
                                                        {
                                                            pattern: /^[&,.\-_\w\s]{1,10}$/,
                                                            message: 'Please enter a valid Username (up to 20 characters, only &, , ., -, _ special characters are allowed)'
                                                        }
                                                    ]}
                                                >
                                                    <Input type="text" placeholder='username' />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name="password" label={<span className='text-info'>Password</span>}
                                                    rules={[
                                                        { required: true, message: 'Password is required' },
                                                        {
                                                            pattern: /^[@,&,.\-_\w\s]{8,20}$/,
                                                            message: 'Please enter a valid Password (up to 8-20 characters, only @, &, , ., -, _ special characters are allowed)'
                                                        }
                                                    ]}
                                                >
                                                    <Input type="password" placeholder='password' />
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
                                            <th scope="col">UserName</th>
                                            <th scope="col">Password</th>

                                            <th scope="col">User Type</th>
                                            <th scope="col">Employee Name</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {
                                            allUserData.map((data, index) => {
                                                return (
                                                    <tr key={data.user_id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{data.username}</td>
                                                        <td className='text-capitalize'>{data.password}</td>
                                                        <td className='text-capitalize'>{data.user_type}</td>
                                                        <td className='text-capitalize'>{data.employee_name}</td>
                                                        <td className={`text-capitalize ${data.status === 'active' ? 'text-success' : 'text-danger'}`}>{data.status}</td>
                                                        <td className='d-flex gap-2'>
                                                            <button className="btn btn-primary btn-sm" onClick={() => openUserEdit(data)} >Edit</button>
                                                            <button className="btn btn-danger btn-sm" onClick={() => deleteUserHandler(data.user_id)}>Delete</button>
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

export default UserMaster