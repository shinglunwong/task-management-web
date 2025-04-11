import { useEffect, useState } from "react";
import axios from "../api";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const res = await axios.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err.response?.data?.error || "Error fetching tasks");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      loadTasks();
    } catch (err) {
      console.error(err.response?.data?.error || "Error deleting task");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/tasks/${id}`, { status });
      loadTasks();
    } catch (err) {
      console.error(err.response?.data?.error || "Error updating status");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-4 rounded shadow mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="text-lg font-bold">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-xs text-gray-400">
                Created: {new Date(task.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="mt-2 sm:mt-0 flex gap-2">
              <select
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <button
                onClick={() => deleteTask(task._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
