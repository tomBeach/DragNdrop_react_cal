// ======= src/js/components/Grid.js =======
import React from "react";
import ReactDOM from "react-dom"
import autoBind from "react-autobind";

// import store from "../store/index";
import { connect } from "react-redux";
import store from "../store/index";

import { addDates } from "../actions/index";
import { addTimes } from "../actions/index";
import { addRooms } from "../actions/index";
import { addSessions } from "../actions/index";
import { setStartId } from "../actions/index";
import { setTargetId } from "../actions/index";
import { setDraggerId } from "../actions/index";
import { addCellDataObj } from "../actions/index";
import { addDragStates } from "../actions/index";
import { addCellIdsArray } from "../actions/index";

import Day from "./Day";
import Date from "./Date";
import RoomTime from "./RoomTime";
import SessionCell from "./SessionCell";
import Dragger from "./Dragger";

// ======= ======= ======= component ======= ======= =======
// ======= ======= ======= component ======= ======= =======
// ======= ======= ======= component ======= ======= =======

// ======= Grid =======
class Grid extends React.Component {
    constructor(props) {
        console.log("\n == Grid: constructor ==");
        // console.log("props:", props);
        super(props);
        autoBind(this);
        this.cellDataObj = {};          // storage object for element xywh and session data
        this.cellIdsArray = [];         // array of cell ids used for hover detection while dragging
        this.cellDaysArray = [];        // multidimensional array of days => cells
        this.dragStates = {};           // position data for dragger
    }

    componentDidMount(props) {
        console.log("\n == Grid: componentDidMount ==");

        // == add cellDataObj to store
        store.dispatch(addCellDataObj(this.cellDataObj));

        // == check if positional data has been added to store
        let dragStates = store.getState().dragStates[0];
        if (dragStates == null) {
            this.updateCellData();      // adds position data
        }
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("\n == Grid: componentDidUpdate ==");
    }

    // ======= ======= ======= cellData ======= ======= =======
    // ======= ======= ======= cellData ======= ======= =======
    // ======= ======= ======= cellData ======= ======= =======

    updateCellData() {
        console.log("\n +++++++ == Grid: updateCellData == +++++++ ");
        console.log(" +++++++ == Grid: updateCellData == +++++++ ");
        console.log(" +++++++ == Grid: updateCellData == +++++++ ");

        // == get cell data objects from store
        let cellDataObj = store.getState().cellDataObj[0];

        // == get cell location data from mounted cell components
        let dayCells = ReactDOM.findDOMNode(this.refs.day_0);
        let timeCell = document.getElementById("roomLabel_0");
        let anchorCell = ReactDOM.findDOMNode(this.refs["2_1"]);
        let dayR = dayCells.getBoundingClientRect();
        let timeR = timeCell.getBoundingClientRect();
        let anchorR = anchorCell.getBoundingClientRect();
        let sessionsGrid = ReactDOM.findDOMNode(this.refs.sessions);
        let sessionsR = sessionsGrid.getBoundingClientRect();

        // == get array of cell components for each day
        let dayColumns = this.refs.sessions.childNodes;
        let cellCounter = 0;

        // == loop through each day (start on 2 to skip roomTimes and dragger elements)
        for (var d = 2; d < dayColumns.length; d++) {
            let nextDayCells = dayColumns[d].childNodes;

            // == loop through each cell per day
            for (var c = 0; c < nextDayCells.length; c++) {
                let cell = nextDayCells[c];
                let cellId = nextDayCells[c].id;

                // == build cellIdsArray used for cell hover detection
                this.cellIdsArray.push(cellId);

                // == get size/position data; add component refs to cellDataObj
                if (cell.className.includes('cell')) {
                    cellCounter++;
                    let cellR = nextDayCells[c].getBoundingClientRect();
                    if (cellDataObj[cellId]) {
                        let cellData = cellDataObj[cellId];
                        cellData.id = cellCounter;
                        cellData.x = cellR.left - anchorR.left + timeR.width;
                        cellData.y = cellR.top - anchorR.top + timeR.height;
                        cellData.w = cellR.width;
                        cellData.h = cellR.height;
                        cellData.className = cell.className;
                        cellData.cellComp = this.refs[cellId];
                    }
                }
            }
        }

        // == define allowable dragging rectangle from element sizes
        let gridL = sessionsR.left + timeR.width;           // limit to left drag
        let gridT = sessionsR.top + timeR.height;           // limit to top drag
        let gridW = sessionsR.width - timeR.width + 10;     // limit to right drag when added to gridL
        let gridH = sessionsR.height - timeR.height - 5;    // limit to bottom drag when added to gridH

        let dragStates = {
            gridXYWH: { x:gridL, y:gridT, w:gridW, h:gridH },
            dragXYWH: { x:timeR.width + 5, y:anchorR.height + 3, w:anchorR.width, h:anchorR.height },
            mouseXY: { x:0, y:0 },
            relXY: { x:0, y:0 },
            scrollStart: 0,
            scrolling: false,
            dragging: false
        };
        // console.log("dragStates:", dragStates);

        // == add updated position data to store
        store.dispatch(addCellIdsArray(this.cellIdsArray));
        store.dispatch(addDragStates(dragStates));
        store.dispatch(setDraggerId("dragger1"));

        // == check for scroll behavior
        document.getElementById("sessions").addEventListener('scroll', this.detectGridScroll);
    }

