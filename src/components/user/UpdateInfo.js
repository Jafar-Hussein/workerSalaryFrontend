import React, { useState, useEffect } from 'react';
import { Alert, Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/UpdateInfo.css';
import axios from 'axios';

// Skapa en instans av Axios med bas-URL och authorization-header som hämtar JWT-token från localStorage
const api = axios.create({
    baseURL: "http://localhost:5000", // API-basen URL
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Använd JWT-token för autentisering
    }
});

function UpdateInfo() {
    const navigate = useNavigate(); // Hook för att navigera till olika sidor
    // State för att lagra och uppdatera anställdas information
    const [employeeInfo, setEmployeeInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: ''
    });

    const [error, setError] = useState(''); // State för att hantera felmeddelanden
    const [successMessage, setSuccessMessage] = useState(''); // State för att visa framgångsmeddelanden

    // useEffect körs vid komponentens första render för att hämta nuvarande anställdas information
    useEffect(() => {
        // Hämta information om den inloggade användarens anställda
        api.get('/employee/current')
           .then(response => {
               setEmployeeInfo(response.data); // Sätt den hämtade informationen i state
           })
           .catch(error => {
               setError('Kunde inte hämta information om anställda. Försök igen.'); // Sätt felmeddelande om något går fel
           });
    }, []);

    // Funktion för att hantera formulärskick
    const handleSubmit = async (event) => {
        event.preventDefault(); // Förhindra standardformulärskick
        try {
            const token = localStorage.getItem('token'); // Hämta token från localStorage
            
            // Skicka PUT-förfrågan till API för att uppdatera anställdas information
            await api.put('/employee/user-update', employeeInfo, {
                headers: {
                    'Authorization': `Bearer ${token}` // Skicka token för att autentisera förfrågan
                }
            });
            setSuccessMessage('Anställdas information uppdaterades framgångsrikt!'); // Visa framgångsmeddelande
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Hantera 401-fel (Obehörig)
                setError('Din session har gått ut. Logga in igen.');
            } else {
                setError('Kunde inte uppdatera information om anställda. Försök igen.'); // Visa felmeddelande vid fel
            }
        }
    };

    // Funktion för att hantera ändringar i formulärfält
    const handleChange = (event) => {
        const { name, value } = event.target; // Hämta namn och värde från formulärfältet
        setEmployeeInfo({ ...employeeInfo, [name]: value }); // Uppdatera motsvarande fält i state
    };

    return (
        <Container className='mt-4'>
            <h1>Uppdatera information</h1>
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Header>Nuvarande Information</Card.Header>
                        <Card.Body>
                            <p><strong>Förnamn:</strong> {employeeInfo.firstName}</p>
                            <p><strong>Efternamn:</strong> {employeeInfo.lastName}</p>
                            <p><strong>Email:</strong> {employeeInfo.email}</p>
                            <p><strong>Telefon:</strong> {employeeInfo.phone}</p>
                            <p><strong>Adress:</strong> {employeeInfo.address}</p>
                            <p><strong>Stad:</strong> {employeeInfo.city}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>Uppdatera Din Information</Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>} {/* Visa felmeddelanden */}
                            {successMessage && <Alert variant="success">{successMessage}</Alert>} {/* Visa framgångsmeddelanden */}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Förnamn</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={employeeInfo.firstName} // Bind fältet till employeeInfo state
                                            onChange={handleChange} // Hantera ändringar
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Efternamn</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={employeeInfo.lastName} // Bind fältet till employeeInfo state
                                            onChange={handleChange} // Hantera ändringar
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Email</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={employeeInfo.email} // Bind fältet till employeeInfo state
                                            onChange={handleChange} // Hantera ändringar
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Telefon</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            value={employeeInfo.phone} // Bind fältet till employeeInfo state
                                            onChange={handleChange} // Hantera ändringar
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Adress</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={employeeInfo.address} // Bind fältet till employeeInfo state
                                            onChange={handleChange} // Hantera ändringar
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Stad</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            value={employeeInfo.city} // Bind fältet till employeeInfo state
                                            onChange={handleChange} // Hantera ändringar
                                        />
                                    </Col>
                                </Form.Group>
                                <div className="text-center">
                                    <Button variant="primary" type="submit">Spara ändringar</Button>
                                </div> {/* Knapp för att spara ändringar */}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Button variant='primary' onClick={() => navigate('/user-dashboard')}>Tillbaka</Button> {/* Knapp för att navigera tillbaka */}
        </Container>
    );
}
export default UpdateInfo;
