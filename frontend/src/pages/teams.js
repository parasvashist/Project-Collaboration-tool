import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createTeam, joinTeam, getUserTeams } from '../api/teams';
import Navbar from '../components/Navbar';
import './Teams.css';

const Teams = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Create team form
  const [teamName, setTeamName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  
  // Join team form
  const [teamId, setTeamId] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  const isAdmin = user?.role === 'Admin' || user?.role === 'ProjectManager';

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await getUserTeams();
      setTeams(response.data.teams);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    
    try {
      setCreateLoading(true);
      setError('');
      const response = await createTeam({ name: teamName });
      setSuccess('Team created successfully!');
      setTeamName('');
      fetchTeams(); // Refresh teams list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!teamId.trim()) return;
    
    try {
      setJoinLoading(true);
      setError('');
      const response = await joinTeam({ teamId });
      setSuccess('Joined team successfully!');
      setTeamId('');
      fetchTeams(); // Refresh teams list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join team');
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="teams-container">
        <div className="teams-header">
          <h1>Teams</h1>
          <p>Welcome, {user?.name}! Role: {user?.role}</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="teams-content">
          {/* Admin/ProjectManager can create teams */}
          {isAdmin && (
            <div className="create-team-section">
              <h2>Create New Team</h2>
              <form onSubmit={handleCreateTeam} className="create-team-form">
                <input
                  type="text"
                  placeholder="Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
                <button type="submit" disabled={createLoading}>
                  {createLoading ? 'Creating...' : 'Create Team'}
                </button>
              </form>
            </div>
          )}

          {/* All users can join teams */}
          <div className="join-team-section">
            <h2>Join Team</h2>
            <form onSubmit={handleJoinTeam} className="join-team-form">
              <input
                type="text"
                placeholder="Team ID"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                required
              />
              <button type="submit" disabled={joinLoading}>
                {joinLoading ? 'Joining...' : 'Join Team'}
              </button>
            </form>
          </div>

          {/* Display user's teams */}
          <div className="my-teams-section">
            <h2>My Teams</h2>
            {loading ? (
              <div className="loading">Loading teams...</div>
            ) : teams.length === 0 ? (
              <div className="no-teams">You haven't joined any teams yet.</div>
            ) : (
              <div className="teams-grid">
                {teams.map((team) => (
                  <div key={team._id} className="team-card">
                    <h3>{team.name}</h3>
                    <p><strong>Team ID:</strong> {team._id}</p>
                    <p><strong>Created:</strong> {new Date(team.createdAt).toLocaleDateString()}</p>
                    <div className="team-members">
                      <h4>Members ({team.members.length}):</h4>
                      <ul>
                        {team.members.map((member) => (
                          <li key={member._id}>
                            {member.name} ({member.email}) - {member.role}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Teams;