    locateDragger(targetCellId) {
        console.log("== Grid::locateDragger ==");
        console.log("....dragger1:", this.refs['dragger1'].getWrappedInstance());
        let dragger = this.refs['dragger1'].getWrappedInstance();
        dragger.locateDragger(targetCellId);
    }

    // ======= ======= ======= dates ======= ======= =======
    // ======= ======= ======= dates ======= ======= =======
    // ======= ======= ======= dates ======= ======= =======

    makeDateHeaders(dates) {
        // console.log("== Grid: makeDateHeaders ==");
        let dateHeadersArray = dates.map((date, d) => {
            return(
                <Date
                    id={"date_" + d}
                    key={"date_" + d}
                    text={date}
                />
            )
        });
        return dateHeadersArray;
    }

    // ======= ======= ======= times ======= ======= =======
    // ======= ======= ======= times ======= ======= =======
    // ======= ======= ======= times ======= ======= =======

    makeRoomTimes(rooms, times) {
        // console.log("== Grid: makeRoomTimes ==");

        let roomTimesArray = rooms.map((roomname, r) => {
            return (
                <div
                    key={"roomBox_" + r}>
                    <RoomTime
                        id={"roomLabel_" + r}
                        key={"roomLabel_" + r}
                        text={roomname}
                        className={"roomCell"}
                    />
                    {this.makeTimeslots(r, times)}
                </div>
            )
        });
        return roomTimesArray;
    }

    makeTimeslots(r, times) {
        // console.log("== Grid: makeTimeslots ==");

        let timeslotsArray = times.map((timeslot, t) => {
            var timeslot = this.convertTimes(timeslot);
            var timeslotKey = r.toString() + t.toString();
            return (
                <RoomTime
                    id={"time_" + r + t}
                    key={timeslotKey}
                    text={timeslot}
                    className={"timeCell"}
                />
            )
        });
        return timeslotsArray;
    }

    // == set location of clicked session component (handleClick method)
    convertTimes(time) {
        // console.log("== Grid: convertTimes ==");
            var ampm = "am";
            var hour = parseInt(time.split(":")[0]);
            var min = time.split(":")[1];
            if (hour > 12) {
                hour = hour - 12
                ampm = "pm"
            }
            return hour + ":" + min + ampm;
    }

