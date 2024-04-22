import React, { useEffect, useState } from 'react'
import SideNavbar from '../Components/SideNavbar'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { deleteProject, getAllProjects, createProject, editProject,CONFIG_OBJ } from '../Config.js';
import axios from 'axios';
import { Col, Form, Input, Modal, Row} from 'antd';
import { toast } from 'react-toastify'
const ProjectMaster = () => {

    const [allProjectData, setAllProjectData] = useState([])
   
    // get all projects function
    const getAllProjectsHandler = async () => {

        try {
            const response = await axios.get(`${getAllProjects}`,CONFIG_OBJ);
            setAllProjectData(response.data)
            console.log("project details data", response.data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getAllProjectsHandler();
    }, []);
 
    // create project
    const projectFormSubmit = (values) => {
        projectForm.validateFields()
            .then((values) => {
                try {
                    const requestData = { ...values,  id: editingProject ? editingProject.project_id : null };
                    const url = editingProject ? `${editProject}/${editingProject.project_id}` : `${createProject}`;
                    const response = axios.post(url, formatDates(requestData),CONFIG_OBJ);
                    if (response.status===200) {
                        if (editingProject && editingProject.project_id !== null) {
                            toast.success('Project Details Updated Successfully!');
                        } else {
                            toast.success('Project Added Successfully!');
                        }
                        projectForm.resetFields();
                        setModalVisible(false);
                      
                         getAllProjectsHandler();
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

    const formatDates = (data) => {
        // Extract only the date part from the datetime string
        const formattedData = {
            ...data,
            schedule_start_date: data.schedule_start_date.split('T')[0],
            schedule_end_date: data.schedule_end_date.split('T')[0]
        };
        return formattedData;
    };

   
    // delete projects function
    const deleteProjectHandler = async (id) => {                            //creating a function for deleting data
        try {
            await axios.delete(`${deleteProject}` + id, CONFIG_OBJ)          // deleting data from server
            window.location.reload()                             //reloading the page
        } catch (err) {
            console.log("error deleting project", err);                                 //if error occurs then log it
        }
    }
    // edit projects function

    const [projectForm] = Form.useForm();
    let [project_id, SetProjectId] = useState(null);
    let [modalVisible, setModalVisible] = useState(false);
    const [formDisabled, setFormDisabled] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const projectData = {
        project_name: '',
        schedule_start_date: '',
        schedule_end_date: '',
    };

    const openProjectAdd = () => {
        window.scrollTo(0, 0);
        setModalVisible(true);
        setEditingProject(null);
        // SetProjectId(null);
        projectForm.setFieldsValue(projectData);
        setFormDisabled(false);
    }
   
 
    const openProjectEdit = async (project) => {
        setEditingProject(project);
        setModalVisible(true);
        projectForm.setFieldsValue({
            project_name: project.project_name,
            schedule_start_date: project.schedule_start_date.split('T')[0], // Display only the date part
            schedule_end_date: project.schedule_end_date.split('T')[0] // Display only the date part
        });
    };
    return (
        <>
            <Header />
            <SideNavbar />
            <div className="content-wrapper bg-white">
                <div className="content">
                   

                    <div className="container-fluid bg-white">
                        <div className="row my-5">
                            <div className="col-10 mx-auto">
                                <div className='d-flex justify-content-between'>
                                    <h3 className='text-primary'>Project Details</h3>
                                    <button className='btn btn-sm btn-info d-flex align-items-center' onClick={openProjectAdd} >
                                        <span className='fs-4'> + </span>&nbsp;Create Project
                                    </button>
                                </div>
                                <hr className='bg-primary border-4' />
                                <Modal title={editingProject ? 'Edit Project' : 'Add Project'} visible={modalVisible}
                                    onOk={projectFormSubmit}
                                    onCancel={() => {
                                        setModalVisible(false);
                                        setEditingProject(null);
                                    }}
                                    okText="Submit"
                                    okButtonProps={{ style: { display: formDisabled ? 'none' : '' } }}
                                    width={500}
                                    centered
                                >
                                    <Form form={projectForm} onFinish={projectFormSubmit} layout="vertical" disabled={formDisabled}>
                                        <p className='text-info text-decoration-underline'>Project Details</p>
                                        <Row gutter={[8, 4]}>
                                            <Col span={12}>
                                                <Form.Item name="project_name" label={<span className='text-info'>Project Name</span>}
                                                    rules={[
                                                        { required: true, message: 'Project Name is required' },
                                                        {
                                                            pattern: /^[&,.\-_\w\s]{1,50}$/,
                                                            message: 'Please enter a valid Project name (up to 50 characters, only &, , ., -, _ special characters are allowed)'
                                                        }
                                                    ]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item name="schedule_start_date" label={<span className='text-info text-capitalize'>schedule start date</span>}
                                                    rules={[
                                                        { required: true, message: 'start date is required' },
                                                    ]}>
                                                    <Input type="date" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item name="schedule_end_date" label={<span className='text-info text-capitalize'>schedule end date</span>}
                                                    rules={[
                                                        { required: true, message: 'end date is required' },
                                                    ]}>
                                                    <Input type="date" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Modal>
                                <table className="table table-striped table-hover mt-5">
                                    <thead>
                                        <tr>
                                            <th scope="col">S.No.</th>
                                            <th scope="col">Project Id</th>
                                            <th scope="col">Project Name</th>
                                            <th scope="col">Sche. Start Date</th>
                                            <th scope="col">Sche. End Date</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {
                                            allProjectData.map((data, index) => {
                                                return (
                                                    <tr key={data.project_id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{data.project_id}</td>
                                                        <td>{data.project_name}</td>
                                                        <td>{data.schedule_start_date.slice(8, 10)}/{data.schedule_start_date.slice(5, 7)}/{data.schedule_start_date.slice(0, 4)}</td>
                                                        <td>{data.schedule_end_date.slice(8, 10)}/{data.schedule_end_date.slice(5, 7)}/{data.schedule_end_date.slice(0, 4)}</td>
                                                        <td className='d-flex gap-2'>
                                                            <button className="btn btn-primary btn-sm" onClick={() => openProjectEdit(data)} >Edit</button>
                                                            <button className="btn btn-danger btn-sm" onClick={() => deleteProjectHandler(data.project_id)}>Delete</button>
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

export default ProjectMaster