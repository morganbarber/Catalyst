import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const Dashboard = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard! You are successfully logged in.</p>
    </div>
  );
};

export default Dashboard;