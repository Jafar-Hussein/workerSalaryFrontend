import React, { useState, useEffect } from 'react';
import { Alert, Button, Table, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Leave() {
    const navigate = useNavigate();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const itemsPerPage = 10; // You can set this to any number you like

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            const url = 'http://localhost:5000/leave-request/all'; // Ensure this URL is correct
            try {
                const response = await fetch(url, {
                    method: 'GET', // Explicitly state the method, even if GET is the default
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setLeaveRequests(data); // Assuming the response is an array of leave requests
                    console.log(data); // Debugging line to check the fetched data
                } else {
                    // If we reach here, there was a non-200 response code
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                // Handle any errors that occurred during the fetch
                console.error('Failed to fetch leave requests:', error);
                setError('Failed to fetch leave requests.');
            }
        };

        fetchLeaveRequests();
    }, [currentPage]); // currentPage dependency suggests pagination, ensure it's managed correctly

    const handleStatusChange = async (leaveRequestId, newStatus) => {
        if (!leaveRequestId) {
            console.error('The leaveRequestId is undefined.');
            setError('The leaveRequestId is undefined.');
            return;
        }
    
        // The URL should match your backend endpoint for updating leave request status
        const url = `http://localhost:5000/leave-request/${leaveRequestId}/status?status=${newStatus}`;
    
        try {
            const response = await fetch(url, {
                method: 'PUT', // or 'PATCH', depending on your backend setup
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (response.ok) {
                // If the status update is successful, update the state to reflect the change
                setLeaveRequests(leaveRequests.map(request => {
                    if (request.id === leaveRequestId) {
                        return { ...request, status: newStatus };
                    }
                    return request;
                }));
            } else {
                const errorResponse = await response.text();
                throw new Error(`Failed to update leave request status: ${errorResponse}`);
            }
        } catch (error) {
            console.error('Error updating leave request status:', error);
            setError('Failed to update leave request status. ' + error);
        }
    };
    
    // Pagination logic
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
            <td>{request.id}</td> {/* Use request.id instead of request.leaveRequestId */}
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
            <Button variant='secondary' onClick={() => navigate('/admin-dashboard')}>Back</Button>
        </div>
    );
}

export default Leave;