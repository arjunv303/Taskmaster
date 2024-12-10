import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ title: '', description: '', priority: 'Medium', deadline: '' });

    useEffect(() => {
        axios.get('http://localhost:5000/tasks').then(res => setTasks(res.data));
    }, []);

    const handleInputChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const addTask = () => {
        axios.post('http://localhost:5000/tasks', task).then(res => {
            setTasks([...tasks, res.data]);
            setTask({ title: '', description: '', priority: 'Medium', deadline: '' });
        });
    };

    const deleteTask = (id) => {
        axios.delete(`http://localhost:5000/tasks/${id}`).then(() => {
            setTasks(tasks.filter(t => t._id !== id));
        });
    };

    return (
        <div className="app">
            <h1>TaskMaster</h1>
            <div className="task-form">
                <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    value={task.title}
                    onChange={handleInputChange}
                />
                <textarea
                    name="description"
                    placeholder="Task Description"
                    value={task.description}
                    onChange={handleInputChange}
                ></textarea>
                <select name="priority" value={task.priority} onChange={handleInputChange}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <input
                    type="date"
                    name="deadline"
                    value={task.deadline}
                    onChange={handleInputChange}
                />
                <button onClick={addTask}>Add Task</button>
            </div>
            <div className="task-list">
                {tasks.map(t => (
                    <div key={t._id} className="task">
                        <h3>{t.title}</h3>
                        <p>{t.description}</p>
                        <p>Priority: {t.priority}</p>
                        <p>Deadline: {new Date(t.deadline).toLocaleDateString()}</p>
                        <button onClick={() => deleteTask(t._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
