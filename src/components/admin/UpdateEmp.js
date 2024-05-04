import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Pagination, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Update.css';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://newpayrollmanagment.azurewebsites.net',
  headers: {
       'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
function Update() {
  const [successMessage, setSuccessMessage] = useState('');
    const adminAllUrl = '/employee/admin-all';
    const updateUrl = '/employee/admin-update/';
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
              const response = await api.get(adminAllUrl);
              const data = response.data;
              setEmployees(data);
              setTotalPages(Math.ceil(data.length / itemsPerPage));
          } catch (error) {
              setError('Failed to fetch employees.');
              console.error('Error:', error);
          }
      };
  
      fetchEmployees();
  }, [currentPage, itemsPerPage]);

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
  
      if (!formEmployee.id) {
          setError('Please enter a valid Employee ID.');
          return;
      }
  
      try {
          const response = await api.put(url, formEmployee);
          if (response.status === 200) {
              setSuccessMessage('Employee updated successfully!');
              setError(''); // Clear any previous errors
  
              const updatedEmployees = employees.map(emp =>
                  emp.id === formEmployee.id ? { ...emp, ...formEmployee } : emp
              );
              setEmployees(updatedEmployees);
          } else {
              throw new Error('Failed to update employee.');
          }
      } catch (error) {
          setError('Failed to update employee. ' + error.response?.data?.message || error.message);
          console.error('Error:', error);
      }
  };
  
    return (
        <div className='container my-5'>
            <h1>Update Employee Information</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
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
    <Col md={6}>
      <Form.Group>
        <Form.Label>Job Title</Form.Label>
        <Form.Control type="text" name="jobTitle" onChange={handleInputChange} placeholder='Job Title' required />
      </Form.Group>
    </Col>
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