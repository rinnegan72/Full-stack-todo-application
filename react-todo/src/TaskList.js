import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastTaskId, setLastTaskId] = useState(0);
    const [editTaskId, setEditTaskId] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newDueDate, setNewDueDate] = useState(null);
    const [editedTask, setEditedTask] = useState({ title: '', description: '', due_date: '' });
    // Added state for new task description

    useEffect(() => {
        axios.get('http://localhost:3333/tasks')
            .then(response => {
                setTasks(response.data);
                setIsLoading(false);
                const lastId = response.data.length > 0 ? response.data[response.data.length - 1].id : 0;
                setLastTaskId(lastId);
            })
            .catch(error => {
                console.error('There was an error!', error);
                setError(error);
                setIsLoading(false);
            });
    }, []);

    const handleCheckboxChange = async (taskId, completed) => {
        try {
            const response = await axios.put(`http://localhost:3333/tasks/${taskId}`, {
                completed: !completed,
            });

            const updatedTasks = tasks.map((task) =>
                task.id === taskId ? response.data : task
            );

            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleTestButtonClick = async () => {
        try {
            // Make a POST request to create a new task
            await axios.post(
                'http://localhost:3333/tasks',
                {
                    title: newTaskTitle || 'New Task',
                    description: newTaskDescription, // Use the state for new task description
                    due_date: newDueDate
                },
                {
                    headers: {
                        'X-CSRF-TOKEN': 'your-csrf-token',
                    },
                }
            );

            // Fetch and update the task list after adding a new task
            const response = await axios.get('http://localhost:3333/tasks');
            setTasks(response.data);

            // Optionally, clear the input fields
            setNewTaskTitle('');
            setNewTaskDescription('');
            console.log('New task added successfully!');
        } catch (error) {
            console.error('Error adding new task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:3333/tasks/${taskId}`);
            const updatedTasks = tasks.filter((task) => task.id !== taskId);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEditClick = (taskId) => {
        const taskToEdit = tasks.find((task) => task.id === taskId);

        // Set the editedTask based on the task to be edited
        setEditedTask({ title: taskToEdit.title, description: taskToEdit.description });
        setEditTaskId(taskId);
    };
    const handleUpdateTask = async (taskId, updatedTitle, updatedDescription, updatedDueDate) => {
        try {
            const response = await axios.put(`http://localhost:3333/tasks/${taskId}`, {
                description: updatedDescription,
                title: updatedTitle,
                due_date: updatedDueDate
            });
            console.log(response);
            console.log('title: ', updatedTitle, ' date: ', updatedDueDate);
            const updatedTasks = tasks.map((task) =>
                task.id === taskId ? response.data : task
            );

            setTasks(updatedTasks);
            setEditTaskId(null); // Reset the edit task ID
            console.log("new description", updatedDescription)
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const isEditing = (taskId) => editTaskId === taskId;

    return (
        <div>
            <h1>Task List</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Task ID</th>
                        <th>Task Title</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Completion Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>
                                {isEditing(task.id) ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedTask.title}
                                            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                        />
                                        <Button
                                            onClick={() => handleUpdateTask(task.id, editedTask.title, editedTask.description, editedTask.due_date)}
                                        >
                                            Update
                                        </Button>
                                    </>
                                ) : (
                                    task.title
                                )}
                            </td>
                                <td>
                                    {isEditing(task.id) ? (
                                        <input
                                            type="text"
                                            value={editedTask.description}
                                            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                        />
                                    ) : (
                                        task.description
                                    )}
                                </td>
                            <td>
                                {isEditing(task.id) ? (
                                    <input
                                        type="date"
                                        value={editedTask.due_date}
                                        onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
                                    />
                                ) : (
                                    // Display formatted date if available
                                    task.due_date ? new Date(task.due_date).toLocaleDateString() : ''
                                )}
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleCheckboxChange(task.id, task.completed)}
                                />
                            </td>
                            <td>
                                {isEditing(task.id) ? (
                                    <Button onClick={() => { handleEditClick(task.id); window.location.reload(); }}>
                                        Cancel
                                    </Button>
                                ) : (
                                    <Button onClick={() => handleEditClick(task.id)}>Edit</Button>
                                )}
                                &nbsp;
                                <Button variant="danger" onClick={() => handleDeleteTask(task.id)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-trash-fill"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                    </svg>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>{lastTaskId + 1}</td>
                        <td>
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                type="date"
                                value={newDueDate}
                                onChange={(e) => setNewDueDate(e.target.value)}
                            />
                        </td>
                        <td>
                            <input type="checkbox" />
                        </td>
                        <td>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-upload"
                                viewBox="0 0 16 16"
                                onClick={handleTestButtonClick}
                                style={{ cursor: 'pointer' }}
                            >
                                <path
                                    d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"
                                />
                                <path
                                    d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z"
                                />
                            </svg>
                        </td>
                    </tr>
                </tbody>
            </Table>
            {/*
             <Button id='test1' onClick={handleTestButtonClick}>
                TEST
            </Button>
            */}
        </div>
    );
};

export default TaskList;