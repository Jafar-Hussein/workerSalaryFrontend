import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import CheckIn from '../img/checkin.jpg';
import Adjust from '../img/adjust.jpg';
import GetAll from '../img/employee.jpg';
import Salary from '../img/salary.jpg';
import Update from '../img/update.jpg';
import Leave from '../img/leave.jpg';
import CheckOut from '../img/checkout.jpg';
import '../css/UserDash.css';
import axios from 'axios';

function UserDash() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckInOut = async (type) => {
    setLoading(true);
    try {
      const response = await axios.post(`https://newpayrollmanagment.azurewebsites.net/${type}/`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage(response.data.message);
      console.log(response.data.message);
    } catch (error) {
      console.error(`Error during ${type}:`, error);
      setMessage(`${type.replace('-', ' ')} failed`);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <Container fluid="md" id='con'>
      <header className='header-title'>
        <h1>Employee Dashboard</h1>
        <Button variant="secondary" onClick={logout}>Logout</Button>
      </header>
      <Row>
        <Col className='col'>
          <div className='emp-log'>
            <h2 className='title'>Check in</h2>
            <img src={CheckIn} alt="Check in icon" className='icon-image' />
            <Button variant="primary" className='btn' onClick={() => handleCheckInOut('check-in')} disabled={loading}>Check In</Button>
          </div>
        </Col>
        <Col className='col'>
          <div className='adjust-log'>
            <h2 className='title'>Adjust check in/out</h2>
            <img src={Adjust} alt="Adjust icon" className='icon-image' />
            <Button variant="primary" className='btn' onClick={() => navigate('/user/adjust-in-out')}>Adjust</Button>
          </div>
        </Col>
        <Col className='col'>
          <div className='get-coworkers'>
            <h2 className='title'>Get coworkers</h2>
            <img src={GetAll} alt="Coworkers icon" className='icon-image' />
            <Button variant="primary" className='btn' onClick={() => navigate('/user/employees')}>Get</Button>
          </div>
        </Col>
        <Col className='col'>
          <div className="view-salary">
            <h2 className='title'>View salary</h2>
            <img src={Salary} alt="Salary icon" className='icon-image' />
            <Button variant="primary" className='btn' onClick={() => navigate('/user/view-salary')}>View</Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className='col'>
          <div className='update-info'>
            <h2 className='title'>Update info</h2>
            <img src={Update} alt="Update info icon" className='icon-image' />
            <Button variant="primary" className='btn' onClick={() => navigate('/user/update-info')}>Update</Button>
          </div>
        </Col>
        <Col className='col'>
          <div className='leave-request'>
            <h2 className='title'>Leave request</h2>
            <img src={Leave} alt="Leave request icon" className='icon-image' />
            <Link to="/user/leave-request" className="btn btn-primary">Leave</Link>
          </div>
        </Col>
        <Col className='col'>
          <div className='adjust-leave'>
            <h2 className='title'>Adjust leave</h2>
            <img src={Adjust} alt="Adjust leave icon" className='icon-image' />
            <Button variant="primary" className='btn' onClick={() => navigate('/user/adjust-leave')}>Adjust</Button>
          </div>
        </Col>
        <Col className='col'>
          <div className="check-out">
            <h2 className='title'>Check out</h2>
            <img src={CheckOut} alt="Check out icon" className='icon-image' />
            <Button variant="primary" className='btn' onClick={() => handleCheckInOut('check-out')} disabled={loading}>Check Out</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default UserDash;
