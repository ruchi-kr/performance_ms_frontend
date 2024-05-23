import React from "react";
import { BrowserRouter, Routes, Route,Outlet } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import "./App.css";
import ErrorPage from "./Pages/ErrorPage";
import AccessDenied from "./Pages/AccessDenied";
import UserMaster from "./Pages/UserMaster";
import EmployeeMaster from "./Pages/EmployeeMaster";
import ProjectMaster from "./Pages/ProjectMaster";
import DesignationMaster from "./Pages/DesignationMaster";
import JobRoleMaster from "./Pages/JobRoleMaster";
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
import Test from "./Pages/Test";
import ManagerParticularEmployeeReport from "./Pages/ManagerParticularEmployeeReport";
import AddProjectPlan from "./Pages/AddProjectPlan";
import ProjectPlan from "./PlanPages/ProjectPlan";
import ProjectPlan2 from "./PlanPages/ProjectPlan2";
import AddModuleTasks from "./Pages/AddModuleTasks";
import AssignTeamNew from "./Pages/AssignTeamNew";

import { RenderRoutes } from "./Components/RenderRoutes";
// // Import other route components

function App() {

return (                                      
<>                                           
  <BrowserRouter>                                    
    <RenderRoutes />   
  </BrowserRouter>
</>
);
}
export default App; 