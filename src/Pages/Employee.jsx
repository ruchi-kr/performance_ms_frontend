import React, { useState, useEffect } from 'react';
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import axios from 'axios';
import SideNavbar from '../Components/SideNavbar'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

const Employee = () => {

  const [allTaskRecords, setAllTaskRecords] = useState([])

  const [paymentRecords, setPaymentRecords] = useState([{ description: '', stage: '', percent: '', amount: '' }]);

  const addPayment = () => {
    setPaymentRecords([...paymentRecords, { description: '', stage: '', percent: '', amount: '' }]);
  };


  // const handlePaymentChange = (index, event) => {
  //   const { name, value } = event.target;
  //   const newPayments = paymentRecords.map((payment, idx) => {
  //     if (idx === index) {
  //       let updatedPayment = { ...payment, [name]: value };
  
  //       if (name === 'percent') {
  //         const baseValue = parseFloat(formData.implemented_fees);
  //         if (!isNaN(baseValue)) {
  //           const newAmount = (baseValue * parseFloat(value)) / 100;
  //           updatedPayment.amount = newAmount.toFixed(2);
  //         } else {
  //           // Handle the case where formData.implemented_fees is not a valid number
  //         }
  //       } else if (name === 'amount') {
  //         const baseValue = parseFloat(formData.implemented_fees);
  //         if (!isNaN(baseValue)) {
  //           const amount = parseFloat(value);
  //           const per = (amount * 100) / baseValue;
  //           updatedPayment.percent = per.toFixed(2);
  //         } else {
  //           // Handle the case where formData.implemented_fees is not a valid number
  //         }
  //       }
  
  //       return updatedPayment;
  //     }
  //     return payment;
  //   });
  
  //   setPaymentRecords(newPayments);
  // };

 

  const deletePayment = (index) => {
    const newPayments = paymentRecords.filter((_, idx) => idx !== index);
    setPaymentRecords(newPayments);
  };
 // delete task function
 const deleteTask = async (id) => {                            //creating a function for deleting data
  try {
      await axios.delete(`${deleteTask}` + id)          // deleting data from server
      window.location.reload()                             //reloading the page
  } catch (err) {
      console.log("error deleting task", err);                                 //if error occurs then log it
  }
}

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
                      <th className="form-label lightgreen fs-6">Project
                        <span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label lightgreen fs-6">Task
                        <span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label lightgreen fs-6">Start time
                        <span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label lightgreen fs-6">End time
                        <span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label lightgreen fs-6">Status
                        <span style={{ color: "red" }}>*</span>
                      </th>
                      <th className="form-label lightgreen fs-6">Remarks
                        <span style={{ color: "red" }}>*</span>
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
                    {allTaskRecords.map((record, index) => (
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

                            // value={typeof record.percent == 'number' ? record.percent.toFixed(2) : record.percent}
                            // onChange={(e) => handlePaymentChange(index, e)}
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

// export default function PaymentTerms({ paymentRecords, addPayment, formdisabled, handlePaymentChange, deletePayment }) {

// }


export default Employee