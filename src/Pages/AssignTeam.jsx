import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar.jsx";
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import { getAllEmployees,CONFIG_OBJ } from "../Config.js";
import { toast } from "react-toastify";
import {
  Col,
  Form,
  Typography,
  Input,
  Modal,
  Row,
  Table,
  Select,
  Button,
  Tag,
  Space,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  
  SearchOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { formatDate } from "../utils/dateFormatter.js";
import Highlighter from 'react-highlight-words';
const { Option } = Select;
const { confirm } = Modal;
const { Title } = Typography;

const AssignTeam = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamsData, setTeamsData] = useState(null);
  const [modifiedTeamsData, setModifiedTeamsData] = useState(null);
  const [allEmployeeData, setAllEmployeeData] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [form] = Form.useForm();
  const [project_id, SetProjectId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [managerList, setManagerList] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const managerEmployeeId = user.employee_id;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  //States for searching in table
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const fetchAll = async () => {
    const resp = await axios.get(
      `http://localhost:8000/api/user/project/teams/${managerEmployeeId}`,CONFIG_OBJ
    );
    console.log("team data ******", resp.data.data);
    setTeamsData(resp.data.data);
  };
  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    // get all projects function
    const getAllEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/getEmployeeslist",CONFIG_OBJ
        );
        console.log("employee list get all employees", response.data);
        const filteredUsers = response?.data?.filter(
          (user) => user.manager_id != null
        );
        const filteredManagers = response?.data?.filter(
          (user) => user.manager_id === null
        );
        setAllEmployeeData(filteredUsers);
        setManagerList(filteredManagers);
      } catch (err) {
        console.log(err);
      }
    };
    getAllEmployees();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      const resp = await axios.get(
        "http://localhost:8000/api/admin/getProjects",CONFIG_OBJ
      );
      console.log("project data", resp.data);
      setProjectData(resp.data);
    };
    fetchProject();
  }, []);

  useEffect(() => {
    // Populate employee data for each team
    const populatedTeams = teamsData?.map((team) => ({
      ...team,
      employee_details: team?.employee_id.map((empId) =>
        allEmployeeData?.find((emp) => emp.employee_id === empId)
      ),
    }));
    console.log("new populated teams", populatedTeams);
    setModifiedTeamsData(populatedTeams);
  }, [allEmployeeData, teamsData]);

  const openEmployeeEdit = async (employee) => {
    setEditingEmployee(employee);
    setEditingId(employee.team_id);
    setModalVisible(true);
    setIsEditing(true);
    setIsAdding(false);
    setSelectedRowKeys(employee.employee_id);
    console.log("data for editing", employee);
    form.setFieldsValue({
      project_id: employee.project_id,
      employee_id: employee.employee_id,
    });
  };
  const onFinish = (values) => {
    console.log("form values", { ...values, employee_id: selectedRowKeys });
    if (isAdding && !isEditing) {
      console.log("Adding values");
      form
        .validateFields()
        .then((values) => {
          try {
            console.log("form data", values);
            axios.post(
              `http://localhost:8000/api/user/project/teams/${managerEmployeeId}`,
              { ...values, employee_id: selectedRowKeys },CONFIG_OBJ,
            );
            setIsAdding(true);
            setSelectedRowKeys([]);

            setModalVisible(false);
            form.resetFields();
            fetchAll();
          } catch (error) {
            console.log(error);
          }
        })
        .catch((errorInfo) => {
          console.log("Validation failed:", errorInfo);
        });
    } else if (!isAdding && isEditing) {
      console.log("editing values", values.team_id);
      form
        .validateFields()
        .then((values) => {
          try {
            console.log("team id", editingId);
            console.log("form data", values);
            axios.patch(
              `http://localhost:8000/api/user/project/teams/${editingId}`,
              {
                ...values,
                reporting_manager_id: managerEmployeeId,
                employee_id: selectedRowKeys,
              },CONFIG_OBJ
            );
            fetchAll();
            setIsEditing(false);
            form.resetFields();
            setSelectedRowKeys([]);
            setModalVisible(false);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((errorInfo) => {
          console.log("Validation failed:", errorInfo);
        });
    }
  };
  // create project
  const teamFormSubmit = (values) => {
    if (isAdding && !isEditing) {
      console.log("Adding values");
      form
        .validateFields()
        .then((values) => {
          try {
            console.log("form data", values);
            axios.post(
              `http://localhost:8000/api/user/project/teams/${managerEmployeeId}`,CONFIG_OBJ,
              values
            );
            setIsAdding(false);
            setModalVisible(false);
            form.resetFields();
            fetchAll();
          } catch (error) {
            console.log(error);
          }
        })
        .catch((errorInfo) => {
          console.log("Validation failed:", errorInfo);
        });
    } else if (!isAdding && isEditing) {
      console.log("editing values", values.team_id);
      form
        .validateFields()
        .then((values) => {
          try {
            console.log("team id", editingId);
            console.log("form data", values);
            axios.patch(
              `http://localhost:8000/api/user/project/teams/${editingId}`,CONFIG_OBJ,
              {
                ...values,
                reporting_manager_id: managerEmployeeId,
              }
            );
            setIsEditing(false);
            form.resetFields();
            fetchAll();
            setModalVisible(false);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((errorInfo) => {
          console.log("Validation failed:", errorInfo);
        });
    }
  };

  // delete projects function
  const deleteTeamHandler = async (id) => {
    try {
      await confirm({
        title: "Do you want to delete these items?",
        icon: <ExclamationCircleFilled />,
        content: "Be sure before deleting, this process is irreversible!",
        async onOk() {
          try {
            await axios.delete(
              "http://localhost:8000/api/user/project/teams/" + id,CONFIG_OBJ
            );
            fetchAll();
          } catch (err) {
            console.log("error deleting project", err);
          }
        },
        onCancel() {},
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openTeamAdd = () => {
    window.scrollTo(0, 0);
    setModalVisible(true);
    setIsAdding(true);
    setIsEditing(false);
    setEditingEmployee(null);
    // SetProjectId(null);
    setFormDisabled(false);
  };
  //handle search in table

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  //Table column
  const columns = [
   
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name'),
      render: (text) => <span className="text-capitalize">{text}</span>,
    },
    {
      title: "Job Role",
      dataIndex: "job_role_name",
      sorter: (a, b) => a.job_role_name.localeCompare(b.job_role_name),
      ...getColumnSearchProps('job_role_name'),
      render: (text) => <p className="text-capitalize">{text}</p>,
    },
    {
      title: "Year of Exp.",
      dataIndex: "experience",
      sorter: {
        compare: (a, b) => a.experience - b.experience,
        multiple: 1,
      },
    //   sortDirections: ['descend', 'ascend'],
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const start = () => {
    // ajax request after empty completing
    console.log("employees selected", selectedRowKeys);
    setTimeout(() => {
      setSelectedRowKeys([]);
    }, 1000);
  };
  const hasSelected = selectedRowKeys.length > 0;

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
                <div className="d-flex justify-content-between">
                  <h3 className="text-primary">Teams Details New</h3>

                  <button
                    className="btn btn-sm btn-info d-flex align-items-center"
                    onClick={openTeamAdd}
                  >
                    <span className="fs-4"> + </span>&nbsp;Add Team
                  </button>
                </div>
                <hr className="bg-primary border-4" />
                {/* modal */}
                {/* <Modal
                  title={
                    editingEmployee ? "Edit Team Members" : "Add Team Members"
                  }
                  visible={modalVisible}
                  onOk={teamFormSubmit}
                  onCancel={() => {
                    setModalVisible(false);
                    setEditingEmployee(null);
                  }}
                  okText="Submit"
                  okButtonProps={{
                    style: { display: formDisabled ? "none" : "" },
                  }}
                  width={500}
                  centered
                >
                  <Form
                    form={form}
                    onFinish={teamFormSubmit}
                    layout="vertical"
                    disabled={formDisabled}
                  >
                    <p className="text-info text-decoration-underline">
                      Team Details
                    </p>
                    <Row gutter={[8, 4]}>
                      <Col span={12}>
                        <Form.Item
                          name="project_id"
                          label={<span className="text-info">Project</span>}
                          rules={[
                            {
                              required: true,
                              message: "Project Name is required",
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            placeholder="Select"
                            style={{ width: "100%" }}
                            className="rounded-2"
                          >
                            {projectData.map((project) => (
                              <Option
                                key={project.project_id}
                                value={project.project_id}
                                label={project.project_name}
                              >
                                {project.project_name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="employee_id"
                          label={
                            <span className="text-info">Team Members</span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Choose at least one memeber",
                            },
                          ]}
                        >
                          <Select
                            mode="multiple"
                            allowClear
                            placeholder="Select Team Members"
                            style={{ width: "100%" }}
                            className="rounded-2"
                          >
                            {allEmployeeData?.map((emp) => (
                              <Option
                                key={emp.employee_id}
                                value={emp.employee_id}
                                label={emp.name}
                              >
                                {emp.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Modal> */}
                <table className="table table-striped table-hover mt-5">
                  <thead>
                    <tr>
                      <th scope="col">S.No.</th>
                      <th scope="col">Project Name</th>
                      <th scope="col">Start Date / End Date </th>
                      <th scope="col">Team Members</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {modifiedTeamsData?.map((data, index) => {
                      return (
                        <tr key={data?.team_id}>
                          <th scope="row">{index + 1}</th>
                          <th scope="row">
                            <NavLink
                              to={`/view/project/tasks/${data.project_id}`}
                            >
                              <Tag color="gray" key={data.index}>
                                {data?.project_name}
                              </Tag>
                            </NavLink>
                          </th>
                          <th scope="row">
                            <Tag
                              color={"purple"}
                              key={data?.schedule_start_date}
                            >
                              {formatDate(data?.schedule_start_date)}
                            </Tag>
                            <Tag color={"purple"} key={data?.schedule_end_date}>
                              {formatDate(data?.schedule_end_date)}
                            </Tag>
                          </th>
                          <td className="text-capitalize">
                            {data?.employee_details?.map((item) => (
                              <NavLink
                                to={`/view/teammember/tasks/${item?.employee_id}/`}
                              >
                                <Tag color={"blue"} key={item?.index}>
                                  {item?.name}
                                </Tag>
                              </NavLink>
                            ))}
                          </td>

                          <td className="d-flex gap-2">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => openEmployeeEdit(data)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteTeamHandler(data.team_id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div>
                  <Title level={3} className="text-primary">
                    {isEditing ? "Edit Team Members" : "Add Team Members"}
                  </Title>
                  <Form onFinish={onFinish} form={form} layout="vertical">
                    <Row>
                      <Col span={8}>
                        <Form.Item
                          name="project_id"
                          label={<span className="text-info">Project</span>}
                          rules={[
                            {
                              required: true,
                              message: "Project Name is required",
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            placeholder="Select"
                            style={{ width: "100%" }}
                            className="rounded-2"
                          >
                            {projectData.map((project) => (
                              <Option
                                key={project.project_id}
                                value={project.project_id}
                                label={project.project_name}
                              >
                                {project.project_name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item label={<span className="text-info">Select Employees</span>}>
                      <Table
                        rowKey="employee_id"
                        rowSelection={rowSelection}
                        columns={columns}
                        
                        size={"small"}
                        dataSource={allEmployeeData}
                        // style={{ width: '60%',margin:"auto" }}

                      />
                    </Form.Item>
                    <Form.Item>
                      <Row>
                        <span
                          style={{
                            marginLeft: 0,
                            marginBottom: "0.2rem",
                          }}
                        >
                          {hasSelected
                            ? `Selected ${selectedRowKeys.length} items`
                            : ""}
                        </span>
                      </Row>
                      <Row>
                        <Button
                          type="primary"
                          htmlType="submit"
                          disabled={!hasSelected}
                        >
                          Submit
                        </Button>
                        <Button
                          type="primary"
                          danger
                          style={{ marginLeft: "1rem" }}
                          //   disabled={!hasSelected}
                          onClick={() => {
                            if (isEditing) {
                              console.log("cancelling editing form");
                              setSelectedRowKeys([]);
                              setIsEditing(false);
                              setIsAdding(true);
                              form.resetFields();
                            } else {
                              console.log("cancelling adding form");
                              setSelectedRowKeys([]);
                              setIsEditing(false);
                              setIsAdding(true);
                              form.resetFields();
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </Row>
                    </Form.Item>
                  </Form>
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

export default AssignTeam;
