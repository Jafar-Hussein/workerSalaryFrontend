import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Pagination, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Employee.css';
import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

function Employees() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(6); // Antal anställda per sida
  
    useEffect(() => {
      fetchEmployees();
    }, []);
  
    // Hämta anställda från API
    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employee/all');
            setEmployees(response.data); // Förutsätter att svaret är en array av anställda
        } catch (error) {
            setError('Failed to fetch employees.');
            console.error('Error:', error);
        }
    };
    
    // Hämta aktuella anställda
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  
    // Byt sida
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    return (
        <div className='container my-5'>
            <h1>Employees</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
                {currentEmployees.map(employee => (
                    <Col md={4} key={employee.id}>
                        <ul className='info'>
                            <li><strong>Name:</strong> {employee.firstName} {employee.lastName}</li>
                            <li><strong>Email:</strong> {employee.email}</li>
                            <li><strong>Phone:</strong> {employee.phone}</li>
                            <li><strong>Job Title:</strong> {employee.jobTitle}</li>
                        </ul>
                    </Col>
                ))}
            </Row>
            <Pagination>
                {Array.from({ length: Math.ceil(employees.length / employeesPerPage) }, (_, i) => (
                    <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                        {i + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
            <Button variant='primary' onClick={() => navigate('/user-dashboard')}>Back</Button>
        </div>
    );
}

export default Employees;