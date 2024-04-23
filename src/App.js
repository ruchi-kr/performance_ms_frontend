import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserMaster from "./Pages/UserMaster";
import EmployeeMaster from "./Pages/EmployeeMaster";
import ProjectMaster from "./Pages/ProjectMaster";
import ReportingManagerMaster from "./Pages/ReportingManagerMaster";
import Login from "./Auth/Login";
import Forgot from "./Auth/Forgot";
import HomePage from "./Pages/HomePage";
import AssignTask from "./Pages/AssignTask";
import Employee from "./Pages/Employee";
import Manager from "./Pages/Manager";
import ManagerViewTask from "./Pages/ManagerViewTask";
import ManagerViewProjectTask from "./Pages/ManagerViewProjectTask";

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
            <Route path="/rmmaster" element={<ReportingManagerMaster />} />
            <Route path="/assignteam" element={<AssignTask />}></Route>
            <Route
              path="/view/teammember/tasks/:employee_id"
              element={<ManagerViewTask />}
            />
            <Route
              path="/view/project/tasks/:project_id"
              element={<ManagerViewProjectTask />}
            />

            <Route path="/employee" element={<Employee />}></Route>
            <Route path="/manager" element={<AssignTask />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
