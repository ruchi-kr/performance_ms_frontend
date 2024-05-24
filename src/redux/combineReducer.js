
import { combineReducers } from "redux";
import { userReducer } from "./userReducer";

const initialState = {
    user: {},
    isAdmin: false,
    isManager: false,
    isEmployee: false
};

export const combineReducer = combineReducers({ 
    user: userReducer,
    // initialState.isAdmin
    isAdmin: (state = initialState, action) => {
        return action.type === "LOGIN_SUCCESS" && action.payload.user_type === 1;
    },
    // initialState.isManager
    isManager: (state = initialState, action) => {
        return action.type === "LOGIN_SUCCESS" && action.payload.user_type === 0 && action.payload.role === "manager";
    },
    // initialState.isManager
    isEmployee: (state = initialState, action) => {
        return action.type === "LOGIN_SUCCESS" && action.payload.user_type === 0 && action.payload.role === "employee";
    }
});

export default combineReducer;

// import { combineReducers } from "redux";
// import { userReducer } from "./userReducer";

// // Renamed combineReducer to rootReducer
// export const combineReducer = combineReducers({ 
//     userReducer: userReducer, // Rename to 'user' to match the state key
// });

// export default combineReducer;
