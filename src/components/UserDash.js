import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserDash.css';
import CheckIn from '../img/checkin.jpg';
import Adjust from '../img/adjust.jpg';
import GetAll from '../img/employee.jpg';
import Salary from '../img/salary.jpg';
import Update from '../img/update.jpg';
import Leave from '../img/leave.jpg';
import CheckOut from '../img/checkout.jpg';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


import axios from 'axios';
const api = axios.create({
  baseURL: 'https://newpayrollmanagment.azurewebsites.net',
  headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
function UserDash() {
  const navigate = useNavigate();

  const logout = () => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    
    // Redirect to the login page
    navigate('/');
    
    // Reload the page to ensure all data is cleared
    window.location.reload();
  };
  
  

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  // Function to handle Check In
  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const response = await api.post('/check-in/');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error during check-in:', error);
      setMessage('Check-in failed');
    }
    setLoading(false);
  };
  
  // Function to handle Check Out
  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const response = await api.post('/check-out/');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error during check-out:', error);
      setMessage('Check-out failed');
    }
    setLoading(false);
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
          <img src={CheckIn} alt="user icon" className='icon-image' />
          <>
            <Button variant="primary" 
            className='btn' 
            onClick={handleCheckIn}
            disabled={loading}>Check In</Button>{' '}
            </>
        </div>
        </Col>
        <Col className='col'>
          <div className='adjust-log'>
            <h2 className='title'> Adjust check in/out</h2>
            <img src={Adjust} alt="user icon" className='icon-image' />
            <>
            <Button variant="primary" className='btn' onClick={() => navigate('/user/adjust-in-out')}>Adjust</Button>
            </>
          </div>
        </Col>
        <Col className='col'>
          <div className='get-coworkers'>
            <h2 className='title'>Get coworkers</h2>
            <img src={GetAll} alt="user icon" className='icon-image' />
            <>
            <Button variant="primary" className='btn' onClick={() => navigate('/user/employees')}>Get</Button>
            </>
          </div>
        </Col>
        <Col className='col'>
          <div className="view-salary">
            <h2 className='title'>View salary</h2>
            <img src={Salary} alt="user icon" className='icon-image' />
            <>
            <Button variant="primary" className='btn' onClick={() => navigate('/user/view-salary')}>View</Button>
            </>
          </div>
        </Col>
      </Row>
      <Row>
      <Col className='col'>
        <div className='update-info'>
          <h2 className='title'>Update info</h2>
          <img src={Update} alt="user icon" className='icon-image' />
          <>
          <Button variant="primary" className='btn' onClick={() => navigate('/user/update-info')}>Update</Button>
            </>
        </div>
        </Col>
        <Col className='col'>
          <div className='leave-request'>
            <h2 className='title'>Leave request</h2>
            <img src={Leave} alt="user icon" className='icon-image' />
            <>
            <Link to="/user/leave-request" className="btn btn-primary">Leave</Link>

            </>
          </div>
        </Col>
        <Col className='col'>
          <div className='adjust-leave'>
            <h2 className='title'>Adjust leave</h2> 
            <img src={Adjust} alt="user icon" className='icon-image' />
            <>
      
            <Button variant="primary" className='btn' onClick={() => navigate('/user/adjust-leave')}>Adjust</Button>

            </>
          </div>
        </Col>
        <Col className="col">
          <div className="check-out">
            <h2 className='title'>Check out</h2>
            <img src={CheckOut} alt="user icon" className='icon-image' />
            <>
            <Button variant="primary" 
            className='btn' 
            onClick={handleCheckOut}
            disabled={loading}>Check Out</Button>{' '}
            </>
          </div>
        </Col>
      </Row>
   </Container>
  );
}

export default UserDash;