import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className="container mt-5 text-center">
        <h2>Welcome, {user?.name} 👋</h2>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
        <hr />
        <h4>Select a section from the navbar to begin.</h4>
      </div>
    </>
  );
};

export default Dashboard;
