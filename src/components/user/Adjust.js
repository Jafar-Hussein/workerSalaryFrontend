import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Skapa en instans av Axios för att hantera API-förfrågningar, inklusive bas-URL och authorization-header
const api = axios.create({
  baseURL: 'http://localhost:5000', // Bas-URL för API-förfrågningar
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Hämta JWT-token från localStorage
  },
});

function Adjust() {
  const navigate = useNavigate(); // Hook för att navigera till andra sidor
  const [checkIns, setCheckIns] = useState([]); // State för att lagra användarens check-ins
  const [checkOuts, setCheckOuts] = useState([]); // State för att lagra användarens check-outs
  const [selectedCheckIn, setSelectedCheckIn] = useState(''); // State för vald check-in
  const [selectedCheckOut, setSelectedCheckOut] = useState(''); // State för vald check-out
  const [adjustCheckInTime, setAdjustCheckInTime] = useState(''); // Ny tid för att justera check-in
  const [adjustCheckOutTime, setAdjustCheckOutTime] = useState(''); // Ny tid för att justera check-out
  const [error, setError] = useState(''); // State för felmeddelanden

  // useEffect körs när komponenten laddas för att hämta check-ins och check-outs
  useEffect(() => {
    const fetchCheckInsAndOuts = async () => {
      try {
        // Hämta både check-ins och check-outs samtidigt
        const [checkInsResponse, checkOutsResponse] = await Promise.all([
          api.get('/check-in/emp-check-ins'), // Hämta användarens check-ins
          api.get('/check-out/emp-check-outs'), // Hämta användarens check-outs
        ]);
        setCheckIns(checkInsResponse.data); // Spara check-ins i state
        setCheckOuts(checkOutsResponse.data); // Spara check-outs i state
      } catch (error) {
        console.error('Error fetching check-ins and check-outs:', error);
        setError('Kunde inte hämta check-ins och check-outs.'); // Sätt felmeddelande om något går fel
      }
    };

    fetchCheckInsAndOuts(); // Kör funktionen för att hämta data
  }, []);

  // Funktion för att hantera justering av check-in eller check-out
  const handleAdjustment = async (selectedId, adjustTime, type) => {
    // Kontrollera att både ett val har gjorts och en ny tid har angetts
    if (!selectedId || !adjustTime) {
      setError(`Vänligen välj en ${type} och tid.`); // Visa felmeddelande om något saknas
      return;
    }

    const payload = {}; // Skapa objekt för att skicka data till backend
    if (type === 'check-in') {
      payload.newCheckInDateTime = adjustTime; // Sätt ny tid för check-in
    } else if (type === 'check-out') {
      payload.newCheckOutDateTime = adjustTime; // Sätt ny tid för check-out
    }

    console.log(`Justerar ${type} för ID ${selectedId} till ny tid ${adjustTime}`);
    console.log(`Payload skickad: `, payload);  // Logga payload för felsökning

    try {
      // Skicka PUT-förfrågan till API för att justera tid
      await api.put(`/${type}/${selectedId}`, payload);
      setError(''); // Nollställ felmeddelande om justeringen lyckas
      alert(`${type} tid justerad framgångsrikt.`); // Visa bekräftelsemeddelande
      navigate('/user-dashboard'); // Navigera tillbaka till användardashboard efter framgång
    } catch (error) {
      console.error(`Fel vid justering av ${type}:`, error);
      setError(`Kunde inte justera ${type}.`); // Sätt felmeddelande om något går fel
    }
  };

  return (
    <div className='container my-5'>
      <h1>Justera Check In/Out Tider</h1>
      {/* Visa felmeddelanden om de finns */}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={6}>
          <Form>
            <Form.Group controlId="checkInSelect">
              <Form.Label>Välj Check-In</Form.Label>
              <Form.Control as="select" value={selectedCheckIn} onChange={e => setSelectedCheckIn(e.target.value)}>
                <option value="">Välj</option>
                {/* Loopa igenom check-ins och visa dem i en dropdown */}
                {checkIns.map(checkIn => (
                  <option key={checkIn.id} value={checkIn.id}>
                    {checkIn.id} - {new Date(checkIn.checkInDate).toLocaleString()}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="checkInTime">
              <Form.Label>Ny Check-In Tid</Form.Label>
              <Form.Control
                type="datetime-local"
                value={adjustCheckInTime}
                onChange={e => setAdjustCheckInTime(e.target.value)} // Uppdatera state med ny tid
              />
            </Form.Group>
            <Button variant="primary" onClick={() => handleAdjustment(selectedCheckIn, adjustCheckInTime, 'check-in')}>
              Justera Check-In
            </Button> {/* Knapp för att justera check-in */}
          </Form>
        </Col>
        <Col md={6}>
          <Form>
            <Form.Group controlId="checkOutSelect">
              <Form.Label>Välj Check-Out</Form.Label>
              <Form.Control as="select" value={selectedCheckOut} onChange={e => setSelectedCheckOut(e.target.value)}>
                <option value="">Välj</option>
                {/* Loopa igenom check-outs och visa dem i en dropdown */}
                {checkOuts.map(checkOut => (
                  <option key={checkOut.id} value={checkOut.id}>
                    {checkOut.id} - {new Date(checkOut.checkOutDateTime).toLocaleString()}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="checkOutTime">
              <Form.Label>Ny Check-Out Tid</Form.Label>
              <Form.Control
                type="datetime-local"
                value={adjustCheckOutTime}
                onChange={e => setAdjustCheckOutTime(e.target.value)} // Uppdatera state med ny tid
              />
            </Form.Group>
            <Button variant="primary" onClick={() => handleAdjustment(selectedCheckOut, adjustCheckOutTime, 'check-out')}>
              Justera Check-Out
            </Button> {/* Knapp för att justera check-out */}
          </Form>
        </Col>
      </Row>
      {/* Knapp för att navigera tillbaka till användardashboard */}
      <Button variant='primary' onClick={() => navigate('/user-dashboard')}>Tillbaka</Button>
    </div>
  );
}

export default Adjust;
