// ======= src/js/actions/index.js =======
import { ADD_DATES } from "../constants/action-types";
import { ADD_TIMES } from "../constants/action-types";
import { ADD_ROOMS } from "../constants/action-types";
import { ADD_SESSIONS } from "../constants/action-types";
import { ADD_CELLDATA } from "../constants/action-types";
import { ADD_CELL_IDS_ARRAY } from "../constants/action-types";
import { ADD_DRAGSTATES } from "../constants/action-types";

import { SET_START_ID } from "../constants/action-types";
import { SET_TARGET_ID } from "../constants/action-types";
import { SET_DRAGGER_ID } from "../constants/action-types";

export const addDates = (dates) => {
    // console.log("** actions: addDates **");
    return {
        type: ADD_DATES,
        payload: dates
    }
}
export const addTimes = (times) => {
    // console.log("** actions: addTimes **");
    return {
        type: ADD_TIMES,
        payload: times
    }
}
export const addRooms = (rooms) => {
    // console.log("** actions: addRooms **");
    return {
        type: ADD_ROOMS,
        payload: rooms
    }
}
export const addSessions = (sessions) => {
    // console.log("** actions: addSessions **");
    return {
        type: ADD_SESSIONS,
        payload: sessions
    }
}
export const addCellDataObj = (cellDataObj) => {
    console.log("** actions: addCellDataObj **");
    // console.log("   cellDataObj:", cellDataObj);
    return {
        type: ADD_CELLDATA,
        payload: cellDataObj
    }
}
export const addCellIdsArray = (cellIdsArray) => {
    console.log("** actions: addCellIdsArray **");
    // console.log("   cellIdsArray:", cellIdsArray);
    return {
        type: ADD_CELL_IDS_ARRAY,
        payload: cellIdsArray
    }
}
export const addDragStates = (dragStates) => {
    console.log("** actions: addDragStates **");
    // console.log("   dragStates:", dragStates);
    return {
        type: ADD_DRAGSTATES,
        payload: dragStates
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
export const setDraggerId = (draggerId) => {
    console.log("** actions: setDraggerId **");
    // console.log("draggerId:", draggerId);
    return {
        type: SET_DRAGGER_ID,
        payload: draggerId
    }
}
