const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS to allow frontend communication
const corsOptions = {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Define the schema for tasks
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Task title is required
    description: { type: String },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    deadline: { type: Date },
    completed: { type: Boolean, default: false },
});

// Create a Task model
const Task = mongoose.model('Task', taskSchema);

// Route to get all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Route to create a new task
app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

// Route to update an existing task
app.put('/tasks/:id', async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
});

// Route to delete a task
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});

// Start the server on the specified port
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//To start MongoDb you have to navigate to cd TaskMaster/server and once your in the server folder you should enter npm start and then you will see a message that says "MongoDB Connected" 
