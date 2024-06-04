import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";


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