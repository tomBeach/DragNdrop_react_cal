// ======= src/js/reducers/index.js =======
import { combineReducers } from 'redux'
import { ADD_DATES } from "../constants/action-types";
import { ADD_TIMES } from "../constants/action-types";
import { ADD_ROOMS } from "../constants/action-types";
import { ADD_SESSIONS } from "../constants/action-types";
import { ADD_CELLDATA } from "../constants/action-types";
import { ADD_CELL_IDS_ARRAY } from "../constants/action-types";
import { ADD_DRAGSTATES } from "../constants/action-types";

import { SET_START_ID } from "../constants/action-types";
import { SET_TARGET_ID } from "../constants/action-types";

const initialState = {
    dates: [],
    times: [],
    rooms: [],
    sessions: [],
    startCellId: "",
    targetCellId: "",
    dragStates: {},
    cellDataObj: "",
    cellIdsArray: ""
};

const initDataReducer = (state, action) => {
    // console.log("\n== initDataReducer ==");
    // console.log("state:", state);
    // console.log("action:", action);

    if (state === undefined) {
        state = initialState;
    }

    switch (action.type) {
        case ADD_DATES:
        // console.log("-- ADD_DATES --");
        return { ...state, dates: [...state.dates, action.payload] };

        case ADD_TIMES:
        // console.log("-- ADD_TIMES --");
        return { ...state, times: [...state.times, action.payload] };

        case ADD_ROOMS:
        // console.log("-- ADD_ROOMS --");
        return { ...state, rooms: [...state.rooms, action.payload] };

        case ADD_SESSIONS:
        // console.log("-- ADD_SESSIONS --");
        return { ...state, sessions: [...state.sessions, action.payload] };

        case SET_START_ID:
        // console.log("-- SET_START_ID --");
        return { ...state, startCellId: [...state.startCellId, action.payload] };

        case SET_TARGET_ID:
        // console.log("-- SET_TARGET_ID --");
        return { ...state, targetCellId: [...state.targetCellId, action.payload] };

        case ADD_CELLDATA:
        // console.log("-- ADD_CELLDATA --");
        // console.log("action.payload:", action.payload);
        return { ...state, cellDataObj: [...state.cellDataObj, action.payload] };

        case ADD_CELL_IDS_ARRAY:
        // console.log("-- ADD_CELL_IDS_ARRAY --");
        // console.log("action.payload:", action.payload);
        return { ...state, cellIdsArray: [...state.cellIdsArray, action.payload] };

        case ADD_DRAGSTATES:
        // console.log("-- ADD_DRAGSTATES --");
        // console.log("action.payload:", action.payload);
        return { ...state, dragStates: [...state.dragStates, action.payload] };

        default:
        return state;
    }
}

// const dataReducers = combineReducers({
//     initDataReducer,
//     updateCellsReducer
// })

export default initDataReducer;
