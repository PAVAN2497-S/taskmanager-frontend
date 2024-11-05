import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../App";
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
    Paper,
} from "@mui/material";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend"; // Correct import
import axiosInstance from "../../config/axios";
import { showToast } from "../../common";
import View from './view';

const ItemType = "TASK";

const TaskCard = ({ task }) => {
    const { userDispatch } = useContext(UserContext);
    const [, drag] = useDrag(() => ({
        type: ItemType,
        item: { id: task._id },
    }));

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editTask, setEditTask] = useState({ title: task.title, description: task.description });

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/delete-task/${id}`);
            userDispatch({
                type: 'REMOVE_TASK',
                payload: id,
            });
            showToast("Task deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting task:", error);
            showToast("Error deleting task", "error");
        }
    };

    const handleView = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);

    const handleEdit = () => {
        setEditTask({ title: task.title, description: task.description });
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => setEditDialogOpen(false);

    const handleEditChange = (e) => {
        setEditTask({ ...editTask, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async () => {
        try {
            const updatedTask = { ...task, ...editTask };
            await axiosInstance.put(`/api/edit-task/${task._id}`, updatedTask);
            userDispatch({
                type: 'UPDATE_TASK',
                payload: updatedTask,
            });
            showToast("Task updated successfully", "success");
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating task:", error);
            showToast("Error updating task", "error");
        }
    };

    return (
        <Paper ref={drag} elevation={3} sx={{ p: 2, backgroundColor: "#bde0fe" }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2" sx={{ mt: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
                    {task.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 4 }}>
                    Created at: {new Date(task.createdAt).toLocaleString()}
                </Typography>
                <Stack direction="row" spacing={2} className="mt-2" style={{ marginLeft: "80px" }}>
                    <Button size="small" onClick={() => handleDelete(task._id)} sx={{ backgroundColor: "red", color: "white" }}>
                        Delete
                    </Button>
                    <Button size="small" onClick={handleEdit} sx={{ backgroundColor: "#00bbf9", color: "white" }}>
                        Edit
                    </Button>
                    <Button size="small" onClick={handleView} sx={{ backgroundColor: "#4361ee", color: "white" }}>
                        View
                    </Button>
                </Stack>

                <View open={dialogOpen} handleClose={handleCloseDialog} content={task} />

                <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="title"
                            label="Task Title"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={editTask.title}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="description"
                            label="Task Description"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={editTask.description}
                            onChange={handleEditChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" size="small" onClick={handleCloseEditDialog} color="primary">
                            Cancel
                        </Button>
                        <Button variant="outlined" size="small" onClick={handleSaveEdit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Paper>
    );
};

const TaskColumn = ({ title, tasks, status, moveTask }) => {
    const { userState } = useContext(UserContext);
    let userTask = tasks.filter((ele) => ele.user === userState.user._id);

    const [, drop] = useDrop(() => ({
        accept: ItemType,
        drop: (item) => {
            moveTask(item.id, status);
        },
    }));

    return (
        <Card ref={drop} sx={{ width: "380px", height: "800px", mb: 2, borderRadius: "8px" }}>
            <Typography variant="h5" component="div" sx={{ padding: 2, textAlign: "center", mt: 5, backgroundColor: "blue", color: "white" }}>
                {title}
            </Typography>
            {userTask.map((task) => (
                <CardContent key={task._id}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", "& > :not(style)": { m: 1, width: 330, height: "auto", padding: 1 } }}>
                        <TaskCard task={task} />
                    </Box>
                </CardContent>
            ))}
        </Card>
    );
};

export default function Cards() {
    const { userState, userDispatch } = useContext(UserContext);
    const tasks = userState.Tasks || [];

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axiosInstance.get(`/api/task`);
                userDispatch({
                    type: 'SET_TASKS',
                    payload: response.data,
                });
            } catch (error) {
                console.error("Error fetching tasks:", error);
                showToast(error.response?.data?.msg || "Error fetching tasks", "error");
            }
        };
        fetchTasks();
    }, [userDispatch]);

    const moveTask = async (id, newStatus) => {
        try {
            await axiosInstance.put(`/api/edit-task/${id}`, { status: newStatus }); 
            const response = await axiosInstance.get('/api/task'); 
            userDispatch({
                type: 'SET_TASKS',
                payload: response.data,
            });
        } catch (error) {
            console.error("Error updating task:", error);
            showToast("Error updating task", "error");
        }
    };

    const todoTasks = tasks.filter(task => task.status === "todo");
    const progressTasks = tasks.filter(task => task.status === "in-progress");
    const doneTasks = tasks.filter(task => task.status === "done");

    return (
        <DndProvider backend={HTML5Backend}>
            <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mt: 4 }} boxSizing="border-box">
                <TaskColumn title="Todo" status="todo" tasks={todoTasks} moveTask={moveTask} />
                <TaskColumn title="Progress" status="in-progress" tasks={progressTasks} moveTask={moveTask} />
                <TaskColumn title="Done" status="done" tasks={doneTasks} moveTask={moveTask} />
            </Box>
        </DndProvider>
    );
}
