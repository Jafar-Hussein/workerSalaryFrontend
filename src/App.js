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
import AdjustInAndOut from './components/user/Adjust'
import AdjustLeave from './components/user/AdjustLeave'
import LeaveReq from './components/user/LeaveReq'
import Employees from './components/user/Employees'
import UpdateInfo from './components/user/UpdateInfo'
import ViewSalary from './components/user/ViewSalary'


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

           {/* Add routes for user components here */}
            <Route path="/user/adjust-in-out" element={<AdjustInAndOut />} />
            <Route path="/user/adjust-leave" element={<AdjustLeave />} />
            <Route path="/user/leave-request" element={<LeaveReq />} />
            <Route path="/user/employees" element={<Employees />} />
            <Route path="/user/update-info" element={<UpdateInfo />} />
            <Route path="/user/view-salary" element={<ViewSalary />} />
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