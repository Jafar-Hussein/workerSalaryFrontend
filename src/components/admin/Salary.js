import React, { useState, useEffect } from 'react';
import { Alert, Button, Form, Row, Col, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Salary.css';



const api = axios.create({
    baseURL: 'https://newpayrollmanagment.azurewebsites.net',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

function Salary() {
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get('/employee/admin-all');
                setEmployees(response.data);
                setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
    }, [currentPage]);

    const [formSalary, setFormSalary] = useState({
        employeeId: '',
        hourlyRate: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormSalary({ ...formSalary, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `/salary/set-salary/${formSalary.employeeId}`;
        const date = new Date();
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        try {
            await api.post(url, {
                month: yearMonth,
                workedHours: 0,
                hourlyRate: parseFloat(formSalary.hourlyRate)
            });
            console.log('Salary details set successfully');
            setSuccessMessage('Salary details set successfully!');
            setFormSalary({ employeeId: '', hourlyRate: '' }); // Reset the form
        } catch (error) {
            console.error('Error setting salary details:', error);
            setError('Failed to set salary details. Please try again.');
        }
    };

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
            <h1>Salary</h1>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Row className='mb-3'>
                <Col md={6} className="mb-4">
                    <div className="detail-box">
                        <h2>Employee Details</h2>
                        <ul>
                            {employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((employee, index) => (
                                <li key={index}>
                                    id: {employee.id}, 
                                    first name: {employee.firstName}, 
                                    last name: {employee.lastName}, 
                                    hourly rate: {employee.hourlyRate}
                                </li>
                            ))}
                        </ul>
                        <Pagination>{paginationItems}</Pagination>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="input-box">
                        <Form onSubmit={handleSubmit}>
                            <h2>Set Salary Details</h2>
                            <Form.Group>
                                <Form.Label htmlFor='employeeId'>Employee Id</Form.Label>
                                <Form.Control 
                                    id='employeeId' 
                                    type='number' 
                                    placeholder='Enter Id' 
                                    value={formSalary.employeeId} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor='hourlyRate'>Hourly Rate</Form.Label>
                                <Form.Control 
                                    id='hourlyRate' 
                                    type='number' 
                                    placeholder='Enter Hourly Rate' 
                                    value={formSalary.hourlyRate} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>
                            <Button variant='primary' onClick={() => navigate('/admin-dashboard')}>Back</Button>
                            <Button variant="primary" type="submit">
                                Set Salary
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Salary;
