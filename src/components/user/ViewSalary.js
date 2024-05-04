import React, { useState, useEffect } from 'react';
import { Alert, Container, Card, Row, Col, Button, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: "https://newpayrollmanagment.azurewebsites.net",
  headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

function ViewSalary() {
  const navigate = useNavigate();
  const [currentSalary, setCurrentSalary] = useState(null);
  const [pastSalaries, setPastSalaries] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const salariesPerPage = 5;

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const [currentResponse, pastResponse] = await Promise.all([
          api.get('/salary/user-salary'),
          api.get('/salary/user-Salaries')
        ]);
        setCurrentSalary(currentResponse.data);
        setPastSalaries(pastResponse.data);
      } catch (error) {
        console.error('Error fetching salaries:', error);
        setError('Failed to fetch salaries.');
      }
    };

    fetchSalaries();
  }, []);

  const indexOfLastSalary = currentPage * salariesPerPage;
  const indexOfFirstSalary = indexOfLastSalary - salariesPerPage;
  const currentSalaries = pastSalaries.slice(indexOfFirstSalary, indexOfLastSalary);
  const totalPages = Math.ceil(pastSalaries.length / salariesPerPage);

  return (
    <Container className='my-5'>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Current Salary</Card.Header>
            <Card.Body>
              {currentSalary ? (
                <>
                  <Card.Text>Month: {currentSalary.month}</Card.Text>
                  <Card.Text>Worked Hours: {currentSalary.workedHours}</Card.Text>
                  <Card.Text>Total Salary: {currentSalary.totalSalary}</Card.Text>
                  <Card.Text>Hourly Rate: {currentSalary.hourlyRate}</Card.Text>
                </>
              ) : (
                <Alert variant="warning">No current salary data available.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Past Salaries</Card.Header>
            <Card.Body>
              {currentSalaries.length > 0 ? currentSalaries.map((salary, index) => (
                <div key={index} className="mb-3">
                  <Card.Text>Month: {salary.month}</Card.Text>
                  <Card.Text>Worked Hours: {salary.workedHours}</Card.Text>
                  <Card.Text>Total Salary: {salary.totalSalary}</Card.Text>
                  <Card.Text>Hourly Rate: {salary.hourlyRate}</Card.Text>
                </div>
              )) : (
                <Alert variant="info">No past salaries data available.</Alert>
              )}
              {totalPages > 1 && (
                <Pagination className="justify-content-center">
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Button variant='primary' onClick={() => navigate('/user-dashboard')}>Back</Button>
    </Container>
  );
}

export default ViewSalary;
