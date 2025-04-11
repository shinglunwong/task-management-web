import { useState } from "react";
import LoginForm from "./components/LoginForm";
import TaskModal from "./components/TaskModal";
import useTasks from "./hooks/useTasks";

const getStatusBadge = (status) => {
  const base = "px-2 py-1 rounded text-xs font-semibold";

  switch (status) {
    case "To Do":
      return <span className={`${base} bg-yellow-100 text-yellow-800`}>To Do</span>;
    case "In Progress":
      return <span className={`${base} bg-blue-100 text-blue-800`}>In Progress</span>;
    case "Done":
      return <span className={`${base} bg-green-100 text-green-800`}>Done</span>;
    default:
      return <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>;
  }
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { tasks, createTask, updateTask, deleteTask, loading, error } = useTasks();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const openCreateModal = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    if (selectedTask) {
      await updateTask(selectedTask._id, data);
    } else {
      await createTask(data);
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedTask) {
      await deleteTask(selectedTask._id);
      setModalOpen(false);
    }
  };

  if (!token) return <LoginForm onLogin={setToken} />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <h1 className="text-3xl font-bold truncate">📝 Task Manager</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-grey-100 border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-100 whitespace-nowrap"
          >
            Logout
          </button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
            onClick={openCreateModal}
          >
            + Create
          </button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No tasks yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Click the Create button to add your first task
          </p>
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getStatusBadge(task.status)}
                <h3 className="text-lg font-bold">{task.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                Created: {new Date(task.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => openEditModal(task)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              Edit
            </button>
          </div>
        ))
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        initialData={selectedTask}
      />
    </div>
  );
}

export default App;
