import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Account.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
function Account() {
    const navigate = useNavigate();
    const url = 'http://localhost:5000/auth/register';
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
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(credentials)
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Handle non-JSON responses
                throw new Error(`HTTP error! status: ${response.status}, Message: ${errorText}`);
            }
            
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const json = await response.json();
                console.log('Registration successful:', json);
                navigate('/admin-dashboard');
            } else {
                const textData = await response.text();
                console.log('Registration response:', textData);
            }
        } catch (error) {
            console.error('Error during registration:', error);
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