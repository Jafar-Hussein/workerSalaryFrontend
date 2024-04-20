import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Account.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Account() {
    const navigate = useNavigate();
    const api = axios.create({
        baseURL: 'http://localhost:5000',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const handleButtonClick = (buttonId) => {
        if (buttonId === 'back') {
            navigate('/admin-dashboard');
        }
    }

    const handleCredentials = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', credentials);
            console.log('Registration successful:', response.data);
            navigate('/admin-dashboard');
        } catch (error) {
            console.error('Error during registration:', error.response?.data || error.message);
        }
    };

    return (
        <Form className='form' onSubmit={handleSubmit}>
            <header className='header-title'>
                <h1>Create Account</h1>
            </header>
            <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Enter username" 
                    name="username" // Make sure to set the 'name' attribute to match the state keys
                    value={credentials.username}
                    onChange={handleCredentials} 
                />
            </Form.Group> 

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    name="password" // Make sure to set the 'name' attribute to match the state keys
                    value={credentials.password}
                    onChange={handleCredentials}
                />
            </Form.Group>
            <div>
                <Button variant="primary" onClick={() => handleButtonClick('back')}>Back</Button>
                <Button variant="primary" type="submit">Submit</Button>
            </div>
        </Form>
    );
}

export default Account;