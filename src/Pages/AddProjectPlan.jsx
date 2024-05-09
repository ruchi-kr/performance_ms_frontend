import {
  ArrowUpOutlined,
  DeleteFilled,
  EditFilled,
  InfoCircleOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
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
  Tooltip,
  notification,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  getAllModules,
  createModule,
  editModule,
  deleteModule,
  getAllProjects,
} from "../Config.js";
import styles from "./AddProjectPlan.module.css";
const { Search } = Input;
const { Option } = Select;

const AddProjectPlan = () => {
  const [form] = Form.useForm();
  const [formResetPassword] = Form.useForm();
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
  // GET PROJECT LIST
  const [projectList, setProjectList] = useState([]);
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
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
  }, []);

  // const [userData, setUserData] = useState({
  //   fk_zone_id: "",
  //   fk_circle_id: "",
  //   fk_division_id: "",
  //   user_designation: false,
  //   user_name: "",
  //   user_mobile: "",
  //   user_email: "",
  //   user_active: false,
  // });

  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    fetchAll();
  }, [pagination.currentPage, pagination.pageSize, sortOrder]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      onSearch();
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // Fetch cascader data from API zone
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from API using Axios and async/await
        const response = await axios.get(
          "http://localhost:8080/api/admin/zone/?pageSize=10000"
        );
        const formattedData = response.data.data.map((z) => ({
          value: z.zone_id,
          label: z.zone_name,
        }));
        setZoneCascaderOptions(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admAddProjectPlan/?name=${search}&page=${pagination.currentPage}&pageSize=${pagination.pageSize}&sortBy=user_name&sortOrder=${sortOrder}`
      );
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

  const handleEdit = (record) => {
    console.log("handle edit", record);
    setIsEditing(true);
    console.log("type of user active", typeof Boolean(record.user_active));
    form.setFieldsValue({
      user_id: record.user_id,
      user_name: record.user_name,
      user_email: record.user_email,
      user_type: Boolean(record.user_type) === true ? [true] : [false],
      // user_password: record.user_password,
      contact_person: record.contact_person,
      fk_zone_id: record.fk_zone_id,
      fk_circle_id: record.fk_circle_id,
      fk_division_id: record.fk_division_id,
      fk_designation_id: record.fk_designation_id,
      user_mobile: record.user_mobile,
      user_active: Boolean(record.user_active) === false ? [false] : [true],
    });

    setIsEditing(true);
  };

  const handleDelete = async (record) => {};

  // console.log("selctedUser", selectedUser);
  const onFinish = async (values) => {
    console.log("onFinish before sending values", values);
    // console.log("type of active", typeof values.user_active[0]);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    notification.error({
      message: "Error in user Add/Edit !",
      description: "Provide valid input",
    });
  };

  const handleReset = () => {
    // console.log("form", form);
    // console.log("isAdding", isAdding);
    // console.log("isEditing", isEditing);
    // console.log("newZoneDesc", newZoneDesc);
    // console.log("editZoneId", editZoneId);
    form.resetFields();
    formResetPassword.resetFields();

    setSearch("");
    setIsAdding(false);
    setIsResetPassword(false);
    setIsEditing(false); // Reset the form fields
  };

  // search functionality
  const onSearch = async () => {
    if (search === null || search === undefined) return;
    // setLoading(true);
    fetchAll();
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
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Schd. End Dt.",
      dataIndex: "to_date",
      key: "to_date",
    },

    {
      title: "Status  ",
      dataIndex: "status",
      key: "status",
      align: "center",

      // render: (text) => (text ? "Active" : "Inactive"),
      render: (text) =>
        text ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Email",
      dataIndex: "user_email",
      key: "user_email",
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
      <Card className={styles.mainCard}>
        <h2>Module Master</h2>
        <br />
        <Row justify="end">
          <Col>
            <Search
              placeholder="Search Module Name"
              onSearch={onSearch}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              enterButton
              style={{ marginBottom: "16px" }}
              className={styles.searchStyle}
            />
          </Col>
        </Row>
        <Table
          rowKey={(record) => record.module_id}
          columns={columns}
          dataSource={userData}
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
          showLessItems={true}
          onShowSizeChange={pageSizeChange}
          showQuickJumper={false}
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
                  style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)" }}
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
                            label="Schd. End Date"
                            name="to_date"
                            rules={[
                              {
                                required: true,
                                message: "Please input schedule end date !",
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
                            label="Schd. St. Date"
                            name="from_date"
                            rules={[
                              {
                                required: true,
                                message: "Please input schedule start date !",
                              },
                            ]}
                            // style={{ maxWidth: "50%" }}
                          >
                            <DatePicker
                              disabledDate={(current) =>
                                disabledEndDate(
                                  current,
                                  form.getFieldValue("to_date")
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
                                message: "Please input module name!",
                              },
                              {
                                pattern: /^[a-zA-Z0-9\s-_]+$/,
                                message: "Please enter a valid name !",
                              },
                            ]}
                            // style={{ maxWidth: "50%" }}
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
                              maxLength={10}
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
                                { value: "completed", label: "completed" },
                              ]}
                              defaultValue={["ongoing"]}
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
      </Card>
    </>
  );
};

export default AddProjectPlan;
