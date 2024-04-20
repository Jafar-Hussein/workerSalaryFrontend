import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/AddEmp.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Account() {
    const api = axios.create({
        baseURL: 'http://localhost:5000',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const navigate = useNavigate();
    const [employeeInfo, setEmployeeInfo] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        jobTitle: ''
    });

    const handleButtonClick = (buttonId) => {
        if (buttonId === 'back') {
            navigate('/admin-dashboard');
        }
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEmployeeInfo({ ...employeeInfo, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/employee/add', {
                username: employeeInfo.username,
                employeeDTO: {
                    firstName: employeeInfo.firstName,
                    lastName: employeeInfo.lastName,
                    email: employeeInfo.email,
                    phone: employeeInfo.phone,
                    address: employeeInfo.address,
                    city: employeeInfo.city,
                    jobTitle: employeeInfo.jobTitle,
                }
            });
            console.log('Employee info saved successfully');
            navigate('/admin-dashboard'); // Navigate to the dashboard on success
        } catch (error) {
            console.error('Error during employee info submission:', error.response?.data || error.message);
        }
    };

    return (
        <div className="container my-5">
            <Form id='form-info' onSubmit={handleSubmit}>
                <h1 className='mb-4'>Add information</h1>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label htmlFor="username">Username</Form.Label>
                            <Form.Control 
                                id="username" 
                                type="text" 
                                placeholder="Enter Username" 
                                value={employeeInfo.username} 
                                onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label htmlFor="firstName">First Name</Form.Label>
                            <Form.Control 
                                id="firstName" 
                                type="text" 
                                placeholder="Enter First Name" 
                                value={employeeInfo.firstName} 
                                onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label htmlFor="lastName">Last Name</Form.Label>
                            <Form.Control 
                                id="lastName" 
                                type="text" 
                                placeholder="Enter Last Name" 
                                value={employeeInfo.lastName} 
                                onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <Form.Control 
                                id="email" 
                                type="email" 
                                placeholder="Enter Email" 
                                value={employeeInfo.email} 
                                onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label htmlFor="phone">Phone Number</Form.Label>
                            <Form.Control 
                                id="phone" 
                                type="text" 
                                placeholder="Enter Phone Number" 
                                value={employeeInfo.phone} 
                                onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label htmlFor="address">Address</Form.Label>
                            <Form.Control 
                                id="address" 
                                type="text" 
                                placeholder="Enter Address" 
                                value={employeeInfo.address} 
                                onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label htmlFor="city">City</Form.Label>
                            <Form.Control 
                                id="city" 
                                type="text" 
                                placeholder="Enter City" 
                                value={employeeInfo.city} 
                                onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label htmlFor="jobTitle">Job Title</Form.Label>
                            <Form.Control 
                                id="jobTitle" 
                                type="text" 
                                placeholder="Enter Job Title" 
                                value={employeeInfo.jobTitle} 
                                onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" id='back' onClick={() => handleButtonClick('back')}>
                    Back
                </Button>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}
export default Account;