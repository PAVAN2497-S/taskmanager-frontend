import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function View({ open, handleClose, content }) {
    console.log(content,"content");
    
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{ '& .MuiDialog-paper': { width: '50%', maxHeight: 435 } }}
        >
            <DialogTitle id="customized-dialog-title" sx={{ fontWeight: "bold" }}>
                Task Details
            </DialogTitle>
            <DialogContent >
                <Typography gutterBottom sx={{ fontWeight: "bold" }} >
                    {content.title}
                </Typography>
                <Typography gutterBottom>
                    {content.description}
                </Typography>
                <Typography gutterBottom>
                    {new Date(content.createdAt).toLocaleString()}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button autoFocus variant='contained' onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
