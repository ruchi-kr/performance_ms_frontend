import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Formik } from 'formik';
import LoginSchema from '../Schema/LoginSchema';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loginUrl } from '../Config';
import { useDispatch } from 'react-redux'; 

export default function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginForm = {
        email_id: '',
        password: '',
    };

    const handleSubmit = async (payload, { setSubmitting }) => {

        try {
            const result = await axios.post(`${loginUrl}`, payload);

            if (result.status === 200) {
                console.log("login successful");
                toast.success('Login Successfully');

                sessionStorage.setItem("token", result.data.result.token);
                sessionStorage.setItem('user', JSON.stringify(result.data.result.user));
                sessionStorage.setItem('id', JSON.stringify(result.data.result.user.id));
                sessionStorage.setItem('email_id', JSON.stringify(result.data.result.user.email_id));
                sessionStorage.setItem('user_type', JSON.stringify(result.data.result.user.user_type));
                sessionStorage.setItem('role', JSON.stringify(result.data.result.user.role));
                sessionStorage.setItem('status', JSON.stringify(result.data.result.user.status));

                dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.result.user });
                console.log("token set successfully", result.data.result);
                // window.location.reload();
                const role = result.data.result.user.role;
                const status = result.data.result.user.status
                console.log("role", role)
                if (role === "manager" && status === "active") {
                    navigate('/assignteam');
                }
                else if (role === "employee" && status === "active") {
                    navigate('/employee');
                    
                }
                else if (role == "management" && status === "active") {
                    navigate('/assignteam');
                }
                else if (status !== "active") {
                    navigate('/accessdenied');
                }
                else {
                    navigate('/homepage');
                }

                console.log("navigated successfully");
                // window.location.reload();
            } else {

                // toast.error(result.data.error);

            }

        } catch (error) {
            toast.error(error.response.data.error);
        }
        setSubmitting(false);
    };

    return (
        <div className="container-fluid loginbg" style={{ height: '100vh' }}>
            <div className="row h-100">

                <div className='col-lg-6 form-container col-xl-4 col-12 col-md-8 p-5 rounded-4 blurloginbox mx-auto my-auto shadow-sm'>
                    <p className='text-center fw-bolder' style={{ fontSize: '40px', fontWeight: '700', lineHeight: '60.51px' }}>
                        <span className='fw-bolder text-dark'>Welcome</span><br />
                        {/* <span className='textcolor fw-bolder'>Earthood</span> */}
                    </p>
                    <h5 className='text-info text-center fw-bolder'>Login to your account</h5>
                    <Formik
                        initialValues={loginForm}
                        validationSchema={LoginSchema}
                        onSubmit={handleSubmit}
                        validateOnChange={true}
                        validateOnBlur={true}
                    >
                        {({ handleSubmit, isSubmitting }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email_id" className="form-label text-info">Email</label>
                                    <Field type="text" name="email_id" id="email_id" className="form-control" />
                                    <ErrorMessage name="email_id" component="div" className="error" style={{ color: "red" }} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label text-info">Password</label>
                                    <Field type="password" name="password" id="password" className="form-control" />
                                    <ErrorMessage name="password" component="div" className="error" style={{ color: "red" }} />
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Link to="/forgot" className="text-dark text-end text-decoration-underline mb-3">Forgot Password?</Link>
                                </div>
                                <div className="d-grid">
                                    <button className="btn btn-success border-0 bg-dark text-white" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Signing...' : 'Login'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}