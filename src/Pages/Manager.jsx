import React, { useState, useEffect } from 'react'
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import axios from 'axios';
import SideNavbar from '../Components/SideNavbar'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

const Manager = () => {

  const [allEmployeeRecords, setAllEmployeeRecords] = useState([]);
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
                  <h3 className='text-primary'>Dalily Tracking Sheet</h3>
                </div>
                <hr className='bg-primary border-4' />
                <table className="table table-bordered table-hover table-responsive-sm mt-5">
                  <thead>
                    <tr>
                      <th className="form-label lightgreen fs-6">S.No.</th>
                      <th className="form-label lightgreen fs-6">Employee Name
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </th>
                      <th className="form-label lightgreen fs-6">Email
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </th>
                      <th className="form-label lightgreen fs-6">Projects
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </th>
                      <th className="form-label lightgreen fs-6">Start time
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </th>
                      <th className="form-label lightgreen fs-6">End time
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </th>
                      <th className="form-label lightgreen fs-6">Status
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </th>
                      <th className="form-label lightgreen fs-6">Remarks
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </th>
                      <th className="form-label lightgreen fs-6">Add Remarks
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </th>
                      <th>
                        <a className="">
                          <PlusOutlined
                          // onClick={addTask}
                          />
                        </a>
                      </th>


                    </tr>
                  </thead>
                  <tbody>
                    {allEmployeeRecords.map((record, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>

                        <td>
                          <input
                            type="text"
                            name="description"
                            className="form-control"
                            value={record.description}

                            // onChange={(e) => handlePaymentChange(index, e)}
                            placeholder=""
                            required
                          />
                        </td>

                        <td>

                          <select name="stage" id=""
                            value={record.stage}

                            className="form-control"
                            // onChange={(e) => handlePaymentChange(index, e)}
                            required
                          >
                            <option value="">Select</option>
                            <option value="1">Contract Signed</option>
                            <option value="2">Site Visit</option>
                            <option value="3">CC Review</option>
                            <option value="3">RFI</option>
                          </select>

                        </td>

                        <td>
                          <input
                            type="number"
                            name="percent"
                            // disabled={formdisabled}
                            className="form-control"
                            placeholder="0"
                            required
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            name="amount"
                            value=""
                            className="form-control"
                            // onChange={(e) => handlePaymentChange(index, e)}
                            placeholder="0"
                          />
                        </td>
                        <td>
                          <CloseOutlined
                          // onClick={() => deleteTask(data.task_id)} 
                          />
                        </td>
                      </tr>
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

export default Manager