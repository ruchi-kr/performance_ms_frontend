// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ element, allowedUserTypes, allowedRoles }) => {
//   const userType = sessionStorage.getItem("user_type");
//   const role = sessionStorage.getItem("role");

//   if (
//     userType &&
//     allowedUserTypes.includes(userType) &&
//     role &&
//     allowedRoles.includes(role)
//   ) {
//     return element;
//   } else {
//     return <Navigate to="/accessdenied" />;
//   }
// };

// export default ProtectedRoute;
