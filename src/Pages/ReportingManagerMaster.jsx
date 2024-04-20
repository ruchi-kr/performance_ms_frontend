import React,{useState, useEffect} from 'react'
import SideNavbar from '../Components/SideNavbar'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { getAllManagers, createManager, editManager, deleteManager } from '../Config.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Col, Form, Input, Modal, Row} from 'antd';


const ReportingManagerMaster = () => {

    const [allManagerData, setAllManagerData] = useState([])

    // get all projects function
    const getAllManagersHandler = async () => {

        try {
            const response = await axios.get(`${getAllManagers}`);
            setAllManagerData(response.data)
            console.log("manager details data", response.data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getAllManagersHandler();
    }, []);
 
    // create project
    const managerFormSubmit = (values) => {
        managerForm.validateFields()
            .then((values) => {
                try {
                    const requestData = { ...values,  id: editingManager ? editingManager.reporting_manager_id	 : null };
                    const url = editingManager ? `${editManager}/${editingManager.reporting_manager_id}` : `${createManager}`;
                    const response = axios.post(url, requestData);
                    if (response.status) {
                        if (editingManager && editingManager.reporting_manager_id !== null) {
                            toast.success('Manager Details Updated Successfully!');
                        } else {
                            toast.success('Manager Added Successfully!');
                        }
                        managerForm.resetFields();
                        setModalVisible(false);
                        window.location.reload()
                      
                        getAllManagersHandler();
                    } else {
                        // console.log(response.data.message);
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

   
    // delete projects function
    const deleteManagerHandler = async (id) => {                            //creating a function for deleting data
        try {
            await axios.delete(`${deleteManager}` + id)          // deleting data from server
            window.location.reload()                             //reloading the page
        } catch (err) {
            console.log("error deleting manager", err);                                 //if error occurs then log it
        }
    }
    // edit projects function

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
                            <div className="col-10 mx-auto">
                                {/* reporting manager master detailed table */}

                                <div className='d-flex justify-content-between'>
                                    <h3 className='text-primary'>Reporting Manager Details</h3>
                                    <button className='btn btn-sm btn-info d-flex align-items-center' onClick={openManagerAdd} >
                                        <span className='fs-4'> + </span>&nbsp;Add Reporting Manager
                                    </button>
                                </div>
                                <hr className='bg-primary border-4'/>
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
                                            <th scope="col">Reporting Manager Id</th>
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
                                                        <td>{data.reporting_manager_id}</td>
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