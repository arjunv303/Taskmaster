import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  // States to manage tasks, task input form, and task filtering
  const [tasks, setTasks] = useState([]); // All tasks fetched from the backend
  const [task, setTask] = useState({ 
    title: '', 
    description: '', 
    priority: 'Medium', 
    deadline: '' 
  }); // Form data for creating or editing a task
  const [filter, setFilter] = useState('All'); // Filter: All, Completed, or Pending tasks

  // Fetch tasks from the backend when the component loads
  useEffect(() => {
    axios.get('http://localhost:5002/tasks')
      .then((res) => setTasks(res.data))
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        alert("Failed to fetch tasks. Is the backend running?");
      });
  }, []);

  // Update task input fields as the user types
  const handleInputChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  // Add a new task and reset the input form
  const addTask = () => {
    if (!task.title.trim()) {
      alert("Task title cannot be empty!");
      return;
    }

    axios.post('http://localhost:5002/tasks', task)
      .then((res) => {
        setTasks([...tasks, res.data]); // Update the task list with the new task
        setTask({ title: '', description: '', priority: 'Medium', deadline: '' }); // Clear the form
      })
      .catch((error) => {
        console.error("Error adding task:", error);
        alert("Failed to add task. Please try again.");
      });
  };

  // Delete a task by ID
  const deleteTask = (id) => {
    axios.delete(`http://localhost:5002/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((t) => t._id !== id)); // Remove the deleted task from the list
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        alert("Failed to delete task. Please try again.");
      });
  };

  // Toggle the completion status of a task
  const toggleComplete = (id) => {
    const taskToUpdate = tasks.find((t) => t._id === id); // Find the task to update
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed }; // Toggle 'completed' status

    axios.put(`http://localhost:5002/tasks/${id}`, updatedTask)
      .then((res) => {
        setTasks(tasks.map((t) => (t._id === id ? res.data : t))); // Update the task in the list
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        alert("Failed to update task status. Please try again.");
      });
  };

  // Calculate task statistics
  const totalTasks = tasks.length; // Total number of tasks
  const completedTasks = tasks.filter((t) => t.completed).length; // Number of completed tasks
  const pendingTasks = tasks.filter((t) => !t.completed).length; // Number of pending tasks

  // Calculate percentages for progress bars
  const completedPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  const pendingPercentage = totalTasks > 0 
    ? Math.round((pendingTasks / totalTasks) * 100) 
    : 0;

  // Filter tasks for display
  const filteredTasks = tasks.filter((t) =>
    filter === 'All' 
      ? true 
      : filter === 'Completed' 
        ? t.completed 
        : !t.completed
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">TaskMaster</h1>
          <p className="text-sm md:text-base opacity-80">Organize Your Work & Life</p>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8 grid md:grid-cols-2 gap-6">
          {/* Task Input Form */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Task</h2>
            
            {/* Input fields for task title, description, priority, and deadline */}
            <input 
              type="text"
              name="title"
              placeholder="Task Title"
              value={task.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            <textarea 
              name="description"
              placeholder="Task Description"
              value={task.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
            
            <div className="grid grid-cols-2 gap-4">
              <select 
                name="priority"
                value={task.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              
              <input 
                type="date"
                name="deadline"
                value={task.deadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button 
              onClick={addTask}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Add Task
            </button>
          </div>

          {/* Task List */}
          <div>
            {/* Filter Buttons */}
            <div className="flex justify-center space-x-4 mb-4">
              {['All', 'Completed', 'Pending'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    filter === filterType ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>

            {/* Display the filtered list of tasks */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {filteredTasks.map((t) => (
                <div 
                  key={t._id} 
                  className={`p-4 rounded-md flex justify-between items-center ${
                    t.completed ? 'bg-green-50 opacity-70' : ''
                  }`}
                >
                  <div>
                    <h3 className={`font-semibold ${t.completed ? 'line-through text-gray-500' : ''}`}>
                      {t.title}
                    </h3>
                    <p className="text-sm text-gray-600">{t.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleComplete(t._id)}
                      className="form-checkbox"
                    />
                    <button 
                      onClick={() => deleteTask(t._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
