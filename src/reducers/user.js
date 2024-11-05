function userReducer(state, action) {
    switch (action.type) {
        case "USER_LOGIN": {
            return { ...state, user: { ...state.user, ...action.payload } };
        }

        case 'LOGOUT_USER': {
            return { ...state, user: {} };
        }

        case 'ADD_TASK': {
            return { ...state, Tasks: [...state.Tasks,action.payload] };
        }

        case 'UPDATE_TASK': {
            return {
                ...state,
                Tasks: state.Tasks.map(task =>
                    task._id === action.payload._id
                        ? { ...task, ...action.payload }
                        : task
                ),
            };
        }

        case 'SET_TASKS': {
            return { ...state, Tasks: action.payload };
        }
        case 'REMOVE_TASK': {
            return {
                ...state,
                Tasks: state.Tasks.filter(task => task._id !== action.payload),
            };
        }

        default: {
            return state;
        }
    }
}

export default userReducer;
