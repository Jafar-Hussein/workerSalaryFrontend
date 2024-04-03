import React, { useState } from 'react';
import {useHistory} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import '../css/login.css';
// const url = 'http://localhost:5000/auth/login';

function Login() {
    const url = 'http://localhost:5000/auth/login';
    const [credentials, setCredentials] = useState({
      username: '',
      password: ''
    });
    const history = useHistory();
  
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
        
        const { jwtToken } = await response.json();
        localStorage.setItem('token', jwtToken); // Save the JWT token in localStorage
  
        const decoded = jwt_decode(jwtToken); // Decode the JWT to get user's role
        if(decoded.role === 'ADMIN') {
          history.push('/admin-dashboard'); // Redirect to the admin dashboard
        } else if(decoded.role === 'USER') {
          history.push('/user-dashboard'); // Redirect to the user dashboard
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