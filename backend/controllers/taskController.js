const Task = require('../models/Task');

// Create task
exports.createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = new Task({
            title,
            description,
            status,
            userId: req.user.userId,
        });
        const saved = await task.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all tasks for the user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single task by ID (if belongs to user)
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: 'Invalid task ID' });
    }
};

// Update task by ID (if belongs to user)
exports.updateTask = async (req, res) => {
    try {
        const updated = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: 'Task not found or not authorized' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete task by ID (if belongs to user)
exports.deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!deleted) return res.status(404).json({ error: 'Task not found or not authorized' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid task ID' });
    }
};
