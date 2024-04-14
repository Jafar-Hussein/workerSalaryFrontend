import React, { useState, useEffect } from 'react';
import { Pagination, Alert, Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewSalary(){
    const currentMontUrl = 'http://localhost:5000/salary/user-salary';
    const pastSalaryUrl = 'http://localhost:5000/salary/user-Salaries';
    const navigate = useNavigate();
    const [currentSalary, setCurrentSalary] = useState([]);
    const [pastSalaries, setPastSalaries] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
  const [salariesPerPage] = useState(5); 
    useEffect(() => {
        fetchCurrentSalary();
        fetchPastSalaries();
    }, []);

    const fetchCurrentSalary = async () => {
    try{
        const response = await fetch(currentMontUrl, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
        const data = await response.json();
        setCurrentSalary(data);
    
    } catch (error) {
    setError('Failed to fetch current salary.');
    console.error('Error:', error);
} 
};

const fetchPastSalaries = async () => {
    try {
        const response = await fetch(pastSalaryUrl, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPastSalaries(data);
    }
    catch (error) {
        setError('Failed to fetch past salaries.');
        console.error('Error:', error);
    }
}
 // Calculate the total pages for pagination
 // Pagination logic remains the same...
  const indexOfLastSalary = currentPage * salariesPerPage;
  const indexOfFirstSalary = indexOfLastSalary - salariesPerPage;
  const currentSalaries = pastSalaries.slice(indexOfFirstSalary, indexOfLastSalary);

  const totalPages = Math.ceil(pastSalaries.length / salariesPerPage);
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
        {number}
      </Pagination.Item>,
    );
  }


 return (
    <Container className='my-5'>
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
              {currentSalaries.length > 0 ? (
                currentSalaries.map((salary, index) => (
                  <div key={index} className="mb-3">
                    <Card.Text>Month: {salary.month}</Card.Text>
                    <Card.Text>Worked Hours: {salary.workedHours}</Card.Text>
                    <Card.Text>Total Salary: {salary.totalSalary}</Card.Text>
                    <Card.Text>Hourly Rate: {salary.hourlyRate}</Card.Text>
                  </div>
                ))
              ) : (
                <Alert variant="info">No past salaries data available.</Alert>
              )}
              {/* Pagination controls within the past salary card */}
              {totalPages > 1 && <Pagination className="justify-content-center">{paginationItems}</Pagination>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Button variant='primary' onClick={() => navigate('/user-dashboard')}>Back</Button>
    </Container>
  );
}
export default ViewSalary;