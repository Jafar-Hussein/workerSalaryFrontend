import React, { useState } from 'react';
import { Alert, Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Account.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const api = axios.create({
    baseURL: 'https://newpayrollmanagment.azurewebsites.net',
    headers: { 
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

function Account() {
    const [successMessage, setSuccessMessage] = useState('');
const [error, setError] = useState('');
    const navigate = useNavigate();
   
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
        // Check if either username or password is empty
        if (!credentials.username.trim() || !credentials.password.trim()) {
            setError('Please fill in all fields.');
            return; // Exit the function to prevent submitting
        }
        
        try {
            const response = await api.post('/auth/register', credentials);
            setSuccessMessage('Account created successfully!');
            setError(''); // Clear any previous errors
        } catch (error) {
            setError('Failed to create account. Please try again.');
        }
    };
    

    return (
        <Form className='form' onSubmit={handleSubmit}>
            <header className='header-title'>
                <h1>Create Account</h1>
            </header>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
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