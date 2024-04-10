import React, { useState, useEffect } from 'react';
import { Alert, Button, Form, Row, Col, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Delete.css';

function Delete(){
   // The endpoint URLs
   const getEmployeeUrl = 'http://localhost:5000/employee/admin-all';
   const deleteEmployeeUrl = 'http://localhost:5000/employee/delete/';
   const navigate = useNavigate();

  // State hooks
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteId, setDeleteId] = useState(''); // ID of the employee to be deleted
  const [error, setError] = useState(''); // Error message state

    const itemsPerPage = 10; // Define how many items you want per page
    const handleButtonClick = (buttonId) => {
        if (buttonId === 'back') {
            navigate('/admin-dashboard');
        }
    }
    useEffect(() => {
        // Function to fetch employee data
        const fetchEmployees = async () => {
            try {
                const response = await fetch(getEmployeeUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Token must be set correctly
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setEmployees(data); // Assuming the response is an array of employees
                setTotalPages(Math.ceil(data.length / itemsPerPage)); // Set the total number of pages
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, [currentPage]); // Fetch data when currentPage changes

    // Calculate the current items to display
    const currentItems = employees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Generate the Pagination items
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
        items.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
                {number}
            </Pagination.Item>
        );
    }
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
            const response = await fetch(`${deleteEmployeeUrl}${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setEmployees(employees.filter((employee) => employee.id.toString() !== deleteId));
            setError('');
            setDeleteId('');
            alert('Employee deleted successfully.');
        } catch (error) {
            setError('Failed to delete employee.');
            console.error('Error deleting employee:', error);
        }
    };

    return (
        <div className='container my-5'>
            <h1>Delete Employee</h1>
            {error && <Alert variant="danger">{error}</Alert>}
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
                        <Pagination>{items}</Pagination>
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