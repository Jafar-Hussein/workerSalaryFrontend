import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://newpayrollmanagment.azurewebsites.net',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});

function Adjust() {
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState([]);
  const [checkOuts, setCheckOuts] = useState([]);
  const [selectedCheckIn, setSelectedCheckIn] = useState('');
  const [selectedCheckOut, setSelectedCheckOut] = useState('');
  const [adjustCheckInTime, setAdjustCheckInTime] = useState('');
  const [adjustCheckOutTime, setAdjustCheckOutTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCheckInsAndOuts = async () => {
      try {
        const [checkInsResponse, checkOutsResponse] = await Promise.all([
          api.get('/check-in/emp-check-ins'),
          api.get('/check-out/emp-check-outs'),
        ]);
        setCheckIns(checkInsResponse.data);
        setCheckOuts(checkOutsResponse.data);
      } catch (error) {
        console.error('Error fetching check-ins and check-outs:', error);
        setError('Failed to fetch check-ins and check-outs.');
      }
    };

    fetchCheckInsAndOuts();
  }, []);

  const handleAdjustment = async (selectedId, adjustTime, type) => {
    if (!selectedId || !adjustTime) {
      setError(`Please select a ${type} and time.`);
      return;
    }

    try {
      await api.put(`/${type}/${selectedId}`, {
        newDateTime: adjustTime,
      });
      setError('');
      alert(`${type} time adjusted successfully.`);
      navigate('/user-dashboard'); // Redirect after successful adjustment
    } catch (error) {
      console.error(`Error adjusting ${type}:`, error);
      setError(`Failed to adjust ${type}.`);
    }
  };

  return (
    <div className='container my-5'>
      <h1>Adjust Check In/Out Times</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={6}>
          <Form>
            <Form.Group controlId="checkInSelect">
              <Form.Label>Select Check-In</Form.Label>
              <Form.Control as="select" value={selectedCheckIn} onChange={e => setSelectedCheckIn(e.target.value)}>
                <option value="">Select</option>
                {checkIns.map(checkIn => (
                  <option key={checkIn.id} value={checkIn.id}>
                    {checkIn.id} - {new Date(checkIn.checkInDate).toLocaleString()}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="checkInTime">
              <Form.Label>New Check-In Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={adjustCheckInTime}
                onChange={e => setAdjustCheckInTime(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={() => handleAdjustment(selectedCheckIn, adjustCheckInTime, 'check-in')}>
              Adjust Check-In
            </Button>
          </Form>
        </Col>
        <Col md={6}>
          <Form>
            <Form.Group controlId="checkOutSelect">
              <Form.Label>Select Check-Out</Form.Label>
              <Form.Control as="select" value={selectedCheckOut} onChange={e => setSelectedCheckOut(e.target.value)}>
                <option value="">Select</option>
                {checkOuts.map(checkOut => (
                  <option key={checkOut.id} value={checkOut.id}>
                    {checkOut.id} - {new Date(checkOut.checkOutDateTime).toLocaleString()}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="checkOutTime">
              <Form.Label>New Check-Out Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={adjustCheckOutTime}
                onChange={e => setAdjustCheckOutTime(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={() => handleAdjustment(selectedCheckOut, adjustCheckOutTime, 'check-out')}>
              Adjust Check-Out
            </Button>
          </Form>
        </Col>
      </Row>
      <Button variant='primary' onClick={() => navigate('/user-dashboard')}>Back</Button>
    </div>
  );
}

export default Adjust;
