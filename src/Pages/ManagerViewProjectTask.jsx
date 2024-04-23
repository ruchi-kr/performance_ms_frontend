import React from "react";
import { useParams } from "react-router-dom";
const ManagerViewProjectTask = () => {
  const { project_id } = useParams();
  console.log("project id", project_id);
  return <div>ManagerViewProjectTask</div>;
};

export default ManagerViewProjectTask;
