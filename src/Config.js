export const baseURL = "http://localhost:8000"

// for project master crud
export const getAllProjects = `${baseURL}/api/admin/getProjects`;
export const createProject = `${baseURL}/api/admin/addProject`;
export const editProject = `${baseURL}/api/admin/editProject`;
export const deleteProject = `${baseURL}/api/admin/deleteProject/`;

// for employee master crud
export const getAllEmployees = `${baseURL}/api/admin/getEmployees`;
export const createEmployee = `${baseURL}/api/admin/addEmployee`;
export const editEmployee = `${baseURL}/api/admin/editEmployee`;
export const deleteEmployee = `${baseURL}/api/admin/deleteEmployee/`;

// for manager master crud
export const getAllManagers = `${baseURL}/api/admin/getManagers`;
export const createManager = `${baseURL}/api/admin/addManager`;
export const editManager = `${baseURL}/api/admin/editManager`;
export const deleteManager = `${baseURL}/api/admin/deleteManager/`;

// for user master crud
export const getAllUsers = `${baseURL}/api/admin/getUsers`;
export const createUser = `${baseURL}/api/admin/addUser`;
export const editUser = `${baseURL}/api/admin/editUser`;
export const deleteUser = `${baseURL}/api/admin/deleteUser/`;


// for login,forgot
export const forgotPasswordVerify = `${baseURL}/api/forgotPasswordVerify`;
export const forgotPassword = `${baseURL}/api/forgotPassword`;
export const loginUrl =`${baseURL}/api/login`;

// for dropdown list
export const getManagerList = `${baseURL}/api/admin/getManagersList`;
export const getEmployerList = `${baseURL}/api/admin/getEmployeesList`;

// for dashdata counter
export const getDashData = `${baseURL}/api/getDashData`;

// for employee dts
export const deleteTask = `${baseURL}/api/general/deleteTask/`;
export const addTask = `${baseURL}/api/user/addTask`;
// export const editTask =   ``;
export const getTask = `${baseURL}/api/user/getTasks`;

export const CONFIG_OBJ = {                                         //config object
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
  }