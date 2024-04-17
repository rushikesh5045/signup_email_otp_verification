import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome to the Dashboard!</h2>
      </div>
      <div className="dashboard-content">
        <div className="card">
          <h3>Profile</h3>
          <p>Edit your profile information here.</p>
          <button className="btn">Edit Profile</button>
        </div>
        <div className="card">
          <h3>Settings</h3>
          <p>Manage your account settings.</p>
          <button className="btn">Account Settings</button>
        </div>
        <div className="card">
          <h3>Messages</h3>
          <p>View and manage your messages.</p>
          <button className="btn">View Messages</button>
        </div>
        <div className="card">
          <h3>Notifications</h3>
          <p>Check your notifications.</p>
          <button className="btn">View Notifications</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
