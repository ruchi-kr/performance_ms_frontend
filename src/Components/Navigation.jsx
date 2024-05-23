// Navigation.js
import React from "react";
import ErrorPage from "../Pages/ErrorPage";
import AccessDenied from "../Pages/AccessDenied";
import UserMaster from "../Pages/UserMaster";
import EmployeeMaster from "../Pages/EmployeeMaster";
import ProjectMaster from "../Pages/ProjectMaster";
import DesignationMaster from "../Pages/DesignationMaster";
import JobRoleMaster from "../Pages/JobRoleMaster";
import ModuleMaster from "../Pages/ModuleMaster";
import Login from "../Auth/Login";
import Forgot from "../Auth/Forgot";
import HomePage from "../Pages/HomePage";
import AssignTeam from "../Pages/AssignTeam";
import Employee from "../Pages/Employee";
import Manager from "../Pages/Manager";
import ManagerViewTask from "../Pages/ManagerViewTask";
import ManagerViewProjectTask from "../Pages/ManagerViewProjectTask";
import ProjectReport from "../Pages/ProjectReport";
import ManagerEmployeeReport from "../Pages/ManagerEmployeeReport";
import ManagerProjectReport from "../Pages/ManagerProjectReport";

import EmployeeReport from "../Pages/EmployeeReport";
import EmployeeReportDw from "../Pages/EmployeeReportDw";
import Test from "../Pages/Test";
import ManagerParticularEmployeeReport from "../Pages/ManagerParticularEmployeeReport";
import AddProjectPlan from "../Pages/AddProjectPlan";
import ProjectPlan from "../PlanPages/ProjectPlan";
import ProjectPlan2 from "../PlanPages/ProjectPlan2";
import AddModuleTasks from "../Pages/AddModuleTasks";
import AssignTeamNew from "../Pages/AssignTeamNew";
export const nav = [
    // public
    { path: "/", element: <Login />, isPrivate: false, isAdmin: false, isManager: false, isEmployee: false },
    { path: "/login", element: <Login />, isPrivate: false, isAdmin: false, isManager: false, isEmployee: false },
    { path: "/forgot", element: <Forgot />, isPrivate: false, isAdmin: false, isManager: false, isEmployee: false },
    { path: "*", element: <ErrorPage />, isPrivate: false, isAdmin: false, isManager: false, isEmployee: false },
    { path: "/accessdenied", element: <AccessDenied />, isPrivate: false, isAdmin: false, isManager: false, isEmployee: false },
// admin url
    { path: "/homepage", element: <HomePage />, isPrivate: true, isAdmin: true, isManager: false, isEmployee: false },
    { path: "/usermaster", element: <UserMaster />, isPrivate: true, isAdmin: true, isManager: false, isEmployee: false },
    { path: "/employeemaster", element: <EmployeeMaster />, isPrivate: true, isAdmin: true, isManager: false, isEmployee: false },
    { path: "/projectmaster", element: <ProjectMaster />, isPrivate: true, isAdmin: true, isManager: false, isEmployee: false },
    { path: "/jobrolemaster", element: <JobRoleMaster />, isPrivate: true, isAdmin: true, isManager: false, isEmployee: false },
    { path: "/designationmaster", element: <DesignationMaster />, isPrivate: true, isAdmin: true, isManager: false, isEmployee: false },
    { path: "/modulemaster", element: <ModuleMaster />, isPrivate: true, isAdmin: true, isManager: false, isEmployee: false },
    // admin and manager url
    { path: "/addprojectplan", element: <AddProjectPlan />, isPrivate: true, isAdmin: true, isManager: true, isEmployee: false },
    { path: "/addmoduletasks", element: <AddModuleTasks />, isPrivate: true, isAdmin: true, isManager: true, isEmployee: false },
    // manager url
    { path: "/manager", element: <Manager />, isPrivate: true, isAdmin: false, isManager: true, isEmployee: false },
    { path: "/assignTeam", element: <AssignTeam />, isPrivate: true, isAdmin: false, isManager: true, isEmployee: false },
    { path: "/view/teammember/tasks/:employee_id", element: <ManagerViewTask />, isPrivate: true, isAdmin: false, isManager: true, isEmployee: false },
    { path: "/view/project/tasks/:project_id", element: <ManagerViewProjectTask />, isPrivate: true, isAdmin: false, isManager: true, isEmployee: false },
    { path: "/manager/report/project", element: <ProjectReport />, isPrivate: true, isAdmin: false, isManager: true, isEmployee: false },
    { path: "/manager/report/employee", element: <ManagerEmployeeReport />, isPrivate: true, isAdmin: false, isManager: true, isEmployee: false },
    { path: "/manager/report/employee/:employee_id", element: <ManagerParticularEmployeeReport />, isPrivate: true, isAdmin: false, isManager: true, isEmployee: false },
    { path: "/manager/report/project/detailed", element: <ManagerProjectReport />, isPrivate: true, isAdmin: false, isManager: true, isEmployee: false },
// employee url
    { path: "/employee", element: <Employee />, isPrivate: true, isAdmin: false, isManager: false, isEmployee: true },
    { path: "/plan", element: <Employee />, isPrivate: true, isAdmin: false, isManager: false, isEmployee: true },
    { path: "/reportproject-wise", element: <EmployeeReport />, isPrivate: true, isAdmin: false, isManager: false, isEmployee: true },
    { path: "/reportdate-wise", element: <EmployeeReportDw />, isPrivate: true, isAdmin: false, isManager: false, isEmployee: true },
    // employee manager admin url
    { path: "/projectplan2/", element: <ProjectPlan />, isPrivate: true, isAdmin: true, isManager: true, isEmployee: true },
    { path: "/projectplan/", element: <ProjectPlan2 />, isPrivate: true, isAdmin: true, isManager: true, isEmployee: true },
    {path: '/projectplan/?project_id=null', element: <ProjectPlan2 />, isPrivate: true, isAdmin: true, isManager: true, isEmployee: true},
];
