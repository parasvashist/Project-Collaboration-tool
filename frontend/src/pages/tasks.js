import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserTeams } from '../api/teams';
import { getTeamProjects } from '../api/projects';
import { createTask, getProjectTasks, updateTask, deleteTask, updateTaskStatus } from '../api/tasks';
import Navbar from '../components/Navbar';
import './Tasks.css';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create task form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);

  // Edit task form
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState([]);
  const [editStatus, setEditStatus] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const [teamMembers, setTeamMembers] = useState([]);

  const isAdmin = user?.role === 'Admin' || user?.role === 'ProjectManager';
  const statusOptions = ['Todo', 'In Progress', 'QA Complete', 'Completed'];

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchProjects();
      // Get team members for assignment
      const team = teams.find(t => t._id === selectedTeam);
      setTeamMembers(team?.members || []);
    }
  }, [selectedTeam, teams]);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks();
    }
  }, [selectedProject]);

  const fetchTeams = async () => {
    try {
      const response = await getUserTeams();
      setTeams(response.data.teams);
      if (response.data.teams.length > 0) {
        setSelectedTeam(response.data.teams[0]._id);
      }
    } catch (err) {
      setError('Failed to fetch teams');
    }
  };

  const fetchProjects = async () => {
    if (!selectedTeam) return;
    
    try {
      const response = await getTeamProjects(selectedTeam);
      setProjects(response.data.projects);
      if (response.data.projects.length > 0) {
        setSelectedProject(response.data.projects[0]._id);
      }
    } catch (err) {
      setError('Failed to fetch projects');
    }
  };

  const fetchTasks = async () => {
    if (!selectedProject) return;
    
    try {
      setLoading(true);
      const response = await getProjectTasks(selectedProject);
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      setCreateLoading(true);
      setError('');
      await createTask({
        title: taskTitle,
        description: taskDescription,
        projectId: selectedProject,
        assignedTo: assignedTo
      });
      setSuccess('Task created successfully!');
      setTaskTitle('');
      setTaskDescription('');
      setAssignedTo([]);
      setShowCreateForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    try {
      setUpdateLoading(true);
      setError('');
      await updateTask(editingTask._id, {
        title: editTitle,
        description: editDescription,
        assignedTo: editAssignedTo,
        status: editStatus
      });
      setSuccess('Task updated successfully!');
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) return;

    try {
      setError('');
      await deleteTask(taskId);
      setSuccess('Task deleted successfully!');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setError('');
      await updateTaskStatus(taskId, newStatus);
      setSuccess('Task status updated!');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditAssignedTo(task.assignedTo.map(u => u._id));
    setEditStatus(task.status);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditDescription('');
    setEditAssignedTo([]);
    setEditStatus('');
  };

  const canEditTask = (task) => {
    return task.createdBy._id === user.id || isAdmin;
  };

  const canChangeStatus = (task) => {
    // Any team member can change status (since they can view the task, they're already a team member)
    return true;
  };

  const handleAssignedToChange = (userId, isChecked, isEdit = false) => {
    if (isEdit) {
      setEditAssignedTo(prev => 
        isChecked 
          ? [...prev, userId]
          : prev.filter(id => id !== userId)
      );
    } else {
      setAssignedTo(prev => 
        isChecked 
          ? [...prev, userId]
          : prev.filter(id => id !== userId)
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="tasks-container">
        <div className="tasks-header">
          <h1>Tasks</h1>
          <p>Manage your project tasks</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Team and Project Selection */}
        <div className="selectors">
          <div className="team-selector">
            <label htmlFor="teamSelect">Select Team:</label>
            <select
              id="teamSelect"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">Choose a team...</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTeam && (
            <div className="project-selector">
              <label htmlFor="projectSelect">Select Project:</label>
              <select
                id="projectSelect"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedProject && (
          <>
            {/* Create Task Section */}
            <div className="create-task-section">
              {!showCreateForm ? (
                <button
                  className="create-btn"
                  onClick={() => setShowCreateForm(true)}
                >
                  + Create New Task
                </button>
              ) : (
                <div className="create-form">
                  <h3>Create New Task</h3>
                  <form onSubmit={handleCreateTask}>
                    <input
                      type="text"
                      placeholder="Task Title"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                    />
                    <textarea
                      placeholder="Task Description (optional)"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      rows="3"
                    />
                    <div className="assign-members">
                      <label>Assign to team members:</label>
                      <div className="members-list">
                        {teamMembers.map((member) => (
                          <label key={member._id} className="member-checkbox">
                            <input
                              type="checkbox"
                              checked={assignedTo.includes(member._id)}
                              onChange={(e) => handleAssignedToChange(member._id, e.target.checked)}
                            />
                            {member.name} ({member.email})
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-buttons">
                      <button type="submit" disabled={createLoading}>
                        {createLoading ? 'Creating...' : 'Create Task'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Tasks List */}
            <div className="tasks-list">
              <h2>Project Tasks</h2>
              {loading ? (
                <div className="loading">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="no-tasks">No tasks found for this project.</div>
              ) : (
                <div className="tasks-grid">
                  {tasks.map((task) => (
                    <div key={task._id} className={`task-card status-${task.status.toLowerCase().replace(' ', '-')}`}>
                      {editingTask?._id === task._id ? (
                        // Edit Form
                        <form onSubmit={handleUpdateTask} className="edit-form">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            required
                          />
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows="3"
                          />
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                          >
                            {statusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                          <div className="assign-members">
                            <label>Assign to:</label>
                            <div className="members-list">
                              {teamMembers.map((member) => (
                                <label key={member._id} className="member-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={editAssignedTo.includes(member._id)}
                                    onChange={(e) => handleAssignedToChange(member._id, e.target.checked, true)}
                                  />
                                  {member.name}
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="form-buttons">
                            <button type="submit" disabled={updateLoading}>
                              {updateLoading ? 'Updating...' : 'Update'}
                            </button>
                            <button type="button" onClick={cancelEdit} className="cancel-btn">
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        // Task Display
                        <>
                          <div className="task-header">
                            <h3>{task.title}</h3>
                            <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                              {task.status}
                            </span>
                          </div>
                          <p className="description">
                            {task.description || 'No description provided'}
                          </p>
                          <div className="task-meta">
                            <p><strong>Created by:</strong> {task.createdBy?.name}</p>
                            <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
                            {task.assignedTo.length > 0 && (
                              <div className="assigned-to">
                                <strong>Assigned to:</strong>
                                <ul>
                                  {task.assignedTo.map(user => (
                                    <li key={user._id}>{user.name}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          
                          <div className="task-actions">
                            {/* Status change - now available to all team members */}
                            <div className="status-change">
                              <label>Change Status:</label>
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                              >
                                {statusOptions.map(status => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                            </div>
                            
                            {canEditTask(task) && (
                              <div className="edit-delete-actions">
                                <button
                                  onClick={() => startEdit(task)}
                                  className="edit-btn"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task._id, task.title)}
                                  className="delete-btn"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Tasks;
