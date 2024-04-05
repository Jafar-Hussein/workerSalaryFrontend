import React from 'react';
import UserImage from '../img/user.jpg';
import SalaryImage from '../img/salary.jpg';
import EmployeeImage from '../img/employee.jpg';
import DeleteEmployee from '../img/delete.jpg';
import UpdateEmployee from '../img/update.jpg';
import LeaveRequest from '../img/leave.jpg';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AdminDash.css';
import Button from 'react-bootstrap/Button';


function AdminDash() {
  return (
    <Container fluid="md" id='con'>
      <header className='header-title'>
      <h1>Admin Dashboard</h1>
      </header>
      <Row>
        <Col className='col'>
          <div id='create-account'>
            <h2 className='title'>Create account</h2>
            <img src={UserImage} alt="user icon" roundedCircle  className='icon-image' />
            <>
            <Button variant="primary" className='btn'>Create</Button>{' '}
            </>
        </div>
        </Col>
        <Col className='col'>
          <div className='add-info'>
            <h2 className='title'>Add employee info</h2>
            <img src= {EmployeeImage} alt="employee icon" className='icon-image' />
            <>
            <Button variant="primary" className='btn'>Add</Button>{' '}
            </>
        </div>
        </Col>
        <Col className='col'>
          <div className='create-salary'>
            <h2 className='title'>create salary</h2>
            <img src= {SalaryImage} alt="salary icon" className='icon-image' />
            <>
            <Button variant="primary" className='btn'>Create</Button>{' '}
            </>
        </div>
        </Col>
      </Row>
      <Row>
        <Col className='col'>
          <div className='update-employee'>
            <h2 className='title'>Update employee</h2>
            <img src= {UpdateEmployee} alt="update icon" className='icon-image' />
            <>
            <Button variant="primary">Create</Button>{' '}
            </>
            </div>
        </Col>
        <Col className='col'>
          <div className='review-leave'>
            <h2 className='title'>Review leave</h2>
            <img src= {LeaveRequest} alt="leave icon" className='icon-image' />
            <>
            <Button variant="primary" className='btn'>Review</Button>{' '}
            </>
            </div>
        </Col>
        <Col >
          <div className='Delete employee'>
            <h2 className='title'>Delete employee</h2>
            <img src= {DeleteEmployee} alt="delete icon" className='icon-image' />
            <>
            <Button variant="primary" className='btn'>Delete</Button>{' '}
            </>
            </div>
        </Col>
        </Row>

    </Container>
  )
}
export default AdminDash;   