export const baseURL = "http://localhost:8000"

// for project master crud
export const getAllProjectsUrlPagination = `${baseURL}/api/admin/getallProject`;
export const getAllProjects = `${baseURL}/api/admin/getProjects`;
export const createProject = `${baseURL}/api/admin/addProject`;
export const editProject = `${baseURL}/api/admin/editProject`;
export const deleteProject = `${baseURL}/api/admin/deleteProject/`;

// for employee master crud /api/admin/getEmployees
export const getAllEmployees = `${baseURL}/api/admin/getEmployees`;
export const getAllEmployeeslist = `${baseURL}/api/admin/getEmployeeslist`;
export const createEmployee = `${baseURL}/api/admin/addEmployee`;
export const editEmployee = `${baseURL}/api/admin/editEmployee`;
export const deleteEmployee = `${baseURL}/api/admin/deleteEmployee/`;

// for designation master crud
export const getAllDesignation = `${baseURL}/api/admin/getAllDesignation`;
export const createDesignation = `${baseURL}/api/admin/addDesignation`;
export const editDesignation = `${baseURL}/api/admin/editDesignation`;
export const deleteDesignation = `${baseURL}/api/admin/deleteDesignation/`;

// for user master crud
export const getAllUsers = `${baseURL}/api/admin/getUsers`;
export const createUser = `${baseURL}/api/admin/addUser`;
export const editUser = `${baseURL}/api/admin/editUser`;
export const deleteUser = `${baseURL}/api/admin/deleteUser/`;

// for module master crud
export const getAllModules = `${baseURL}/api/admin/getAllModule`;
export const createModule = `${baseURL}/api/admin/addModule`;
export const editModule = `${baseURL}/api/admin/editModule`;
export const deleteModule = `${baseURL}/api/admin/deleteModule/`;

// for job role master crud
export const getAllJobRoles = `${baseURL}/api/admin/getAllJobRole`;
export const createJobRole = `${baseURL}/api/admin/addJobRole`;
export const editJobRole = `${baseURL}/api/admin/editJobRole`;
export const deleteJobRole = `${baseURL}/api/admin/deleteJobRole/`;
export const getJobRoleList = `${baseURL}/api/admin/getJobRoleList`;


// for login,forgot
export const forgotPasswordVerify = `${baseURL}/api/forgotPasswordVerify`;
export const forgotPassword = `${baseURL}/api/forgotPassword`;
export const loginUrl =`${baseURL}/api/login`;

// for dropdown list
export const getManagerList = `${baseURL}/api/admin/getManagersList`;
export const getDesignationList = `${baseURL}/api/admin/getDesignationList`;
export const getEmployerList = `${baseURL}/api/admin/getEmployeesList`;

// for dashdata counter
export const getDashData = `${baseURL}/api/getDashData`;

// for employee dts
export const deleteTask = `${baseURL}/api/user/deleteTask`;
export const addTask = `${baseURL}/api/user/addTask`;
export const editTask =   `${baseURL}/api/user/updateTask/`;
export const getTask = `${baseURL}/api/user/getTasks`;

// for reports
export const getEmployeeReport = `${baseURL}/api/user/getReportspw`;
export const getEmployeeReportDW = `${baseURL}/api/user/getReportsdw`;

// for excel pdf 
export const getExcelpdfprojects = `${baseURL}/api/admin/getexcelpdfprojects`;

// for current time used for dts rendering
export const getCurrentTime = `${baseURL}/api/CurrentTimeStamp`;

// for project plan stage wise rendering in one table
export const getProjectPlan = `${baseURL}/api/project/plan`;

export const CONFIG_OBJ = {                                         //config object
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
  }