import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserMaster from "./Pages/UserMaster";
import EmployeeMaster from "./Pages/EmployeeMaster";
import ProjectMaster from "./Pages/ProjectMaster";
import DesignationMaster from "./Pages/DesignationMaster";
import ModuleMaster from "./Pages/ModuleMaster";
import Login from "./Auth/Login";
import Forgot from "./Auth/Forgot";
import HomePage from "./Pages/HomePage";
import AssignTeam from "./Pages/AssignTeam";
import Employee from "./Pages/Employee";
import Manager from "./Pages/Manager";
import ManagerViewTask from "./Pages/ManagerViewTask";
import ManagerViewProjectTask from "./Pages/ManagerViewProjectTask";
import ProjectReport from "./Pages/ProjectReport";
import ManagerEmployeeReport from "./Pages/ManagerEmployeeReport";
import ManagerProjectReport from "./Pages/ManagerProjectReport";

import EmployeeReport from "./Pages/EmployeeReport";
import EmployeeReportDw from "./Pages/EmployeeReportDw";
import Test from './Pages/Test';
import ManagerParticularEmployeeReport from "./Pages/ManagerParticularEmployeeReport";


function App() {
  return (
    <>
      <div className="wrapper">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/forgot" element={<Forgot />}></Route>
            <Route path="/homepage" element={<HomePage />}></Route>

            <Route path="/usermaster" element={<UserMaster />}></Route>
            <Route path="/employeemaster" element={<EmployeeMaster />}></Route>
            <Route path="/projectmaster" element={<ProjectMaster />}></Route>
            <Route path="/designationmaster" element={<DesignationMaster />} />
            <Route path="/modulemaster" element={<ModuleMaster />} />
            <Route path="/assignteam" element={<AssignTeam />}></Route>
            <Route
              path="/view/teammember/tasks/:employee_id"
              element={<ManagerViewTask />}
            />
            <Route
              path="/view/project/tasks/:project_id"
              element={<ManagerViewProjectTask />}
            />

            <Route path="/employee" element={<Employee />}></Route>
            <Route path="/plan" element={<Employee />}></Route>
            <Route path="/manager" element={<AssignTeam />}></Route>

            <Route
              path="/reportproject-wise"
              element={<EmployeeReport />}
            ></Route>
            <Route
              path="/reportdate-wise"
              element={<EmployeeReportDw />}
            ></Route>

            <Route path="/manager/report/project" element={<ProjectReport />} />
            <Route
              path="/manager/report/employee"
              element={<ManagerEmployeeReport />}
            />
            <Route
              path="/manager/report/employee/:employee_id"
              element={<ManagerParticularEmployeeReport />}
            />
            <Route
              path="/manager/report/project/detailed"
              element={<ManagerProjectReport />}
            />

            <Route path ='/test' element={<Test/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
