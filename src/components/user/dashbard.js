import React, { useContext, useEffect } from "react";
import { UserContext } from "../../App";
import AddTask from "../tasks/AddTask";
import axiosInstance from "../../config/axios";
import { showToast } from "../../common";
import Cards from "../tasks/Cardlist";
import { useParams } from 'react-router-dom';

export default function Dashboard() {
    const { userState, userDispatch } = useContext(UserContext);
    const { id } = useParams();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axiosInstance.get('/api/task');
                userDispatch({
                    type: 'SET_TASKS',
                    payload: response.data,
                });
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, [userDispatch]);

    const handleSaveTask = async (task) => {
        try {
            const response = await axiosInstance.post('/api/add-task', { ...task, user: userState.user._id });
            showToast("Task added successfully", "success");
            userDispatch({
                type: 'ADD_TASK',
                payload: response.data,
            });
        } catch (error) {
            console.error("Error saving task:", error);
            showToast("Error adding task", "error");
        }
    };

    return (
        <div className="mt-4 mx-4">
            <AddTask onSave={handleSaveTask} />
            <div className="mt-4">
                <Cards key={userState.Tasks.length} id={id} />
            </div>
        </div>
    );
}
