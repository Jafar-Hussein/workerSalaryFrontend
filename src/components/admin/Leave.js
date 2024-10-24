import React, { useState, useEffect } from 'react';
import { Alert, Button, Table, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Leave() {
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const api = axios.create({
        baseURL: 'http://localhost:5000',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const itemsPerPage = 10;

    // Hämta ledighetsförfrågningar när komponenten laddas eller när currentPage eller api ändras
    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const response = await api.get('/leave-request/all');
                setLeaveRequests(response.data);
            } catch (error) {
                console.error('Failed to fetch leave requests:', error);
                setError('Failed to fetch leave requests.');
            }
        };

        fetchLeaveRequests();
    }, [currentPage, api]); // Inkludera 'api' i beroendearrayen

    // Hantera statusändring för en ledighetsförfrågan
    const handleStatusChange = async (leaveRequestId, newStatus) => {
        try {
            await api.put(`/leave-request/${leaveRequestId}/status?status=${encodeURIComponent(newStatus)}`);
            setSuccessMessage('Leave request status updated successfully!');    
            setLeaveRequests(leaveRequests.map(request => 
                request.id === leaveRequestId ? { ...request, status: newStatus } : request
            ));
        } catch (error) {
            console.error('Error updating leave request status:', error);
            setError('Failed to update leave request status.');
        }
    };

    // Paginering logik
    const totalPages = Math.ceil(leaveRequests.length / itemsPerPage);
    const currentLeaveRequests = leaveRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    let paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
                {number}
            </Pagination.Item>
        );
    }

    return (
        <div className='container my-5'>
            <h1>Leave Requests</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Employee Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentLeaveRequests.map((request) => (
                        <tr key={request.id}>
                            <td>{request.id}</td> 
                            <td>{request.employeeName}</td>
                            <td>{request.startDate}</td>
                            <td>{request.endDate}</td>
                            <td>{request.status}</td>
                            <td>
                                <Button variant="success" onClick={() => handleStatusChange(request.id, 'ACCEPTED')}>Accept</Button>
                                <Button variant="danger" onClick={() => handleStatusChange(request.id, 'DENIED')}>Deny</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>{paginationItems}</Pagination>
            <Button variant='primary' onClick={() => navigate('/admin-dashboard')}>Back</Button>
        </div>
    );
}

export default Leave;