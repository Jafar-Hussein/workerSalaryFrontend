import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminDash from './components/AdminDash';
import UserDash from './components/UserDash';

function App() {
  return (
     <Router>
       <div className="App">
      <Routes>
       <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDash />} />
        <Route path="/user-dashboard" element={<UserDash />} />
      </Routes>
       </div>
     </Router>
    // <div className='App'>
      
    // <UserDash />
    // </div>
  );
}

export default App;