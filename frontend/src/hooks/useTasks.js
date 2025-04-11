// src/hooks/useTasks.js
import { useState, useEffect } from "react";
import axios from "../api";

export default function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getTasks = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setTasks([]);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get("/tasks");
            setTasks(res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (data) => {
        try {
            await axios.post("/tasks", data);
            await getTasks();
        } catch (err) {
            throw new Error(err.response?.data?.error || "Create failed");
        }
    };

    const updateTask = async (id, data) => {
        try {
            await axios.put(`/tasks/${id}`, data);
            await getTasks();
        } catch (err) {
            throw new Error(err.response?.data?.error || "Update failed");
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`/tasks/${id}`);
            await getTasks();
        } catch (err) {
            throw new Error(err.response?.data?.error || "Delete failed");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getTasks();
        }
    }, []);

    return {
        tasks,
        loading,
        error,
        getTasks,
        createTask,
        updateTask,
        deleteTask,
    };
}
