import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserImage from '../img/user.jpg';
import SalaryImage from '../img/salary.jpg';
import EmployeeImage from '../img/employee.jpg';
import DeleteEmployee from '../img/delete.jpg';
import UpdateEmployee from '../img/update.jpg';
import LeaveRequest from '../img/leave.jpg';
import '../css/AdminDash.css';

function AdminDash() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  const handleButtonClick = (buttonId) => {
    const routes = {
      'create-account': '/admin/account',
      'add-info': '/admin/add-employee',
      'create-salary': '/admin/salary',
      'update-employee': '/admin/update-employee',
      'review-leave': '/admin/review-leave',
      'delete-employee': '/admin/delete-employee'
    };

    const route = routes[buttonId];
    if (route) {
      navigate(route);
    } else {
      console.error('Invalid button ID');
      alert('Operation failed, please check logs.');
    }
  };

  return (
    <Container fluid="md" id='con'>
      <header className='header-title'>
        <h1>Admin Dashboard</h1>
        <Button variant="secondary" onClick={logout}>Logout</Button>
      </header>
      <Row>
        <Col className='col'>
          <div id='create-account'>
            <h2 className='title'>Create account</h2>
            <img src={UserImage} alt="user icon" className='icon-image' />
            <Button variant="primary" className='btn' onClick={() => handleButtonClick('create-account')}>Create</Button>
          </div>
        </Col>
        <Col className='col'>
          <div className='add-info'>
            <h2 className='title'>Add employee info</h2>
            <img src={EmployeeImage} alt="employee icon" className='icon-image' />
            <Button variant="primary" className='btn' onClick={() => handleButtonClick('add-info')}>Add</Button>
          </div>
        </Col>
        <Col className='col'>
          <div className='create-salary'>
            <h2 className='title'>Create salary</h2>
            <img src={SalaryImage} alt="salary icon" className='icon-image' />
            <Button variant="primary" className='btn' onClick={() => handleButtonClick('create-salary')}>Create</Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className='col'>
          <div className='update-employee'>
            <h2 className='title'>Update employee</h2>
            <img src={UpdateEmployee} alt="update icon" className='icon-image' />
            <Button variant="primary" onClick={() => handleButtonClick('update-employee')}>Update</Button>
          </div>
        </Col>
        <Col className='col'>
          <div className='review-leave'>
            <h2 className='title'>Review leave</h2>
            <img src={LeaveRequest} alt="leave icon" className='icon-image' />
            <Button variant="primary" className='btn' onClick={() => handleButtonClick('review-leave')}>Review</Button>
          </div>
        </Col>
        <Col className='col'>
          <div className='delete-employee'>
            <h2 className='title'>Delete employee</h2>
            <img src={DeleteEmployee} alt="delete icon" className='icon-image' />
            <Button variant="primary" className='btn' onClick={() => handleButtonClick('delete-employee')}>Delete</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDash;
