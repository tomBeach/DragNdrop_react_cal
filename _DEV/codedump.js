// ======= get rows above and below target row =======
function getShiftCells(hiORlo, roomTimesArray) {
    console.log("\n == getShiftCells ==");
    console.log("hiORlo:", hiORlo);
    const cellAddr = function(row, targetCol) {
        return row + "_" + targetCol;
    };
    const cellData = function(cellAddr) {
        return cellDataObj[cellAddr];
    };
    const searchRoomCells = roomTimesArray.filter(row => row <= targetRow);
    console.log("searchRoomCells:", searchRoomCells);
    if (hiORlo === "hi") {
        return searchRoomCells.map(row => cellData(cellAddr(row, targetCol))).reverse()
    } else {
        return searchRoomCells.map(row => cellData(cellAddr(row, targetCol)));
    }
}

function getNearestEmptyRow(shiftCellsArray, nearestEmptyRow) {
    console.log("\n == getNearestEmptyRow ==");

    // ======= filter for occupied (non-null) cells only =======
    const removeNullCells = function(cell) {
        if (cell) {
            return cell;
        }
    };
    shiftAddrsArray = shiftCellsArray.map((cell, c) => {
        if (nearestEmptyRow === null) {
            if (cell.cellType === "emptyCell") {
                nearestEmptyRow = cell;
                return cell.addr;
            } else if (cell.cellType === "sessionCell") {
                return cell.addr;
            }
        }
    }).filter(removeNullCells).reverse();
    return [shiftAddrsArray, nearestEmptyRow];
}

let aboveCenterCells = getShiftCells("hi", roomTimesArray);
console.log("aboveCenterCells:", aboveCenterCells);
let belowCenterCells = getShiftCells("lo", roomTimesArray);
console.log("belowCenterCells:", belowCenterCells);

let initShiftUp = getNearestEmptyRow(aboveCenterCells, nearestEmptyAbove);
console.log("initShiftUp:", initShiftUp);
let initShiftDown = getNearestEmptyRow(belowCenterCells, nearestEmptyBelow);
console.log("initShiftDown:", initShiftDown);


// == check if cellDataObj has been created
function isEmptyObject(object) {
    console.log("\n == isEmptyObject ==");
    for (var key in object) {
        return false;
    }
        return true;
}
let initStatus = isEmptyObject(this.state.cellDataObj);
console.log("initStatus:", initStatus);

// == initialize text and id
let text, cellType, dragStyles, dragXYWH;
let id = this.state.draggerId;
let startCellId = this.state.startCellId;
if (!initStatus) {
    cellType = this.state.cellDataObj[startCellId].cellType;
    if (cellType === "sessionCell") {
        text = this.state.cellDataObj[startCellId].sessionData.session_title;
    } else {
        text = null;
    }
    dragXYWH = this.state.dragXYWH;
    dragStyles = {
        position: 'absolute',
        display: 'block',
        left: dragXYWH.x + 'px',
        top: dragXYWH.y + 'px',
        width: dragXYWH.w + 'px',
        height: dragXYWH.h + 'px'
    }
} else {
    text = null;
    dragStyles = null;
}
console.log("dragStyles:", dragStyles);

return (
    <div
        id={id}
        style={dragStyles}
        onMouseDown={(e) => this.onMouseDown(e)}>
        <p>{text}</p>
    </div>
)


// const rootReducer = (state = initialState, action) => {
//     console.log("== rootReducer ==");
//     switch (action.type) {
//         case ADD_DATES:
//         console.log("-- ADD_DATES --");
//         console.log("  rootReducer:state:", state);
//         console.log("  rootReducer:state.dates:", state.dates);
//         console.log("  rootReducer:action.payload:", action.payload);
//         return { state, dates: [state.dates, action.payload] };
//
//         case ADD_ARTICLE:
//         console.log("-- ADD_ARTICLE --");
//         console.log("  rootReducer:state.articles:", state.articles);
//         console.log("  rootReducer:action.payload:", action.payload);
//         return { ...state, articles: [...state.articles, action.payload] };
//
//     default:
//         return state;
//     }
// };
//
// export default rootReducer;



// ======= src/js/components/Grid.js =======
import React from "react";
import ReactDOM from "react-dom"
import autoBind from "react-autobind";

import store from "../store/index";
import { connect } from "react-redux";

import { addTimes } from "../actions/index";
import { addDates } from "../actions/index";
import { addRooms } from "../actions/index";
import { addSessions } from "../actions/index";
import { addCellDataObj } from "../actions/index";

import Day from "./Day";
import Date from "./Date";
import RoomTime from "./RoomTime";
import SessionCell from "./SessionCell";
// import Dragger from "./Dragger";

// import { getCellData } from "../cellData";
// import { fetchCellData } from "../actions/index";

// ======= ======= ======= Store ======= ======= =======
// ======= ======= ======= Store ======= ======= =======
// ======= ======= ======= Store ======= ======= =======

const mapStateToProps = (state) => {
    console.log("== mapStateToProps ==")
    console.log("state:", state);
    return {
        times: state.times,
        dates: state.dates,
        rooms: state.rooms,
        sessions: state.sessions
        gridCells: state.gridCells
        // cellData: state.cellDataObj,
        // cellIdsArray: _.keys(state.cellData.articlesById)
    };
}
const mapDispatchToProps = (dispatch) => {
    console.log("== mapDispatchToProps ==")
    // console.log("times:", times);
    // console.log("dates:", dates);
    // console.log("rooms:", rooms);
    // console.log("sessions:", sessions);
    // console.log("gridCells:", gridCells);
    return {
        // addTimes: times => dispatch(addTimes(times)),
        // addDates: dates => dispatch(addDates(dates)),
        // addRooms: rooms => dispatch(addRooms(rooms)),
        // addSessions: sessions => dispatch(addSessions(sessions)),
        // addCellDataObj: gridCells => dispatch(addCellDataObj(gridCells))
        // getCellData() {
        //     dispatch(fetchCellData())
        // }
    }
}

// ======= ======= ======= component ======= ======= =======
// ======= ======= ======= component ======= ======= =======
// ======= ======= ======= component ======= ======= =======

// ======= Grid =======
class Grid extends React.Component {
    constructor(props) {
        console.log("\n== Grid: constructor ==");
        console.log("props:", props);
        super(props);
        autoBind(this);
        this.state = {
            dates: props.calendarData[0],
            times: props.calendarData[1],
            rooms: props.calendarData[2],
            sessions: props.calendarData[3]
        };
    }

    componentDidMount() {
        console.log("== Grid: componentDidMount ==");
        console.log("  this.props:", this.props);
        console.log("  this.state:", this.state);

        this.props.addDates(dates);
        this.props.addTimes(times);
        this.props.addRooms(rooms);
        this.props.addSessions(sessions);

        let roomTimes = this.makeRoomTimes(rooms, times);
        let gridCells = this.makeGridCells(dates, rooms, times);
        console.log("  gridCells:", gridCells);
        console.log("  this.props:", this.props);
        this.props.addCellDataObj(gridCells);
    }
