import React, { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Account.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { 
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

    // Hantera knappklick
    const handleButtonClick = (buttonId) => {
        if (buttonId === 'back') {
            navigate('/admin-dashboard');
        }
    }

    // Hantera ändringar i inloggningsuppgifterna
    const handleCredentials = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    // Hantera formulärinlämning
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Kontrollera om användarnamn eller lösenord är tomt
        if (!credentials.username.trim() || !credentials.password.trim()) {
            setError('Please fill in all fields.');
            return; // Avsluta funktionen för att förhindra inlämning
        }
        
        try {
            await api.post('/auth/register', credentials);
            setSuccessMessage('Account created successfully!');
            setError(''); // Rensa tidigare fel
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
                    name="username" // Se till att 'name'-attributet matchar state-nycklarna
                    value={credentials.username}
                    onChange={handleCredentials} 
                />
            </Form.Group> 

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    name="password" // Se till att 'name'-attributet matchar state-nycklarna
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