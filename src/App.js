import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserMaster from './Pages/UserMaster';
import EmployeeMaster from './Pages/EmployeeMaster';
import ProjectMaster from './Pages/ProjectMaster';
import ReportingManagerMaster from './Pages/ReportingManagerMaster';
import Login from './Auth/Login';
import Forgot from './Auth/Forgot';
import HomePage from './Pages/HomePage';
import Employee from './Pages/Employee';
import Manager from './Pages/Manager';

function App() {
  return (
    <>
    <div className='wrapper'>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/forgot' element={<Forgot/>}></Route>
        <Route path='/homepage' element={<HomePage/>}></Route>

        <Route path="/usermaster" element={<UserMaster/>}></Route>
        <Route path="/employeemaster" element={<EmployeeMaster/>}></Route>
        <Route path="/projectmaster" element={<ProjectMaster/>}></Route>
        <Route path="/rmmaster" element={<ReportingManagerMaster/>}></Route>

        <Route path="/employee" element={<Employee/>}></Route>
        <Route path="/manager" element={<Manager/>}></Route>
      </Routes>
    </BrowserRouter>
    </div>
    </>
  );
}

export default App;
