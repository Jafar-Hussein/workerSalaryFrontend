import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Pagination, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Adjust() {
  const getFormattedDateTimeForSweden = (dateTime) => {
    if (!dateTime || isNaN(new Date(dateTime).getTime())) {
        throw new Error('Invalid date-time value');
    }

    const date = new Date(dateTime);

    // Since the datetime-local input gives us local time, we need to adjust it to Swedish time.
    // We don't want to adjust for the local time zone offset because it's already in local time.
    
    // Determine if DST is in effect in Sweden and set the offset accordingly.
    const swedenOffset = date.getMonth() >= 2 && date.getMonth() <= 9 ? 2 : 1; // Rough check for DST

    // Calculate the time in Sweden by adding the offset (CET or CEST)
    const swedenTime = new Date(date.getTime() + (swedenOffset * 60 * 60000));

    // Convert to ISO string and remove the 'Z' to indicate it is local time without a timezone.
    return swedenTime.toISOString().replace('Z', '');
};

    const navigate = useNavigate();
    const [checkIns, setCheckIns] = useState([]);
    const [checkOuts, setCheckOuts] = useState([]);
    const [selectedCheckIn, setSelectedCheckIn] = useState('');
    const [selectedCheckOut, setSelectedCheckOut] = useState('');
    const [adjustCheckInTime, setAdjustCheckInTime] = useState('');
    const [adjustCheckOutTime, setAdjustCheckOutTime] = useState('');
    const [error, setError] = useState('');

    const [checkInAmPmTime, setCheckInAmPmTime] = useState({ hour: '', minute: '', period: 'AM' });
    const [checkOutAmPmTime, setCheckOutAmPmTime] = useState({ hour: '', minute: '', period: 'AM' });

    const convertAmPmTo24Hour = (amPmTime) => {
      let hour = parseInt(amPmTime.hour, 10);
      if (amPmTime.period === 'PM' && hour < 12) {
        hour += 12;
      } else if (amPmTime.period === 'AM' && hour === 12) {
        hour = 0;
      }
      return `${hour.toString().padStart(2, '0')}:${amPmTime.minute.padStart(2, '0')}`;
    };
  
    useEffect(() => {
        fetchCheckIns();
        fetchCheckOuts();
    }, []);
    const fetchCheckOuts = async () => {
        try {
            const response = await fetch('http://localhost:5000/check-out/emp-check-outs', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCheckOuts(data);
        } catch (error) {
            console.error('Error fetching check-outs:', error);
            setError('Failed to fetch check-outs.');
        }
    };
    

      const fetchCheckIns = async () => {
        try {
          const response = await fetch('http://localhost:5000/check-in/emp-check-ins', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setCheckIns(data);  // Make sure this is setting data correctly
          console.log(data);  // Add a console.log here to see what data is being set
        } catch (error) {
          console.error('Error fetching check-ins:', error);
          setError('Failed to fetch check-ins.');
        }
    };
    
    const handleCheckInAdjustment = async (e) => {
      e.preventDefault();
      const checkInTime24 = convertAmPmTo24Hour(checkInAmPmTime);
      const checkOutTime24 = convertAmPmTo24Hour(checkOutAmPmTime);
      try {
        if (!selectedCheckIn) {
            throw new Error('No check-in selected.');
        }
        if (!adjustCheckInTime) {
            throw new Error('Invalid check-in time provided.');
        }
        
        const formattedCheckInTime = getFormattedDateTimeForSweden(adjustCheckInTime);
          const response = await fetch(`http://localhost:5000/check-in/${selectedCheckIn}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({
                  newCheckInDateTime: formattedCheckInTime,
              }),
          });
  
          if (!response.ok) {
          }
          await fetchCheckIns();
          setError('');
          alert('Check-in time adjusted successfully.');
      } catch (error) {
          console.error('Error adjusting check-in:', error);
          setError(error.message || 'Failed to adjust check-in.');
      }
  };
    

      const handleCheckOutAdjustment = async (e) => {
        e.preventDefault();
        const formattedCheckOutTime = getFormattedDateTimeForSweden(adjustCheckOutTime);

        if (!selectedCheckOut) {
            console.error('No check-out selected.');
            setError('Please select a check-out to adjust.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/check-out/${selectedCheckOut}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                  newCheckOutDateTime: formattedCheckOutTime, // Use the formattedCheckOutTime variable here
              }),
            });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          // Fetch check-outs again to update the list after the adjustment
          fetchCheckOuts();
          setError('');
          alert('Check-out time adjusted successfully.');
        } catch (error) {
          console.error('Error adjusting check-out:', error);
          setError('Failed to adjust check-out.');
        }
      };
      return (
        <div className='container my-5'>
            <h1>Adjust Check In/Out Times</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
                <Col md={6}>
                    <Form onSubmit={handleCheckInAdjustment}>
                        <Form.Group controlId="checkInSelect">
                            <Form.Label>Select Check-In</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={selectedCheckIn || ''} 
                                onChange={(e) => setSelectedCheckIn(e.target.value)}
                            >
                               <option value="">select</option>
                                {checkIns.map((checkIn) => (
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
                                onChange={(e) => setAdjustCheckInTime(e.target.value)} 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Adjust Check-In</Button>
                    </Form>
                </Col>
                <Col md={6}>
                    <Form onSubmit={handleCheckOutAdjustment}>
                        <Form.Group controlId="checkOutSelect">
                            <Form.Label>Select Check-Out</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={selectedCheckOut || ''} 
                                onChange={(e) => setSelectedCheckOut(e.target.value)}
                            >
                              <option value="">select</option>
                                {checkOuts.map((checkOut) => (
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
                                onChange={(e) => setAdjustCheckOutTime(e.target.value)} 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Adjust Check-Out</Button>
                    </Form>
                </Col>
            </Row>
            <Button variant='primary' onClick={() => navigate('/user-dashboard')}>Back</Button>
        </div>
    );
}

export default Adjust;