    // ======= ======= ======= grid ======= ======= ======= ======= ======= ======= grid ======= ======= =======
    // ======= ======= ======= grid ======= ======= ======= ======= ======= ======= grid ======= ======= =======
    // ======= ======= ======= grid ======= ======= ======= ======= ======= ======= grid ======= ======= =======

    makeGridCells(dates, rooms, times, sessions) {
        console.log("\n == Grid: makeGridCells ==");

        // == make cells for currently scheduling sessions
        this.makeSessionCells(times, sessions);

        // == add roomCells (spacers) and emptyCells then add to cellDataObj
        this.makeDayColumns(dates, rooms, times);

        // == get cell component objects for high end storage
        let cellComponents = this.makeCellComponents();

        // == add cell data object to store
        let storeCellData = store.getState().cellDataObj;

        return cellComponents;
    }

    // ======= create grid cell for each scheduled session
    makeSessionCells(times, sessions) {
        console.log(" == Grid: makeSessionCells ==");
        let timesCount = times.length + 1;      // number of daily timeslots (plus 1 for room label blank)

        // == initialize/create cell data object for each session
        let sessionDataArray = sessions.map((session, s) => {
            let nextRoom = parseInt(session.room_id);

            // == extract day and time values from session startTime object
            let nextCol = parseInt(session.session_start.substring(8,10)) - 1;
            let nextRow = parseInt(session.session_start.substring(11,13)) - 7 + ((nextRoom-1) * timesCount);
            let cellId = nextRow + "_" + nextCol;
            this.cellDataObj[cellId] = { id:cellId, addr:cellId, cellType:"sessionCell", sessionData:session }
        });
    }

    // ======= create data objects for: each day => each room per day => each timeslot per room per day
    makeDayColumns(dates, rooms, times) {
        console.log(" == Grid: makeDayColumns ==");
        let cellCount = 0;

        // == loop through days (dates)
        let dayDataArray = dates.map((date, d) => {
            let nextCol = d + 1;
            this.cellDaysArray[d] = [];

            // == loop through rooms
            let roomDataArray = rooms.map((room, r) => {
                cellCount++;
                let nextRow = 1 + (r * 9);
                let roomId = nextRow + "_" + nextCol;
                this.cellDaysArray[d].push(roomId);
                this.cellDataObj[roomId] = { id:null, addr:roomId, cellType:"roomCell" };

                // == loop through timeslots
                let emptyDataArray = times.map((time, t) => {
                    cellCount++;
                    let nextRow = (t + 2) + (r * 9);
                    let nextCellId = nextRow + "_" + nextCol;
                    this.cellDaysArray[d].push(nextCellId);

                    // == avoid existing cells for previously-scheduled sessions
                    if (!this.cellDataObj[nextCellId]) {
                        this.cellDataObj[nextCellId] = { id:cellCount, addr:nextCellId, cellType:"emptyCell", sessionData:null };
                    }
                });
            });
        });
    }

    // ======= create react components for each cell location (via days/rooms/times counts)
    makeCellComponents() {
        console.log(" == Grid: makeCellComponents ==");
        var text, color, className, sessionData, title;

        // == loop through days (nested arrays within this.cellDaysArray)
        let dayComponentsArray = this.cellDaysArray.map((dayCells, d) => {

            // == loop through timeslot/blank row cells of each nested day array
            let cellComponentsArray = dayCells.map((cellId, c) => {

                // == get cell data pertaining to each cell address (e.g. "2_1")
                let cellData = this.cellDataObj[cellId];
                if (cellData.sessionData) {
                    title = cellData.sessionData.session_title
                } else {
                    title = null
                }

                // == specify style params for cell types
                if (cellData.cellType === "sessionCell") {
                    sessionData = cellData.sessionData;
                    className = "sessionCell";
                    color = "white";
                    text = title;
                } else if (cellData.cellType === "roomCell") {
                    sessionData = null;
                    className = "roomCell";
                    color = "a1aaa8";
                    text = "";
                } else {
                    sessionData = null;
                    className = "emptyCell";
                    color = "#b1b9b7";
                    text = "";
                }
                return (
                    <SessionCell
                        id={cellId}
                        key={"cell_" + d + c}
                        ref={cellId}
                        text={text}
                        className={"cell " + className}
                        sessionData={sessionData}
                        locateDragger={this.locateDragger}
                    />
                );
            });

            // == create column header cells for each day
            return(
                <Day
                    id={"day_" + d}
                    key={"day_" + d}
                    ref={"day_" + d}
                    cells={cellComponentsArray}
                />
            )
        });
        return dayComponentsArray;
    }

