import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/login.css';
import axios from 'axios';

function Login() {
  const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' }
});

const [credentials, setCredentials] = useState({
  username: '',
  password: ''
});

const navigate = useNavigate();

const handleChange = (e) => {
  const { name, value } = e.target;
  setCredentials({ ...credentials, [name]: value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/auth/login', credentials);
    const jwtToken = response.data.message; // Get the JWT token from the response

    localStorage.setItem('token', jwtToken); // Save the JWT token in localStorage
    const decoded = jwtDecode(jwtToken); // Decode the JWT to get user's role

    if (decoded.roles.includes('ADMIN')) {
      navigate('/admin-dashboard');
    } else if (decoded.roles.includes('USER')) {
      navigate('/user-dashboard');
    }
  } catch (error) {
    console.error('Login error', error.response?.data || error.message);
  }
};
    return (
      <div className='login-container'>
        <div className='content-container'>
          <header className='title'>
            <h1>Login</h1>
            <hr />
          </header>
          <form className='user-info' onSubmit={handleSubmit}>
            <label htmlFor="username" className='form-label'>Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              className='input-field'
              value={credentials.username}
              onChange={handleChange}
            />
            <label htmlFor="password" className='form-label'>Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className='input-field'
              value={credentials.password}
              onChange={handleChange}
            />
            <button type="submit" className='submit-btn'>Login</button>
          </form>
        </div>
      </div>
    );
}

export default Login;
