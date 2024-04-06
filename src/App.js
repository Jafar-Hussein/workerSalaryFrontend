import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminDash from './components/AdminDash';
import UserDash from './components/UserDash';
import Account from './components/admin/Account'
import AddEmp from './components/admin/AddEmp'
import UpdateEmp from './components/admin/UpdateEmp'
import Delete from './components/admin/Delete'
import Salary from './components/admin/Salary'
import Leave from './components/admin/Leave'

 function App() {
   return (
     <Router>
       <div className="App">
         <Routes>
           <Route path="/" element={<Login />} />
           <Route path="/admin-dashboard" element={<AdminDash />} />
           <Route path="/user-dashboard" element={<UserDash />} />
           {/* Define routes for your other components here */}
          <Route path="/admin/account" element={<Account />} />
          <Route path="/admin/add-employee" element={<AddEmp />} />
          <Route path="/admin/update-employee" element={<UpdateEmp />} />
           <Route path="/admin/delete-employee" element={<Delete />} />
          <Route path="/admin/salary" element={<Salary />} />
           <Route path="/admin/review-leave" element={<Leave />} />
         </Routes>
       </div>
     </Router>
   );
 }
// function App() {
//   return (
//    <div className='App'>
//     <Account />
//    </div>
//   );
// }

// function App() {
//   return (
//     <div className='App'>
//      <AddEmp />
//     </div>
//   );
// }
export default App;