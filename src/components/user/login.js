import * as React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../App';
import { useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../../common';
import axiosInstance, { BACKEND_URL } from '../../config/axios';

export default function Login() {
    const { userDispatch } = useContext(UserContext);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Please enter an email'),
            password: Yup.string().required('Please enter a password')
        }),
        onSubmit: async (formData) => {
            try {
                const response = await axiosInstance.post('/api/login', formData);
                const token = response.data.token;
                localStorage.setItem("token", token);
                const profile = await axiosInstance.get('/api/getprofile');
                
                if (profile.data) {
                    userDispatch({ type: 'USER_LOGIN', payload: profile.data });
                    navigate(`/dashboard`);
                }

            } catch (e) {
                if (e.response && e.response.data.msg) {
                    showToast(e.response.data.msg);
                } else {
                    console.error("An unexpected error occurred", e);
                }
            }
        }
    });


    const handleGoogleLogin = () => {
        window.location.href = `${BACKEND_URL}/auth/google`;
    };

    return (
        <React.Fragment>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 5 }}
                boxSizing="border-box"
            >
                <Typography
                    variant="h4"
                    sx={{ color: "#335bff", fontWeight: "bold", mb: 2 }}
                >
                    Login
                </Typography>
                <Card sx={{
                    border: '2px solid #335bff',
                    width: "450px",
                    mb: 2,
                    borderRadius: '8px',
                    padding: '16px'
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
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                style={{ backgroundColor: "#335bff" }}
                            >
                                Login
                            </Button>
                            <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
                                Don't have an account? <Link to="/register" className='text-decoration-none'>Signup</Link>
                            </Typography>
                            <Box
                                display="flex"
                                justifyContent="center"
                                sx={{ mt: 2 }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={handleGoogleLogin}
                                    sx={{
                                        padding: '4px 16px',
                                        fontSize: '12px',
                                        minWidth: 'auto'
                                    }}
                                    style={{ backgroundColor: "#335bff" }}
                                >
                                    Login with Google
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </React.Fragment>
    );
}
