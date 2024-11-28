// src/components/UserManagement.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch users from the server
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) throw new Error('Error fetching users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError('Error fetching users');
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Error adding user');
      setNewUser({ username: '', password: '' });
      fetchUsers();
    } catch (error) {
      setError('Error adding user');
    }
  };

  // Edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ username: user.username, password: '' });
  };

  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Error updating user');
      setEditingUser(null);
      setNewUser({ username: '', password: '' });
      fetchUsers();
    } catch (error) {
      setError('Error updating user');
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting user');
      fetchUsers();
    } catch (error) {
      setError('Error deleting user');
    }
  };

  // Handle logout
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="user-management" id="user-management-container">
      <header className="header" id="user-management-header">
        <h2 id='user-management-title'>User Management</h2>
        <nav className="navigation" id="navigation-links">
          <ul className="nav-links" id="user-nav-links">
            <li><Link to="/dashboard" className="nav-link" id="dashboard-link">Dashboard</Link></li>
            <li><Link to="/products" className="nav-link" id="product-link">Product Management</Link></li>
          </ul>
          <button onClick={handleLogout} className="logout-button" id="logout-btn">Logout</button>
        </nav>
      </header>
      
      {error && <p className="error" id="error-message">{error}</p>}
      
      <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="user-form" id="user-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleInputChange}
          required
          className="input-field"
          id="username-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleInputChange}
          required
          className="input-field"
          id="password-input"
        />
        <button type="submit" className="submit-button" id="submit-btn">
          {editingUser ? 'Update User' : 'Add User'}
        </button>
      </form>

      <table className="user-table" id="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>
                <button onClick={() => handleEditUser(user)} className="action-btn" id={`edit-btn-${user.id}`}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)} className="action-btn" id={`delete-btn-${user.id}`}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
