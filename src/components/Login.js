import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/login.css';

function Login() {
    const url = 'http://localhost:5000/auth/login';
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
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const json = await response.json();
        const jwtToken = json.message; // Get the JWT token from the 'message' key
    
        if (typeof jwtToken !== 'string') {
          throw new Error('JWT Token is not a string.');
        }
    
        localStorage.setItem('token', jwtToken); // Save the JWT token in localStorage
    
        const decoded = jwtDecode(jwtToken); // Decode the JWT to get user's role
    
        // Assuming the roles are an array, check if the role includes 'ADMIN' or 'USER'
        if (decoded.roles.includes('ADMIN')) {
          navigate('/admin-dashboard'); // Correct usage of navigate
        } else if (decoded.roles.includes('USER')) {
          navigate('/user-dashboard'); // Correct usage of navigate
        }
      } catch (error) {
        console.error('Login error', error);
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
