import { useEffect, useState } from "react";

export default function TaskModal({ isOpen, onClose, onSubmit, onDelete, initialData }) {
  const isEdit = !!initialData;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");

  useEffect(() => {
    if (isEdit) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status || "To Do");
    } else {
      setTitle("");
      setDescription("");
      setStatus("To Do");
    }
  }, [isEdit, initialData, isOpen]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title,
      description,
      status,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Task" : "Create Task"}</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="w-full border px-3 py-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div className="flex justify-between mt-6">
          <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={onClose}>
            Cancel
          </button>
          <div className="flex gap-2">
            {isEdit && (
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={onDelete}
              >
                Delete
              </button>
            )}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleSubmit}
            >
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
