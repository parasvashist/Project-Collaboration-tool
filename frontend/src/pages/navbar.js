import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand fw-bold" to="/dashboard">
        ProjectCollab
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        {/* LEFT LINKS */}
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/teams">Teams</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/projects">Projects</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tasks">Tasks</Link>
          </li>
        </ul>

        {/* RIGHT SIDE DROPDOWN */}
        <ul className="navbar-nav ms-auto">
          <li className="nav-item dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user ? `${user.name} (${user.role})` : 'User'}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
