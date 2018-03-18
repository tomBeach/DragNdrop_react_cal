// ======= src/js/reducers/index.js =======
import { combineReducers } from 'redux'
import { ADD_TIMES, ADD_DATES, ADD_ROOMS, ADD_SESSIONS, ADD_GRID_CELLS, UPDATE_CELLS } from "../constants/action-types";

const initialState = {
    dates: [],
    times: [],
    rooms: [],
    sessions: [],
    gridCells: []
};

const rawDataReducer = (state = initialState, action) => {
    console.log("\n== rawDataReducer ==");
    console.log("state:", state);
    console.log("action:", action);

    switch (action.type) {
        case ADD_DATES:
        console.log("-- ADD_DATES --");
        return { ...state, dates: [...state.dates, action.payload] };

        case ADD_TIMES:
        console.log("-- ADD_TIMES --");
        return { ...state, times: [...state.times, action.payload] };

        case ADD_ROOMS:
        console.log("-- ADD_ROOMS --");
        return { ...state, rooms: [...state.rooms, action.payload] };

        case ADD_SESSIONS:
        console.log("-- ADD_SESSIONS --");
        return { ...state, sessions: [...state.sessions, action.payload] };

        case ADD_GRID_CELLS:
        console.log("-- ADD_GRID_CELLS --");
        return { ...state, gridCells: [...state.gridCells, action.payload] };

        default:
        return state;
    }
}

const updateCellsReducer = (state = initialState, action) => {
    console.log("\n== updateCellsReducer ==");
    console.log("state:", state);
    console.log("action:", action);

    switch (action.type) {
        case UPDATE_CELLS:
        console.log("-- UPDATE_CELLS --");
        return { ...state, gridCells: [...state.gridCells, action.payload] };
        default:
        return state;
    }
}

const dataReducers = combineReducers({
    rawDataReducer,
    updateCellsReducer
})

export default dataReducers;
