import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../../App';

export default function AddTask({ onSave }) {
    const [open, setOpen] = useState(false);
    const { userState } = useContext(UserContext);
console.log(userState,"userState");
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            user: userState.user._id
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Task Title is required'),
            description: Yup.string().required('Task description is required'),
        }),
        onSubmit: (values) => {
            console.log(values,"values");
            onSave(values); // Call the onSave function
            formik.resetForm();
            handleClose();
        }
    });

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <React.Fragment>
            <Button variant="contained" style={{ backgroundColor: "#335bff" }} onClick={handleClickOpen}>
                Add Task
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Add Task</DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400 }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="task-title"
                            name="title"
                            label="Task Title"
                            variant="standard"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                        <TextField
                            id="task-description"
                            name="description"
                            label="Task description"
                            variant="standard"
                            multiline
                            minRows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" onClick={formik.handleSubmit} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
