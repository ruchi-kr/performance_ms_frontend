
const initialState = {
    user: {},
    isAdmin: false,
    isManager: false,
    isEmployee: false
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            const { user_type, role } = action.payload;
            return {
                ...state,
                user: action.payload,
                isAdmin: user_type === 1,
                isManager: user_type === 0 && role === "manager",
                isEmployee: user_type === 0 && role === "employee"
            };
        case "LOGIN_ERROR":
            return initialState;
        default:
            return state;
    }
};
