import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllLogs } from '../api/activityLogs';
import Navbar from '../components/Navbar';
import './ActivityLogs.css';

const ActivityLogs = () => {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getAllLogs();
      setLogs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('Create')) return '➕';
    if (action.includes('Update') || action.includes('Status')) return '✏️';
    if (action.includes('Delete')) return '🗑️';
    if (action.includes('Join')) return '👥';
    return '📝';
  };

  const getEntityColor = (entityType) => {
    switch (entityType) {
      case 'Team': return '#007bff';
      case 'Project': return '#28a745';
      case 'Task': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <>
      <Navbar />
      <div className="activity-logs-container">
        {/* Dashboard Info Section */}
        <div className="dashboard-info">
          <h2>Welcome, {user?.name} 👋</h2>
          <div className="user-details">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        </div>

        <div className="logs-header">
          <h1>Activity Logs</h1>
          <p>Track all system activities and user actions</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading activity logs...</div>
        ) : logs.length === 0 ? (
          <div className="no-logs">No activity logs found.</div>
        ) : (
          <div className="logs-list">
            {logs.map((log) => (
              <div key={log._id} className="log-item">
                <div className="log-icon">
                  {getActionIcon(log.action)}
                </div>
                <div className="log-content">
                  <div className="log-header">
                    <span className="log-user">{log.user?.name}</span>
                    <span 
                      className="log-entity"
                      style={{ backgroundColor: getEntityColor(log.entityType) }}
                    >
                      {log.entityType}
                    </span>
                    <span className="log-time">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="log-action">{log.action}</div>
                  {log.description && (
                    <div className="log-description">{log.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ActivityLogs;