    // ======= ======= ======= dragger ======= ======= =======
    // ======= ======= ======= dragger ======= ======= =======
    // ======= ======= ======= dragger ======= ======= =======

    makeDragger() {
        console.log("\n +++++++ == Grid: makeDragger == +++++++ ");
        return (
            <Dragger
                ref={"dragger1"}
            />
        )
    }

    // ======= ======= ======= render ======= ======= ======= ======= ======= ======= render ======= ======= =======
    // ======= ======= ======= render ======= ======= ======= ======= ======= ======= render ======= ======= =======
    // ======= ======= ======= render ======= ======= ======= ======= ======= ======= render ======= ======= =======

    render() {
        console.log("\n == Grid: render ==");

        let checkStore = store.getState();
        let dates = checkStore.dates[0];
        let rooms = checkStore.rooms[0];
        let times = checkStore.times[0];
        let sessions = checkStore.sessions[0];

        let dateHeaders, roomTimes, gridCells, dragStates, dragger;
        dateHeaders = this.makeDateHeaders(dates);
        roomTimes = this.makeRoomTimes(rooms, times);
        gridCells = this.makeGridCells(dates, rooms, times, sessions);
        dragger = this.makeDragger();

        return (
            <div
                id={"grid"}
                ref={"grid"}>
                <div
                    id={"dates"}
                    ref={"dates"}>
                    <div id="cornerCell"></div>
                    {dateHeaders}
                </div>
                <div
                    id={"sessions"}
                    ref={"sessions"}>
                    <div
                        id={"rooms"}
                        ref={"rooms"}>
                        {roomTimes}
                    </div>
                    {dragger}
                    {gridCells}
                </div>
            </div>
        )
    }
}

// == check state after updates
function showState() {
    console.log("\n == Grid: showState ==");
    const state = store.getState();
    console.log("state:", state);
}
store.subscribe(showState);

export default Grid;
// export default connect(mapStateToProps, mapDispatchToProps)(Grid);

// ======= ======= ======= Store ======= ======= =======
// ======= ======= ======= Store ======= ======= =======
// ======= ======= ======= Store ======= ======= =======

// const mapDispatchToProps = (dispatch, ownProps) => {
//     console.log("\n  == mapDispatchToProps ==")
//     console.log("ownProps:", ownProps);
//     return {
//         addDates: dates => dispatch(addDates(ownProps.dates)),
//         addTimes: times => dispatch(addTimes(ownProps.times)),
//         addRooms: rooms => dispatch(addRooms(ownProps.rooms)),
//         addSessions: sessions => dispatch(addSessions(ownProps.sessions)),
//
//         setStartId: startCellId => dispatch(setStartId(ownProps.startCellId)),
//         setTargetId: targetCellId => dispatch(setTargetId(ownProps.targetCellId)),
//         setDraggerId: targetCellId => dispatch(setDraggerId(ownProps.draggerId)),
//         addDragStates: dragStates => dispatch(addDragStates(ownProps.dragStates)),
//         addCellIdsArray: cellDaysArray => dispatch(addCellIdsArray(ownProps.cellDaysArray)),
//         addCellDataObj: cellDataObj => dispatch(addCellDataObj(ownProps.cellDataObj))
//     }
// }
