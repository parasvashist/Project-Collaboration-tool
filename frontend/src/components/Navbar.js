import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/activity-logs">Project Collaboration Tool</Link>
      </div>
      <div className="nav-links">
        <Link to="/activity-logs" className={isActive('/activity-logs')}>Home</Link>
        <Link to="/teams" className={isActive('/teams')}>Teams</Link>
        <Link to="/projects" className={isActive('/projects')}>Projects</Link>
        <Link to="/tasks" className={isActive('/tasks')}>Tasks</Link>
        <span className="user-info">Welcome, {user?.name}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;








