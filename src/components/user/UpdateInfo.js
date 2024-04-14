import React, { useState, useEffect } from 'react';
import { Alert, Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/UpdateInfo.css';
import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5000", // Your API base URL
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`

    }

});


function UpdateInfo() {
    const navigate = useNavigate();
    const [employeeInfo, setEmployeeInfo] = useState({ // Assuming you do not need to update the ID.
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: ''
        // Remove jobTitle as per your instruction.
    });
    useEffect(() => {
        // Fetch the current user's employee info when the component mounts
        api.get('/employee/current')
           .then(response => {
               setEmployeeInfo(response.data);
           })
           .catch(error => {
               setError('Failed to fetch employee info. Please try again.');
           });
    }, []);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
        
    
            const response = await api.put('/employee/user-update', employeeInfo, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Employee info updated successfully!');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Handle 401 error
                setError('Your session has expired. Please log in again.');
                // Redirect to login page or show login modal
            } else {
                setError('Failed to update employee info. Please try again.');
            }
        }
    };
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setEmployeeInfo({ ...employeeInfo, [name]: value });
    };

    return (
        <Container className='mt-4'>
            <h1>Update information</h1>
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Header>Current Information</Card.Header>
                        <Card.Body>
                            <p><strong>First Name:</strong> {employeeInfo.firstName}</p>
                            <p><strong>Last Name:</strong> {employeeInfo.lastName}</p>
                            <p><strong>Email:</strong> {employeeInfo.email}</p>
                            <p><strong>Phone:</strong> {employeeInfo.phone}</p>
                            <p><strong>Address:</strong> {employeeInfo.address}</p>
                            <p><strong>City:</strong> {employeeInfo.city}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>Update Your Information</Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>First Name</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={employeeInfo.firstName}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Last Name</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={employeeInfo.lastName}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Email</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={employeeInfo.email}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Phone</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            value={employeeInfo.phone}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Address</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={employeeInfo.address}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>City</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            value={employeeInfo.city}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Form.Group>
                                <div className="text-center">
                                    <Button variant="primary" type="submit">Save Changes</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Button variant='primary' onClick={() => navigate('/user-dashboard')}>Back</Button>
                
        </Container>
    );
}
export default UpdateInfo;