import React, { useState } from 'react';
import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LeaveReq() {
    const navigate = useNavigate();
    const [leaveRequest, setLeaveRequest] = useState({
        startDate: new Date(),
        endDate: new Date(),
        status: 'PENDING', // Assuming the status is set by default to 'PENDING'
    });
    const [error, setError] = useState('');

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
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/leave-request/create', leaveRequest, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Leave request created successfully!');
        } catch (error) {
            setError('Failed to create leave request. Please try again.');
        }
    };

    return (
        <div className='container my-5'>
            <h1>Leave Request</h1>
            {error && <Alert variant="danger">{error}</Alert>}
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
