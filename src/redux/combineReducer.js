
import { combineReducers } from "redux";
import { userReducer } from "./userReducer";

const initialState = {
    user: {},
    isAdmin: false,
    isManager: false,
    isEmployee: false
};

export const combineReducer = combineReducers({ 
    userReducer: userReducer,
    isAdmin: (state = initialState.isAdmin, action) => {
        return action.type === "LOGIN_SUCCESS" && action.payload.user_type === 1;
    },
    isManager: (state = initialState.isManager, action) => {
        return action.type === "LOGIN_SUCCESS" && action.payload.user_type === 0 && action.payload.role === "manager";
    },
    isEmployee: (state = initialState.isEmployee, action) => {
        return action.type === "LOGIN_SUCCESS" && action.payload.user_type === 0 && action.payload.role === "employee";
    }
});

export default combineReducer;

