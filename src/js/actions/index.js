// ======= src/js/actions/index.js =======
import { ADD_TIMES } from "../constants/action-types";
import { ADD_DATES } from "../constants/action-types";
import { ADD_ROOMS } from "../constants/action-types";
import { ADD_SESSIONS } from "../constants/action-types";
import { UPDATE_CELLS } from "../constants/action-types";
import { ADD_GRID_CELLS } from "../constants/action-types";

// == example:
// export const ADD_TODO = 'ADD_TODO'
//
// export const addTodo = (text) => {
//     console.log("== actions: addTodo ==");
//     return {
//         type: ADD_TODO,
//         text }
// }
 
export const addDates = (dates) => {
    console.log("== actions: addDates ==");
    console.log("dates:", dates);
    return {
        type: ADD_DATES,
        payload: dates
    }
}
export const addTimes = (times) => {
    console.log("== actions: addTimes ==");
    return {
        type: ADD_TIMES,
        payload: times
    }
}
export const addRooms = (rooms) => {
    console.log("== actions: addRooms ==");
    return {
        type: ADD_ROOMS,
        payload: rooms
    }
}
export const addSessions = (sessions) => {
    console.log("== actions: addSessions ==");
    return {
        type: ADD_SESSIONS,
        payload: sessions
    }
}
export const addGridCells = () => {
    console.log("== actions: addGridCells ==");
    return {
        type: ADD_GRID_CELLS,
        payload: null
    }
}
