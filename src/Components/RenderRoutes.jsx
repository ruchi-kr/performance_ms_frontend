// RenderRoutes.js
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { nav } from "./Navigation";
import { useSelector } from "react-redux";
import ErrorPage from "../Pages/ErrorPage";

export const RenderRoutes = () => {
    const user = useSelector(state => state.userReducer.user);
    const isAdmin = useSelector(state => state.isAdmin);
    const isManager = useSelector(state => state.isManager);
    const isEmployee = useSelector(state => state.isEmployee);

    return (
        <Routes>
            {nav.map((r, i) => {
                if (r.isPrivate && user && Object.keys(user).length > 0) {
                    if (r.isAdmin && isAdmin) {
                        return <Route key={i} path={r.path} element={r.element} />;
                    } else if (r.isManager && isManager) {
                        return <Route key={i} path={r.path} element={r.element} />;
                    } else if (r.isEmployee && isEmployee) {
                        return <Route key={i} path={r.path} element={r.element} />;
                    } else {
                        return null;
                    }
                } else if (!r.isPrivate) {
                    return <Route key={i} path={r.path} element={r.element} />;
                } 
                // else {
                //     return null;
                // }
            })}
            {/* <Route path="*" element={<ErrorPage />} /> */}
        </Routes>
    );
};
