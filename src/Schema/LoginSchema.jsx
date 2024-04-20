import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  user_id: Yup.string()
    .min(4, 'User ID must be at least 4 characters')
    .max(30, 'User ID must be less than 20 characters')
    .required('User ID is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be less than 20 characters')
    .required('Password is required'),
  // email: Yup.string()
  //   .required('Email is required'),
});

export default loginSchema;