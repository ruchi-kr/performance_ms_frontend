import {
  ArrowUpOutlined,
  DeleteFilled,
  EditFilled,
  InfoCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { NavLink, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Cascader,
  Col,
  DatePicker,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  Tag,
  Modal,
  Tooltip,
  notification,
} from "antd";
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";

import { useEffect, useState } from "react";
import {
  getAllModules,
  createModule,
  editModule,
  deleteModule,
  getAllProjects,
} from "../Config.js";
import SideNavbar from "../Components/SideNavbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import styles from "./AddProjectPlan.module.css";
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
dayjs.extend(utc);
dayjs.extend(timezone);
const AddProjectPlan = () => {
  const [form] = Form.useForm();

  const [userData, setUserData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [projectCheckDates, setProjectCheckDates] = useState({
    schedule_start_date: null,
    schedule_end_date: null,
  });
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  // GET PROJECT LIST
  const [projectList, setProjectList] = useState([]);
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [moduleList, setModuleList] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const { project_id } = useParams();
  const getProjects = async (value) => {
    try {
      const result = await axios.get(`${getAllProjects}`);

      setProjectList(result.data);
      console.log("project list", result.data);
    } catch (error) {
      console.log("Error fetching project list data", error);
    }
  };
  useEffect(() => {
    getProjects();
    fetchAll();
  }, []);

  const getModuleListHandler = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/getAllModule/?page=${pagination.currentPage}&pageSize=${pagination.pageSize}&search=${search}`
      );
      console.log("response", response);
      setModuleList(response.data.results);
      if (response.data.results !== undefined) {
        const {
          totalRecords,
          totalPages,
          currentPage,
          nextPage,
          prevPage,
          pageSize,
        } = response.data.pagination;

        setPagination((prevState) => ({
          ...prevState,
          totalRecords: totalRecords,
          totalPages: totalPages,
          pageSize: pageSize,
          currentPage: currentPage,
          nextPage: nextPage,
          prevPage: prevPage,
        }));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getModuleListHandler();
  }, [pagination.currentPage, pagination.pageSize]);

  // search functionality

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      onSearch();
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const onSearch = async () => {
    if (search === null || search === undefined) return;

    getModuleListHandler();
  };
  const fetchAll = async () => {
    setLoading(true);
    try {
      // const res = await axios.get(``);
      const res = [];
      console.log("data", res.data);
      setLoading(false);
      setUserData(res.data.data);
      const {
        totalRecords,
        totalPages,
        currentPage,
        nextPage,
        prevPage,
        pageSize,
      } = res.data.pagination;

      setPagination((prevState) => ({
        ...prevState,
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: pageSize,
        currentPage: currentPage,
        nextPage: nextPage,
        prevPage: prevPage,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  const moduleChangeHandler = (value) => {
    console.log(" module value", value);
    setSelectedModuleId(value);
  };
  const handleEdit = (record) => {
    console.log("handle edit", record);
    setIsEditing(true);
    console.log("type of user active", moment(record.from_date));
    getProjectStartEndDate(record.project_id);
    form.setFieldsValue({
      module_id: record.module_id,
      module_name: record.module_name,
      project_id: record.project_id,
      from_date: dayjs.utc(record.from_date).tz("Asia/Kolkata"),
      to_date: dayjs(record.to_date),
      status: record.status,
    });
    setIsEditing(true);
  };

  const handleDelete = async (record) => {
    console.log("record to delete", record);
    confirm({
      title: "Are You sure you want to delete the record!",
      icon: <ExclamationCircleFilled />,
      // content: "Be sure before deleting, this process is irreversible!",
      centered: true,
      async onOk() {
        try {
          await axios.delete(
            `http://localhost:8000/api/admin/deleteModule/${record.module_id}`
          );
          notification.success({
            message: "Success",
            description: "Record deleted Successfully.",
          });
          getModuleListHandler();
        } catch (error) {
          // console.error("Error Adding project:", error);
          notification.error({
            message: "Failed",
            description: `${error}`,
          });
        }
      },
      onCancel() {},
    });
  };

  // console.log("selctedUser", selectedUser);
  const onFinish = async (values) => {
    if (isAdding && !isEditing) {
      try {
        console.log("onFinish before sending values adding", values);
        await axios.post("http://localhost:8000/api/admin/addModule", values);
        getModuleListHandler();
        handleReset();
        notification.success({
          message: "Module Added.",
          description: "Successfully",
        });
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Failed to add Module.",
          description: "Try Again !",
        });
      }
    }

    if (isEditing && !isAdding) {
      console.log("values inside edit!!!!", values);
      try {
        await axios.patch(
          `http://localhost:8000/api/admin/editModule/${values.module_id}`,
          values
        );
        handleReset();
        getModuleListHandler(); // Refresh the zone list after update

        notification.success({
          message: "Success",
          description: "Record updated.",
        });
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Failed",
          description: "Unable to update record",
        });
      }
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    notification.error({
      message: "Invalid Input!",
      description: "Please provide valid input",
    });
  };

  const handleReset = () => {
    form.resetFields();
    setSearch("");
    setIsAdding(false);
    setIsResetPassword(false);
    setIsEditing(false); // Reset the form fields
  };

  //Pagination
  const handlePageChange = (page) => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };

  const pageSizeChange = (current, pageSize) => {
    setPagination((prevState) => ({
      ...prevState,
      pageSize: pageSize,
    }));
  };
  const handleSortChange = () => {
    // Toggle sorting order when the button is clicked
    setSortOrder((prevOrder) => {
      if (prevOrder === "ASC") {
        return "DESC";
      }
      return "ASC";
    });
  };
  const getProjectStartEndDate = (value) => {
    const project = projectList?.find(
      (project) => project.project_id === value
    );
    console.log("project selected", project);
    setProjectCheckDates({
      schedule_start_date: project?.schedule_start_date,
      schedule_end_date: project?.schedule_end_date,
    });
    // console.log("dates object", projectCheckDates);
  };
  const disabledStartDate = (current) => {
    const startDate = projectCheckDates.schedule_start_date
      ? moment(projectCheckDates.schedule_start_date)
      : null;
    const endDate = projectCheckDates.schedule_end_date
      ? moment(projectCheckDates.schedule_end_date)
      : null;
    // Disable dates that are before the start date or after the end date
    console.log("disabdwjkdkawd", startDate);
    return (
      current &&
      ((startDate && current < startDate.startOf("day")) ||
        (endDate && current > endDate.endOf("day")))
    );
  };

  const disabledEndDate = (current, from_dateValue) => {
    if (!from_dateValue) {
      // If from_date is not selected yet, disable all dates
      return true;
    }

    const startDate = projectCheckDates.schedule_start_date
      ? moment(projectCheckDates.schedule_start_date)
      : null;
    const endDate = projectCheckDates.schedule_end_date
      ? moment(projectCheckDates.schedule_end_date)
      : null;
    const from_dateMoment = moment(from_dateValue);
    // Disable dates that are before the selected from_dateMoment,
    return (
      current &&
      ((from_dateMoment && current < from_dateValue.startOf("day")) ||
        (endDate && current > endDate.endOf("day")))
    );
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "module_id",
      key: "module_id",
      render: (_, record, index) => {
        // Calculate the serial number based on the current page and the index of the item
        return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: (
        <div>
          Module Name
          {/* {
            <ArrowUpOutlined
              style={{ marginLeft: 12, fontSize: "1rem" }}
              onClick={handleSortChange}
              rotate={sortOrder === "ASC" ? 0 : 180}
            />
          } */}
        </div>
      ),
      dataIndex: "module_name",
      key: "module_name",
    },

    {
      title: "Schd. St. Dt.",
      dataIndex: "from_date",
      key: "from_date",
      render: (text) => moment(text).utcOffset("+05:30").format("DD/MM/YYYY"),
    },
    {
      title: "Schd. End Dt.",
      dataIndex: "to_date",
      key: "to_date",
      render: (text) => moment(text).utcOffset("+05:30").format("DD/MM/YYYY"),
    },

    {
      title: "Status  ",
      dataIndex: "status",
      key: "status",
      align: "center",

      // render: (text) => (text ? "Active" : "Inactive"),
    },

    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: 100,
      render: (_, record) => (
        <div>
          <EditFilled
            type="primary"
            style={{
              marginRight: "9px",
              color: "green",
              textAlign: "center",
            }}
            onClick={() => handleEdit(record)}
          />
          <DeleteFilled
            type="primary"
            style={{ color: "red" }}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            
            <div className="row my-5">
             
              <Row justify="end">
                <Col>
                <label style={{ marginBottom: "10px" }}>Module Name</label>
                  <Search
                    placeholder="Search by Module Name"
                    onSearch={onSearch}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    enterButton
                    style={{ marginBottom: "16px" }}
                    className={styles.searchStyle}
                  />
                </Col>
              </Row>
              <Row>
                <NavLink
                  to={`/addmoduletasks/?project_id=${project_id}&module_id=${selectedModuleId}`}
                  className="btn btn-sm btn-info d-flex align-items-center justify-content-center"
                >
                  <span className="fs-4"> + </span>&nbsp;Add Plan
                </NavLink>
              </Row>
              <Table
                rowKey={(record) => record.module_id}
                columns={columns}
                dataSource={moduleList}
                loading={loading}
                bordered
                size="small"
                pagination={false}
                // scroll={{ y: false }} // Disable vertical scroll
                style={{
                  marginBottom: "1rem",
                }}
              />

              <Pagination
                current={pagination.currentPage}
                total={pagination.totalRecords}
                pageSize={pagination.pageSize}
                onChange={handlePageChange}
                showLessItems={false}
                onShowSizeChange={pageSizeChange}
                showQuickJumper={true}
                showPrevNextJumpers={true}
                showSizeChanger={true}
                onPrev={() => handlePageChange(pagination.prevPage)}
                onNext={() => handlePageChange(pagination.nextPage)}
                style={{
                  marginBottom: "2rem",
                }}
              />

              {!isResetPassword && (
                <Row justify="center" align="middle">
                  <Col>
                    {!isAdding && !isEditing && (
                      <Button
                        onClick={() => setIsAdding(true)}
                        type="primary"
                        style={{ minWidth: "10rem" }}
                      >
                        <div>
                          <PlusOutlined
                            style={{
                              marginRight: "0.5rem",
                            }}
                          />
                          Add Module
                        </div>
                      </Button>
                    )}
                  </Col>
                  <Col align="center" style={{ minWidth: "100%" }}>
                    {(isAdding || isEditing) && (
                      <Card
                       
                        className={`${styles.card} `}
                      >
                        {isAdding ? <h4>Add Module</h4> : <h4>Edit Module</h4>}
                        {(isAdding || isEditing) && (
                          <Form
                            colon={false}
                            layout="vertical"
                            labelAlign="left"
                            form={form}
                            name="basic"
                            // className="login-form"
                            // initialValues={{
                            //   zone_name: isEditing ? newZoneDesc : "",
                            // }}
                            labelCol={{
                              span: 6,
                            }}
                            wrapperCol={{
                              span: 18,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="on"
                            style={{ paddingTop: "2rem" }}
                          >
                            <Row gutter={16}>
                              <Col span={24}>
                                <Form.Item
                                  label="Module Id"
                                  name="module_id"
                                  hidden
                                  // style={{ display: "none" }} // Hide the Form.Item
                                  // style={{ maxWidth: "50%" }}
                                >
                                  <Input placeholder={editUserId} />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item
                                  label="Project"
                                  name="project_id"
                                  // style={{ maxWidth: "50%" }}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please select project !",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="Select Project"
                                    allowClear={true} // Disable the clear button
                                    // className={styles.cascaderStyle}
                                    onChange={getProjectStartEndDate}
                                  >
                                    {projectList.map((project) => (
                                      <Option
                                        key={project.project_id}
                                        value={project.project_id}
                                      >
                                        {project.project_name}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                            </Row>

                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item
                                  label="Schd. Start Date"
                                  name="from_date"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Please input schedule start date !",
                                    },
                                  ]}
                                  // style={{ maxWidth: "50%" }}
                                >
                                  <DatePicker
                                    disabledDate={disabledStartDate}
                                    format="DD/MM/YYYY"
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  label="Schd. End. Date"
                                  name="to_date"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Please input schedule end date !",
                                    },
                                  ]}
                                  // style={{ maxWidth: "50%" }}
                                >
                                  <DatePicker
                                    disabledDate={(current) =>
                                      disabledEndDate(
                                        current,
                                        form.getFieldValue("from_date")
                                      )
                                    }
                                    format="DD/MM/YYYY"
                                  />
                                </Form.Item>
                              </Col>

                              <Col span={12}>
                                <Form.Item
                                  label="Module Name"
                                  name="module_name"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter module name !",
                                    },
                                  
                                    {
                                      pattern: /^[&,.\-_\w\s]{1,50}$/,
                                      message:
                                        "Please enter a valid Module Name (up to 50 characters, only &, , ., -, _ special characters are allowed)",
                                    },
                                  ]}
                                 
                                >
                                  <Input
                                    suffix={
                                      <Tooltip title="Please input a valid module name">
                                        <InfoCircleOutlined
                                          style={{
                                            color: "rgba(0,0,0,.45)",
                                          }}
                                        />
                                      </Tooltip>
                                    }
                                   
                                    placeholder="module name"
                                    style={{ marginLeft: "4" }}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item
                                  label="Status"
                                  name="status"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please select Status !",
                                    },
                                  ]}
                                  // style={{ maxWidth: "50%" }}
                                >
                                  <Select
                                    options={[
                                      { value: "scrapped", label: "scrapped" },
                                      { value: "ongoing", label: "ongoing" },
                                      {
                                        value: "completed",
                                        label: "completed",
                                      },
                                    ]}
                                    allowClear="true"
                                    // onChange={handleChange}
                                    placeholder="Status "
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Row justify="center">
                              <Col>
                                <Form.Item>
                                  <div className={styles.buttonStyle2}>
                                    <Button
                                      type="primary"
                                      danger
                                      htmlType="button"
                                      onClick={handleReset}
                                      // className={styles["login-form-button"]}
                                      style={{
                                        minWidth: "11rem",
                                        marginRight: "1rem",
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="primary"
                                      htmlType="submit"
                                      // className={styles["login-form-button"]}
                                      style={{ minWidth: "11rem" }}
                                    >
                                      {isAdding ? "Add" : "Update"}
                                    </Button>
                                  </div>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Card>
                    )}
                  </Col>
                </Row>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddProjectPlan;
