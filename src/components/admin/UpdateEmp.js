import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Pagination, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Update.css';


function Update() {
    const adminAllUrl = 'http://localhost:5000/employee/admin-all';
    const updateUrl = 'http://localhost:5000/employee/admin-update/';
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [formEmployee, setFormEmployee] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        jobTitle: '',
        hourlyRate: '',
    });
    const handleButtonClick = (buttonId) => {
        if (buttonId === 'back') {
            navigate('/admin-dashboard');
        }
    }
    const [error, setError] = useState('');
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(adminAllUrl, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                setEmployees(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage));
            } catch (error) {
                setError('Failed to fetch employees.');
                console.error('Error:', error);
            }
        };

        fetchEmployees();
    }, [adminAllUrl, currentPage, itemsPerPage]);

    const currentItems = employees.slice(
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormEmployee(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${updateUrl}${formEmployee.id}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formEmployee)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            navigate('/admin-dashboard');
        } catch (error) {
            setError('Failed to update employee.');
            console.error('Error:', error);
        }
    };

    return (
        <div className='container my-5'>
            <h1>Update Employee Information</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row className='mb-3'>
                <Col md={6} className="mb-4">
                    <div className="detail-box">
                        <h2>Employee Details</h2>
                        <ul>
                            {currentItems.map(employee => (
                                <li key={employee.id}>
                                    <strong>id: {employee.id}</strong><br /> first name: {employee.firstName}, last name: {employee.lastName}, email: {employee.email}, phone: {employee.phone}, address: {employee.address}, city: {employee.city}, job title: {employee.jobTitle}
                                </li>
                            ))}
                        </ul>
                        <Pagination>{paginationItems}</Pagination>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="input-box">
                    <Form onSubmit={handleSubmit}>
  <h2>Update Employee Details</h2>
  <Row>
    <Col md={6}>
      <Form.Group>
        <Form.Label>Employee ID</Form.Label>
        <Form.Control type="number" name="id" onChange={handleInputChange} placeholder='id' required />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group>
        <Form.Label>First Name</Form.Label>
        <Form.Control type="text" name="firstName" onChange={handleInputChange} placeholder='First Name' required />
      </Form.Group>
    </Col>
  </Row>
  <Row>
    <Col md={6}>
      <Form.Group>
        <Form.Label>Last Name</Form.Label>
        <Form.Control type="text" name="lastName" onChange={handleInputChange} placeholder='Last Name' required />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" onChange={handleInputChange} placeholder='Email' required />
      </Form.Group>
    </Col>
  </Row>
  <Row>
    <Col md={6}>
      <Form.Group>
        <Form.Label>Phone</Form.Label>
        <Form.Control type="text" name="phone" onChange={handleInputChange} placeholder='Phone' required />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group>
        <Form.Label>Address</Form.Label>
        <Form.Control type="text" name="address" onChange={handleInputChange} placeholder='Address' required />
      </Form.Group>
    </Col>
  </Row>
  <Row>
    <Col md={6}>
      <Form.Group>
        <Form.Label>City</Form.Label>
        <Form.Control type="text" name="city" onChange={handleInputChange} placeholder='City' required />
      </Form.Group>
    </Col>
    {/* If you have additional fields, continue laying them out in Row and Col structures here. */}
  </Row>
  <Button variant="primary" className="mt-3" type="submit">Update</Button>
</Form>
                    </div>
                </Col>
            </Row>
            <Button variant='primary' id='back' onClick={() => handleButtonClick('back')}>Back</Button>
        </div>
    );
}

export default Update;