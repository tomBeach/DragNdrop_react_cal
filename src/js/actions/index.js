// ======= src/js/actions/index.js =======
import { ADD_DATES } from "../constants/action-types";
import { ADD_TIMES } from "../constants/action-types";
import { ADD_ROOMS } from "../constants/action-types";
import { ADD_SESSIONS } from "../constants/action-types";
import { ADD_CELLDATA } from "../constants/action-types";
import { ADD_DRAGSTATES } from "../constants/action-types";

import { SET_START_ID } from "../constants/action-types";
import { SET_TARGET_ID } from "../constants/action-types";

export const addDates = (dates) => {
    console.log("** actions: addDates **");
    console.log("dates:", dates);
    return {
        type: ADD_DATES,
        payload: dates
    }
}
export const addTimes = (times) => {
    console.log("** actions: addTimes **");
    return {
        type: ADD_TIMES,
        payload: times
    }
}
export const addRooms = (rooms) => {
    console.log("** actions: addRooms **");
    return {
        type: ADD_ROOMS,
        payload: rooms
    }
}
export const addSessions = (sessions) => {
    console.log("** actions: addSessions **");
    return {
        type: ADD_SESSIONS,
        payload: sessions
    }
}
export const setStartId = (startCellId) => {
    console.log("** actions: setStartId **");
    return {
        type: SET_START_ID,
        payload: startCellId
    }
}
export const setTargetId = (targetCellId) => {
    console.log("** actions: setTargetId **");
    return {
        type: SET_TARGET_ID,
        payload: targetCellId
    }
}
export const addCellData = (cellDataObj) => {
    console.log("** actions: addCellData **");
    console.log("   cellDataObj:", cellDataObj);
    return {
        type: ADD_CELLDATA,
        payload: cellDataObj
    }
}
export const addDragStates = (dragStates) => {
    console.log("** actions: addDragStates **");
    console.log("   dragStates:", dragStates);
    return {
        type: ADD_DRAGSTATES,
        payload: dragStates
    }
}
