import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/login.css';
import { Alert, Button } from 'react-bootstrap';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://newpayrollmanagment.azurewebsites.net',
  headers: { 'Content-Type': 'application/json' }
});
function Login() {
  const [error, setError] = useState('');
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
  setError(''); // Clear previous errors
  if (credentials.username === '' || credentials.password === '') {
    setError('Please enter your username and password');
    return; // Stop further execution
  }
  try {
    const response = await api.post('/auth/login', credentials);
    const jwtToken = response.data.message; // Assuming 'message' contains the JWT token

    localStorage.setItem('token', jwtToken); // Save the JWT token in localStorage
    const decoded = jwtDecode(jwtToken); // Decode the JWT to get user's role

    if (decoded.roles.includes('ADMIN')) {
      navigate('/admin-dashboard');
      window.location.reload();
    } else if (decoded.roles.includes('USER')) {
      navigate('/user-dashboard');
      window.location.reload();
    }
  } catch (error) {
    console.error('Login error', error.response?.data || error.message);
    setError('Failed to login. Please check your credentials and try again.');
  }
};

    return (
      <div className='login-container'>
        <div className='content-container'>
          <header className='title'>
            <h1>Login</h1>
            <hr />
            {error && <Alert variant="danger" className="custom-alert">{error}</Alert>}
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
            <Button variant='primary' type='submit' className='submit-btn'>Submit</Button>
          </form>
        </div>
      </div>
    );
}

export default Login;
