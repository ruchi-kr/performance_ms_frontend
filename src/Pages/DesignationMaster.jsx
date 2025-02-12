import React, { useState, useEffect } from "react";
import SideNavbar from "../Components/SideNavbar.jsx";
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import {
  getAllDesignation,
  createDesignation,
  editDesignation,
  deleteDesignation,
  getDesignationList,
  CONFIG_OBJ,
} from "../Config.js";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Pagination,
  Spin,
  Button,
} from "antd";
import {
  ArrowUpOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const { Search } = Input;

const DesignationMaster = () => {
  // // for employee dropdown
  // const [allEmployeeData, setAllEmployeeData] = useState(null);
  // // get all projects function

  // useEffect(() => {
  //   const getAllEmployeesHandler = async () => {
  //     try {
  //       const response = await axios.get(`${getAllEmployeeslist}`);
  //       setAllEmployeeData(response.data);
  //       console.log("employee details data", response.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getAllEmployeesHandler();
  // }, []);

  // search by designation
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  // const [designationList, setDesignationList] = useState([]);
  const [designation, setDesignation] = useState("");
  // const getDesignation = async (value) => {
  //     try {
  //         const result = await axios.get(`${getDesignationList}`);
  //         setDesignationList(result.data);
  //         console.log("Designation list", result.data);
  //     } catch (error) {

  //         console.log('Error fetching Designation list data', error)
  //     }
  // }
  // useEffect(() => {
  //     getDesignation();
  // }, []);
  // const handleDesignationSearch = (value) => {
  //     setDesignation(value);
  //     // Setloader(true);
  // };
  // get all manager function with pagination
  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allManagerData, setAllManagerData] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const [sortOrder, setSortOrder] = useState("ASC");

  const getAllDesignationHandler = async () => {
    try {
      const response = await axios.get(
        `${getAllDesignation}/?page=${pagination.currentPage}&pageSize=${pagination.pageSize}&sortOrder=${sortOrder}&sortBy=designation_name&name=${designation}`,CONFIG_OBJ
      );
      setAllManagerData(response.data.data);
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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [designation]);
  const onSearch = async () => {
    if (designation === null || designation === undefined) return;
    getAllDesignationHandler(currentPage);
  };

  useEffect(() => {
    getAllDesignationHandler(currentPage);
  }, [ pagination.currentPage, pagination.pageSize, sortOrder]);

  // for adding another
  const handleAddAnother = () => {
    managerForm.validateFields().then(async (values) => {
      console.log(values);
      try {
        const requestData = {
          ...values,
        };
        const url = `${createDesignation}`;
        const response = await axios.post(url, requestData,CONFIG_OBJ);
        if (response.status === 200) {
          toast.success("Designation Added Successfully!");

          console.log("response added", response.data);
          managerForm.resetFields();
          setModalVisible(true);
          getAllDesignationHandler();
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
      }
    });
  };

  // create manager
  const managerFormSubmit = (values) => {
    managerForm
      .validateFields()
      .then(async (values) => {
        try {
          const requestData = {
            ...values,
            id: editingManager ? editingManager.designation_id : null,
          };
          const url = editingManager
            ? `${editDesignation}/${editingManager.designation_id}`
            : `${createDesignation}`;
          const response = await axios.post(url, requestData,CONFIG_OBJ);
          if (response.status) {
            if (editingManager && editingManager.designation_id !== null) {
              toast.success("Designation Updated Successfully!");
            } else {
              toast.success("Designation Added Successfully!");
            }
            console.log("response added", response.data);
            managerForm.resetFields();
            setModalVisible(false);
            getAllDesignationHandler();
          } else {
            console.log(response.data.message);
            // toast.error(response.data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.error);
        }
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const deleteManagerHandler = async (id) => {
    try {
      const response = await axios.delete(`${deleteDesignation}` + id,CONFIG_OBJ);
      if (response.status === 200) {
        // Manager deleted successfully
        console.log(response.data);
        toast.success(response.data.msg);
        window.location.reload();
      } else if (response.status === 400) {
        // Manager is assigned to an employee
        console.log("error Designation deletion", response.error);
        toast.error(response.data.error);
      }
    } catch (err) {
      console.log("error deleting Designation", err);
      // Display a generic error message if there's an unexpected error
      toast.error(err.response.data.error);
      // toast.error(response.data.error);
    }
  };

  // edit manager function

  const [managerForm] = Form.useForm();
  let [managerId, setManagerId] = useState(null);
  let [modalVisible, setModalVisible] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [viewManager, setViewManager] = useState(null);

  const managerData = {
    designation_id: "",
    designation_name: "",
  };

  const openManagerAdd = () => {
    window.scrollTo(0, 0);
    setModalVisible(true);
    setEditingManager(null);
    setViewManager(null);
    // SetProjectId(null);
    managerForm.setFieldsValue(managerData);
    setFormDisabled(false);
  };

  const openManagerView = async (manager) => {
    setViewManager(manager);
    setModalVisible(true);
    setFormDisabled(true);
    managerForm.setFieldsValue({
      designation_id: manager.designation_id,
      designation_name: manager.designation_name,
    });
  };

  const openManagerEdit = async (manager) => {
    setEditingManager(manager);
    setFormDisabled(false);
    console.log("editing designation", manager);
    setModalVisible(true);
    managerForm.setFieldsValue({
      designation_id: manager.designation_id,
      designation_name: manager.designation_name,
    });
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

                <div className="d-flex justify-content-between">
                  <h3 className="text-primary">Designation Details</h3>
                  <button
                    className="btn btn-sm btn-info d-flex align-items-center"
                    onClick={openManagerAdd}
                  >
                    <span className="fs-4"> + </span>&nbsp;Add Designation
                  </button>
                </div>
                <hr className="bg-primary border-4" />
                <div className=" col-2 flex-end">
                  <label className="text-capitalize fw-bold text-info">
                    designation
                  </label>

                  <Search
                    placeholder="search by designation"
                    allowClear
                    onSearch={onSearch}
                    style={{
                      width: 200,
                    }}
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                  {/* {loading ? <Spin fullscreen /> : null} */}
                </div>

                {/* modal */}
                <Modal
                  title={
                    editingManager
                      ? "Edit Designation"
                      : viewManager
                      ? "View Designation"
                      : "Add Designation"
                  }
                  open={modalVisible}
                  onOk={managerFormSubmit}
                  onCancel={() => {
                    setModalVisible(false);
                    setEditingManager(null);
                    setViewManager(null);
                  }}
                  okText="Submit & Close"
                  okButtonProps={{
                    style: { display: formDisabled ? "none" : "" },
                  }}
                  width={500}
                  centered
                >
                  <Form
                    form={managerForm}
                    onFinish={managerFormSubmit}
                    layout="vertical"
                    disabled={formDisabled}
                  >
                    <Row gutter={[8, 4]}>
                      <Col span={12}>
                        <Form.Item
                          name="designation_name"
                          label={
                            <span className="text-info mt-3">Designation</span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Designation is required",
                            },
                            {
                              pattern: /^[/&,.\-_\w\s]{1,50}$/,
                              message:
                                "Please enter a valid Designation Name (up to 50 characters, only /, &, , ., -, _ special characters are allowed)",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  {!editingManager && !viewManager ? (
                    <>
                      <Button onClick={handleAddAnother} type="primary">
                        Add Another
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                </Modal>
                {/* table */}
                <table className="table table-striped table-hover mt-5">
                  <thead>
                    <tr>
                      <th scope="col">S.No.</th>
                      <th scope="col">
                        <div className="d-flex">
                          <div>Designation Name</div>

                          <ArrowUpOutlined
                            style={{ marginLeft: 18, fontSize: "1rem" }}
                            onClick={handleSortChange}
                            rotate={sortOrder === "ASC" ? 0 : 180}
                          />
                        </div>
                      </th>

                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {allManagerData.map((data, index) => {
                      return (
                        <tr key={data.designation_id}>
                          <th scope="row">
                            {(pagination.currentPage - 1) *
                              pagination.pageSize +
                              index +
                              1}
                          </th>
                          {/* <td>{data.reporting_manager_id}</td> */}
                          {/* <td className='text-capitalize'>{data.employee_name}</td> */}
                          <td className="text-capitalize">
                            {data.designation_name}
                          </td>
                          {/* <td className='text-capitalize'>{data.department}</td> */}
                          {
                            //  index !== 0 && index !== 1 ? (
                            data.designation_name !== "ceo" &&
                            data.designation_name !== "project manager" ? (
                              <>
                                <td className="">
                                  <EyeOutlined
                                    onClick={() => openManagerView(data)}
                                    style={{
                                      color: "blue",
                                      marginRight: "1rem",
                                    }}
                                  />
                                  <EditOutlined
                                    onClick={() => openManagerEdit(data)}
                                    style={{
                                      color: "blue",
                                      marginRight: "1rem",
                                    }}
                                  />
                                  <DeleteOutlined
                                    onClick={() =>
                                      deleteManagerHandler(data.designation_id)
                                    }
                                    style={{
                                      color: "red",
                                      marginRight: "1rem",
                                    }}
                                  />
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="">
                                  <EyeOutlined
                                    onClick={() => openManagerView(data)}
                                    style={{ color: "blue" }}
                                  />
                                </td>
                              </>
                            )
                          }
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* <tfoot > */}
                  {/* <tr className='row' > */}
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

                  {/* </tr> */}
                  {/* </tfoot> */}
                </table>
                <Row align={"end"}>
                  <Col>
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
                  </Col>
                </Row>

                <div className="row float-right">
                  {/* <nav
                    aria-label="Page navigation example"
                    className="d-flex align-self-end mt-3"
                  >
                    <ul className="pagination">
                      <li className="page-item">
                        <a
                          className="page-link"
                          href="#"
                          aria-label="Previous"
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <span aria-hidden="true">«</span>
                        </a>
                      </li>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                        >
                          <a
                            className="page-link"
                            href="#"
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </a>
                        </li>
                      ))}
                      <li className="page-item">
                        <a
                          className="page-link"
                          href="#"
                          aria-label="Next"
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <span aria-hidden="true">»</span>
                        </a>
                      </li>
                    </ul>
                  </nav> */}
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

export default DesignationMaster;
