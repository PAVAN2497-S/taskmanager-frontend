import * as React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '../../common';
import axiosInstance, { BACKEND_URL } from '../../config/axios';

export default function Register() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmpassword: '',
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required('First Name is required'),
            lastname: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid email address').required('Please enter an email'),
            password: Yup.string().required('Please enter a password'),
            confirmpassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Please confirm your password'),
        }),
        onSubmit: async (formData) => {
            console.log(formData);

            try {
                const response = await axiosInstance.post('/api/register', formData);
                showToast('Registration successful', 'success');
                navigate('/login');
                console.log(response);

            } catch (e) {
                if (e.response && e.response.data.msg) {
                    showToast(e.response.data.msg, 'error');
                } else {
                    console.error("An unexpected error occurred", e);
                    showToast('An unexpected error occurred', 'error');
                }
            }
        }
    });

    const handleGoogleLogin = () => {
        window.location.href = `${BACKEND_URL}/auth/google`;
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 4 }}
            boxSizing="border-box"
        >
            <Typography
                variant="h4"
                sx={{ color: "#335bff", fontWeight: "bold", mb: 1, alignSelf: 'flex-start', marginLeft: "450px" }}
            >
                Signup
            </Typography>
            <Card sx={{
                border: '2px solid #335bff',
                width: "350px",
                mb: 2,
                borderRadius: '8px'
            }}>
                <CardContent>
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{
                            '& > :not(style)': { mb: 1.5, width: '100%' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            size="small"
                            label="First Name"
                            variant="outlined"
                            name="firstname"
                            value={formik.values.firstname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                            helperText={formik.touched.firstname && formik.errors.firstname}
                        />
                        <TextField
                            size="small"
                            label="Last Name"
                            variant="outlined"
                            name="lastname"
                            value={formik.values.lastname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                            helperText={formik.touched.lastname && formik.errors.lastname}
                        />
                        <TextField
                            size="small"
                            label="Email"
                            variant="outlined"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            size="small"
                            label="Password"
                            variant="outlined"
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <TextField
                            size="small"
                            label="Confirm Password"
                            variant="outlined"
                            type="password"
                            name="confirmpassword"
                            value={formik.values.confirmpassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmpassword && Boolean(formik.errors.confirmpassword)}
                            helperText={formik.touched.confirmpassword && formik.errors.confirmpassword}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            style={{ backgroundColor: "#335bff" }}
                        >
                            Signup
                        </Button>
                        <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
                            Already have an account?  <Link to="/login" style={{ textDecoration: "none" }}>
                                Login
                            </Link>
                        </Typography>
                        <Box
                            display="flex"
                            justifyContent="center"
                            sx={{ mt: 2 }}
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    padding: '4px 16px',
                                    fontSize: '12px',
                                    minWidth: 'auto'
                                }}
                                style={{ backgroundColor: "#335bff" }}
                                onClick={handleGoogleLogin}
                            >
                                Signup with Google
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

