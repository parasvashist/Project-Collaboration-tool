import React, { useState, useContext } from 'react';
import { signupUser } from '../api/auth';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signupUser(formData);
      login(res.data.token);
      navigate('/activity-logs');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="text-center mb-4">Sign Up</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-3"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          className="form-control mb-3"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </form>
      <p className="text-center mt-3">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
