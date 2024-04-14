import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

function AdjustLeave() {
    const navigate = useNavigate();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [dates, setDates] = useState({
        startDate: new Date(),
        endDate: new Date(),
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const response = await api.get('/leave-request/employee');
                console.log("Response data:", response.data); // This will show you what you're actually getting back.
                if (Array.isArray(response.data)) {
                    console.log("Leave Requests: ", response.data); // Check if IDs are present in the data
                    setLeaveRequests(response.data);
                } else {
                    setError('Data format incorrect, expected an array');
                }
            } catch (error) {
                setError('Failed to fetch leave requests. Please try again.');
                console.error('Error:', error);
            }
        };
    
        fetchLeaveRequests();
    }, []);
    

    const handleDateChange = (name, date) => {
        setDates({ ...dates, [name]: date });
    };

    const handleLeaveRequestChange = (event) => {
        const id = event.target.value;
        const leaveRequest = leaveRequests.find(lr => lr.id.toString() === id);
        if (!leaveRequest) {
            setError('Selected leave request not found.');
            return;
        }
        console.log("Selected leave request: ", leaveRequest); // Log the selected leave request.
        setSelectedLeaveRequest(leaveRequest);
        setDates({
            startDate: new Date(leaveRequest.startDate),
            endDate: new Date(leaveRequest.endDate)
        });
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!selectedLeaveRequest || selectedLeaveRequest.id == null) {
            setError('Please select a valid leave request to adjust.');
            return;
        }
        setSuccessMessage('');
        const formattedStartDate = dates.startDate.toISOString().split('T')[0];
        const formattedEndDate = dates.endDate.toISOString().split('T')[0];
    
        try {
            const response = await api.put(`/leave-request/${selectedLeaveRequest.id}/dates`, {
                startDate: formattedStartDate,
                endDate: formattedEndDate
            });
    
            if (response.status === 200) {
                await updateLeaveRequests(); // Call the function to re-fetch the leave requests
                setSelectedLeaveRequest(null); // Reset selected leave request
                setDates({ startDate: new Date(), endDate: new Date() }); // Reset dates
                setSuccessMessage('Leave request dates updated successfully!');
            } else {
                setError(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            if (error.response) {
                setError(`Failed to update leave request dates. Server responded with status: ${error.response.status}`);
            } else {
                setError('Failed to update leave request dates. Please check your network and try again.');
            }
        }
    };
    
    const updateLeaveRequests = async () => {
        try {
            const response = await api.get('/leave-request/employee');
            if (Array.isArray(response.data)) {
                setLeaveRequests(response.data);
            } else {
                setError('Data format incorrect, expected an array');
            }
        } catch (error) {
            setError('Failed to fetch leave requests. Please try again.');
        }
    };
    return (
        <div className='container my-5'>
            <h1>Adjust Leave Request</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Select Leave Request</Form.Label>
                    <Col sm={10}>
                    <Form.Control as="select" onChange={handleLeaveRequestChange}>
    <option value="">Select a leave request...</option>
    {leaveRequests.map(lr => (
        <option key={lr.id} value={lr.id}>
            {`${lr.id} - ${lr.startDate} to ${lr.endDate}`}
        </option>

    ))}
</Form.Control>

                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Start Date</Form.Label>
                    <Col sm={10}>
                        <DatePicker
                            selected={dates.startDate}
                            onChange={date => handleDateChange('startDate', date)}
                            className="form-control"
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>End Date</Form.Label>
                    <Col sm={10}>
                        <DatePicker
                            selected={dates.endDate}
                            onChange={date => handleDateChange('endDate', date)}
                            className="form-control"
                        />
                    </Col>
                </Form.Group>
                <div className="text-center">
                    <Button variant='primary' onClick={() => navigate('/user-dashboard')}>Back</Button>
                    <Button variant="primary" type="submit">Adjust Dates</Button>
                </div>
            </Form>
        </div>
    );
}

export default AdjustLeave;
