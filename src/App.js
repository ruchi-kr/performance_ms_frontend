import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserMaster from "./Pages/UserMaster";
import EmployeeMaster from "./Pages/EmployeeMaster";
import ProjectMaster from "./Pages/ProjectMaster";
import DesignationMaster from "./Pages/DesignationMaster";
import Login from "./Auth/Login";
import Forgot from "./Auth/Forgot";
import HomePage from "./Pages/HomePage";
import AssignTeam from "./Pages/AssignTeam";
import Employee from "./Pages/Employee";
import Manager from "./Pages/Manager";
import ManagerViewTask from "./Pages/ManagerViewTask";
import ManagerViewProjectTask from "./Pages/ManagerViewProjectTask";
// import PlanSheet from "./Pages/PlanSheet";

import EmployeeReport from "./Pages/EmployeeReport";

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

            <Route path="/employeereport" element={<EmployeeReport />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
