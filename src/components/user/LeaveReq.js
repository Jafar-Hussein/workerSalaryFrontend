import React, { useState } from 'react';
import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://newpayrollmanagment.azurewebsites.net',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

function LeaveReq() {
    const navigate = useNavigate();
    const [leaveRequest, setLeaveRequest] = useState({
        startDate: new Date(),
        endDate: new Date(),
        status: 'PENDING',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // state to hold success message

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const handleChange = (name, value) => {
        if (name === 'startDate' || name === 'endDate') {
            value = formatDate(value);
        }
        setLeaveRequest({ ...leaveRequest, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear any previous errors
        setSuccessMessage(''); // Clear any previous messages
        try {
            await api.post('/leave-request/create', leaveRequest);
            setSuccessMessage('Leave request created successfully!'); // Set success message
            // navigate('/user-dashboard'); // Optionally navigate to dashboard after a delay
            // setTimeout(() => navigate('/user-dashboard'), 2000); // Navigate after 2 seconds
        } catch (error) {
            console.error('Error during leave request creation:', error.response?.data || error.message);
            setError('Failed to create leave request. Please try again.');
        }
    };

    return (
        <div className='container my-5'>
            <h1>Leave Request</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Start Date</Form.Label>
                    <Col sm={10}>
                        <DatePicker
                            selected={new Date(leaveRequest.startDate)}
                            onChange={(date) => handleChange('startDate', date)}
                            className="form-control"
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>End Date</Form.Label>
                    <Col sm={10}>
                        <DatePicker
                            selected={new Date(leaveRequest.endDate)}
                            onChange={(date) => handleChange('endDate', date)}
                            className="form-control"
                        />
                    </Col>
                </Form.Group>
                {/* The status field can be a hidden field or managed by the application state */}
                <div className="text-center">
                    <Button variant='primary' onClick={() => navigate('/user-dashboard')}>Back</Button>
                    <Button variant="primary" type="submit">Submit Request</Button>
                </div>
            </Form>
        </div>
    );
}

export default LeaveReq;