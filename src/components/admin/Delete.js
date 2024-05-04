import React, { useState, useEffect } from 'react';
import { Alert, Button, Form, Row, Col, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Delete.css';
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://newpayrollmanagment.azurewebsites.net',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

function Delete() {
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // State hooks
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [deleteId, setDeleteId] = useState('');
    const [error, setError] = useState('');

    const itemsPerPage = 10;

    const handleButtonClick = (buttonId) => {
        if (buttonId === 'back') {
            navigate('/admin-dashboard');
        }
    }

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get('/employee/admin-all');
                setEmployees(response.data);
                setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            } catch (error) {
                setError('Error fetching employees: ' + error.message);
            }
        };

        fetchEmployees();
    }, [currentPage]); // Removed 'api' from the dependency array

    const handleInputChange = (e) => {
        setDeleteId(e.target.value);
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!deleteId) {
            setError('Please enter an employee ID to delete.');
            return;
        }
        try {
            await api.delete(`/employee/delete/${deleteId}`);
            setEmployees(employees.filter((employee) => employee.id.toString() !== deleteId));
            setError('');
            setDeleteId('');
            setSuccessMessage('Employee deleted successfully!');
        } catch (error) {
            setError('Failed to delete employee: ' + error.message);
        }
    };

    return (
        <div className='container my-5'>
            <h1>Delete Employee</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Row className='mb-3'>
                <Col md={6} className="mb-4">
                    <div className="detail-box">
                        <h2>Employee Details</h2>
                        <ul>
                            {employees.map(employee => (
                                <li key={employee.id}>
                                    id: {employee.id}, 
                                    first name: {employee.firstName}, 
                                    last name: {employee.lastName}, 
                                    hourly rate: {employee.hourlyRate}
                                </li>
                            ))}
                        </ul>
                        <Pagination>{/* Pagination logic */}</Pagination>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="input-box">
                        <Form onSubmit={handleDelete}>
                            <h2>Delete Employee</h2>
                            <Form.Group className="mb-3" controlId="formBasicId">
                                <Form.Label>Employee ID</Form.Label>
                                <Form.Control type="number" placeholder="Enter ID" value={deleteId} onChange={handleInputChange} />
                            </Form.Group>
                            <Button variant="danger" type="submit">
                                Delete
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Button variant='primary' onClick={() => handleButtonClick('back')}>Back</Button>
        </div>
    );
}

export default Delete;
