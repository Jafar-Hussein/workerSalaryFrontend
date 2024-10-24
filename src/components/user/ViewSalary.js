import React, { useState, useEffect } from 'react';
import { Alert, Container, Card, Row, Col, Button, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Skapa en instans av Axios med bas-URL och lägg till JWT-token i headers
const api = axios.create({
  baseURL: "http://localhost:5000", // Bas-URL för API-förfrågningar
  headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Lägg till JWT-token från localStorage för autentisering
  }
});

function ViewSalary() {
  const navigate = useNavigate(); // Hook för att navigera till olika sidor
  const [currentSalary, setCurrentSalary] = useState(null); // State för nuvarande lön
  const [pastSalaries, setPastSalaries] = useState([]); // State för tidigare löner
  const [error, setError] = useState(''); // State för felmeddelanden
  const [currentPage, setCurrentPage] = useState(1); // State för att hålla reda på den aktuella sidan
  const salariesPerPage = 5; // Antal löner som visas per sida

  // useEffect för att hämta nuvarande och tidigare löner när komponenten laddas
  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        // Skicka två parallella API-förfrågningar för att hämta nuvarande och tidigare löner
        const [currentResponse, pastResponse] = await Promise.all([
          api.get('/salary/user-salary'), // Hämta nuvarande lön
          api.get('/salary/user-Salaries') // Hämta tidigare löner
        ]);
        setCurrentSalary(currentResponse.data); // Sätt nuvarande lön i state
        setPastSalaries(pastResponse.data); // Sätt tidigare löner i state
      } catch (error) {
        console.error('Error fetching salaries:', error);
        setError('Failed to fetch salaries.'); // Sätt felmeddelande om något går fel
      }
    };

    fetchSalaries(); // Kör funktionen för att hämta data
  }, []);

  // Beräkna vilken lön som är den sista och första på nuvarande sida
  const indexOfLastSalary = currentPage * salariesPerPage;
  const indexOfFirstSalary = indexOfLastSalary - salariesPerPage;
  
  // Filtrera löner som visas på nuvarande sida
  const currentSalaries = pastSalaries.slice(indexOfFirstSalary, indexOfLastSalary);

  // Beräkna totala antal sidor
  const totalPages = Math.ceil(pastSalaries.length / salariesPerPage);

  return (
    <Container className='my-5'>
      {/* Visa felmeddelande om något går fel */}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Nuvarande Lön</Card.Header>
            <Card.Body>
              {currentSalary ? (
                <>
                  <Card.Text>Månad: {currentSalary.month}</Card.Text>
                  <Card.Text>Arbetade Timmar: {currentSalary.workedHours}</Card.Text>
                  <Card.Text>Total Lön: {currentSalary.totalSalary}</Card.Text>
                  <Card.Text>Timlön: {currentSalary.hourlyRate}</Card.Text>
                </>
              ) : (
                <Alert variant="warning">Ingen data tillgänglig för nuvarande lön.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Tidigare Löner</Card.Header>
            <Card.Body>
              {/* Visa tidigare löner om de finns */}
              {currentSalaries.length > 0 ? currentSalaries.map((salary, index) => (
                <div key={index} className="mb-3">
                  <Card.Text>Månad: {salary.month}</Card.Text>
                  <Card.Text>Arbetade Timmar: {salary.workedHours}</Card.Text>
                  <Card.Text>Total Lön: {salary.totalSalary}</Card.Text>
                  <Card.Text>Timlön: {salary.hourlyRate}</Card.Text>
                </div>
              )) : (
                <Alert variant="info">Ingen data tillgänglig för tidigare löner.</Alert>
              )}
              {/* Visa paginering om det finns fler än en sida med löner */}
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
      {/* Knapp för att navigera tillbaka till användardashboard */}
      <Button variant='primary' onClick={() => navigate('/user-dashboard')}>Tillbaka</Button>
    </Container>
  );
}

export default ViewSalary;
