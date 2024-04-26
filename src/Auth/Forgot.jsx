import React, { useState } from 'react'
// import '../App.css'
import axios from 'axios'
import { Button, Form, Input, Modal } from 'antd';
import { toast } from 'react-toastify';
import {forgotPasswordVerify, forgotPassword } from '../Config';
import { useNavigate } from 'react-router-dom';


export default function Forgot() {

  const [email, setEmail] = useState("")
  const [newpassword, setNewpassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [otp, setOtp] = useState("");

  let [modalVisible,SetModalVisible]=useState(false);
  let [loader,Setloader]=useState(false);

  let navigate=useNavigate();

  // send otp function
  const sendOtp = (event) => {
    event.preventDefault();

    if(email!=null && email!=''){
      const requestData = {email}
      Setloader(true)

      axios.post(`${forgotPassword}`, requestData)
      .then((result) => {
        if (result.status === 200 && result.data.status===true) {
          SetModalVisible(true)
          Setloader(false)
          toast.success('Mail Sent Successfully!');
        }else{
          toast.error('Invalid email');  
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })

    }else{

      toast.error('Please enter email');

    }
  
  }

  // otp verification function
  const verifyotp = (event) => {
    event.preventDefault();
    const requestData = { email, password:newpassword, password_confirm:confirmpassword, otp }
    console.log(requestData);
    axios.post(`${forgotPasswordVerify}`, requestData)
      .then((result) => {
        if (result.status === 200 && result.data.status==true) {
          toast.success('Password Changed Successfully!');
          navigate('/login')
        }else{
          toast.error(result.data.message)
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      })
  }
  return (
  <>
    <div className='d-flex justify-content-center align-items-center loginbg' style={{ height: '100vh' }}>
      <div className='col-3 form-container'>
      
        <p className='text-center' style={{ fontSize: '40px', fontWeight: '700', lineHeight: '40px' }}><span className='text-info'>Recover your</span><br /><span className='text-dark'>Account</span></p>
        <p className='textgrey text-center fst-italic text-secondary'>Upon entering the email you will receive an OTP to recover your account.</p>
        <div className="mb-3">
          <label htmlFor="exampleInput" className="form-label text-info">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" type="email" placeholder="email" id='exampleInput' aria-label="default input example" />
        </div>
        <div className="d-grid">

          <Button type='primary' loading={loader} className='bg-dark' htmlType='button' onClick={(e) => { sendOtp(e) }}>
          Send OTP
          </Button>
       
        </div>
        </div>
        </div>

        <Modal title='' visible={modalVisible}  
          onOk={verifyotp} 
          onCancel={() => { 
            SetModalVisible(false); 
          }}
          okText="Change Password"
          >
                  <div className="d-flex justify-content-center">
                  </div>
                  <p className='text-center' style={{ fontSize: '40px', fontWeight: '700', lineHeight: '40px' }}><span className='textcolorblue'>Recover your</span><br /><span className='textcolor'>account</span></p>
                  {/* <p className='textgrey text-center'>Upon entering the registered email address you will receive an OTP to recover your account.</p> */}
                 
                  <Form layout="vertical">
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password value={newpassword} onChange={(e) => setNewpassword(e.target.value)}/>
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The new password that you entered do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password value={confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)} />
                    
                  </Form.Item>

                  <Form.Item
                    className='otpinput'
                    name="otp"
                    label="Enter 4 Digit Code"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter OTP!',
                      },{
                        min:4,
                        message:'Please enter a valid otp'
                      }
                    ]}
                    hasFeedback
                  >
                    <Input type="number" className='otpinput' min="0"  maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value)}/>
                  </Form.Item>
                  </Form>            
          </Modal>
        
   </>
  )
}
