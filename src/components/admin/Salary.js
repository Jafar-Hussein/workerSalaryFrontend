import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Salary.css';

function Salary() {
    const getEmployeeUrl= 'http://localhost:5000/employee/admin-all';
    const setEmployeeSalaryUrl = 'http://localhost:5000/salary/set-salary/';
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const itemsPerPage = 10; // Define how many items you want per page

    useEffect(() => {
        // Function to fetch employee data
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5000/employee/admin-all', {
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
    const [formSalary, setFormSalary] = useState({
        employeeId: '',
        hourlyRate: '',
    });
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormSalary({ ...formSalary, [id]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = setEmployeeSalaryUrl + formSalary.employeeId; // Concatenate the employee ID to the URL
        const date = new Date();
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Format as 'yyyy-MM'
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token must be set correctly
                },
                body: JSON.stringify({
                    month: yearMonth, // Send the formatted 'yyyy-MM' string
                    workedHours: 0, // You might want to add a way to set this
                    hourlyRate: parseFloat(formSalary.hourlyRate), // Convert the string hourly rate to a float
                    // You may need additional fields depending on your SalaryDTO
                }),
            });
    
            if (!response.ok) {
                const errorBody = await response.text(); // Get the error message from the server
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
            }
    
            console.log('Salary details set successfully');
            // Maybe do something here, like clearing the form or showing a success message
        } catch (error) {
            console.error('Error setting salary details:', error);
        }
    };
    return (
        <div className='container my-5'>
            <h1>Salary</h1>
            <Row className='mb-3'>
                <Col md={6} className="mb-4">
                    <div className="detail-box">
                        <h2>Employee Details</h2>
                        <ul>
                            {currentItems.map((employee, index) => (
                                <li key={index}>
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
                {/* Form for employee ID and hourly rate */}
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
                            <Form.Label htmlFor='HourlyRate'>Hourly Rate</Form.Label>
                            <Form.Control 
                                id='hourlyRate' 
                                type='number'  // Changed type to 'number' for hourlyRate
                                placeholder='Enter Hourly Rate' 
                                value={formSalary.hourlyRate} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
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