import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserTeams } from '../api/teams';
import { createProject, getTeamProjects, updateProject, deleteProject } from '../api/projects';
import Navbar from '../components/Navbar';
import './Projects.css';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create project form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Edit project form
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const isAdmin = user?.role === 'Admin' || user?.role === 'ProjectManager';

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchProjects();
    }
  }, [selectedTeam]);

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
      setLoading(true);
      const response = await getTeamProjects(selectedTeam);
      setProjects(response.data.projects);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      setCreateLoading(true);
      setError('');
      await createProject({
        name: projectName,
        description: projectDescription,
        teamId: selectedTeam
      });
      setSuccess('Project created successfully!');
      setProjectName('');
      setProjectDescription('');
      setShowCreateForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      setUpdateLoading(true);
      setError('');
      await updateProject(editingProject._id, {
        name: editName,
        description: editDescription
      });
      setSuccess('Project updated successfully!');
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteProject = async (projectId, projectName) => {
    if (!window.confirm(`Are you sure you want to delete "${projectName}"?`)) return;

    try {
      setError('');
      await deleteProject(projectId);
      setSuccess('Project deleted successfully!');
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const startEdit = (project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditDescription(project.description || '');
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setEditName('');
    setEditDescription('');
  };

  return (
    <>
      <Navbar />
      <div className="projects-container">
        <div className="projects-header">
          <h1>Projects</h1>
          <p>Manage your team projects</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Team Selection */}
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
          <>
            {/* Create Project Section - Admin Only */}
            {isAdmin && (
              <div className="create-project-section">
                {!showCreateForm ? (
                  <button
                    className="create-btn"
                    onClick={() => setShowCreateForm(true)}
                  >
                    + Create New Project
                  </button>
                ) : (
                  <div className="create-form">
                    <h3>Create New Project</h3>
                    <form onSubmit={handleCreateProject}>
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                      />
                      <textarea
                        placeholder="Project Description (optional)"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        rows="3"
                      />
                      <div className="form-buttons">
                        <button type="submit" disabled={createLoading}>
                          {createLoading ? 'Creating...' : 'Create Project'}
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
            )}

            {/* Projects List */}
            <div className="projects-list">
              <h2>Team Projects</h2>
              {loading ? (
                <div className="loading">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="no-projects">No projects found for this team.</div>
              ) : (
                <div className="projects-grid">
                  {projects.map((project) => (
                    <div key={project._id} className="project-card">
                      {editingProject?._id === project._id ? (
                        // Edit Form
                        <form onSubmit={handleUpdateProject} className="edit-form">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                          />
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows="3"
                          />
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
                        // Project Display
                        <>
                          <h3>{project.name}</h3>
                          <p className="description">
                            {project.description || 'No description provided'}
                          </p>
                          <div className="project-meta">
                            <p><strong>Created by:</strong> {project.createdBy?.name}</p>
                            <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                          </div>
                          {isAdmin && (
                            <div className="project-actions">
                              <button
                                onClick={() => startEdit(project)}
                                className="edit-btn"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project._id, project.name)}
                                className="delete-btn"
                              >
                                Delete
                              </button>
                            </div>
                          )}
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

export default Projects;
