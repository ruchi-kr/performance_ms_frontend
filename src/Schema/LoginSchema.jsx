import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email_id: Yup.string()
    // .min(4, 'Username must be at least 4 characters')
    // .max(30, 'Username must be less than 20 characters')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be less than 20 characters')
    .required('Password is required'),
  // email: Yup.string()
  //   .required('Email is required'),
});

export default LoginSchema;