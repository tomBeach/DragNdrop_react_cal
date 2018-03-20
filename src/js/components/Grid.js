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
import { addCellData } from "../actions/index";
import { addDragStates } from "../actions/index";

import Day from "./Day";
import Date from "./Date";
import RoomTime from "./RoomTime";
import SessionCell from "./SessionCell";
import Dragger from "./Dragger";

// ======= ======= ======= Store ======= ======= =======
// ======= ======= ======= Store ======= ======= =======
// ======= ======= ======= Store ======= ======= =======

const mapStateToProps = (state, ownProps) => {
    console.log("\n== mapStateToProps ==")
    console.log("state:", state);
    console.log("ownProps:", ownProps);
    return {
        dates: ownProps.dates,
        times: ownProps.times,
        rooms: ownProps.rooms,
        sessions: ownProps.sessions,
        dragStates: ownProps.dragStates,
        cellDataObj: ownProps.cellDataObj,
        startCellId: ownProps.startCellId,
        targetCellId: ownProps.targetCellId,
        draggerId: ownProps.draggerId
    };
}
const mapDispatchToProps = (dispatch, ownProps) => {
    console.log("\n == mapDispatchToProps ==")
    console.log("ownProps:", ownProps);
    return {
        addDates: dates => dispatch(addDates(ownProps.dates)),
        addTimes: times => dispatch(addTimes(ownProps.times)),
        addRooms: rooms => dispatch(addRooms(ownProps.rooms)),
        addSessions: sessions => dispatch(addSessions(ownProps.sessions)),
        addDragStates: dragStates => dispatch(addDragStates(ownProps.dragStates)),
        addCellData: cellDataObj => dispatch(addCellData(ownProps.cellDataObj)),
        setStartId: startCellId => dispatch(setStartId(ownProps.startCellId)),
        setTargetId: targetCellId => dispatch(setTargetId(ownProps.targetCellId))
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
            dates: props.dates,
            times: props.times,
            rooms: props.rooms,
            sessions: props.sessions,
            dragStates: props.dragStates,
            cellDataObj: props.cellDataObj,
            startCellId: props.startCellId,
            targetCellId: props.targetCellId,
            draggerId: props.draggerId
        };
    }

    componentDidMount(props) {
        console.log("\n== Grid: componentDidMount ==");
        console.log("  this.props:", this.props);
        console.log("  this.state:", this.state);
        console.log("  store.getState():", store.getState());

        React.Children.forEach(this.props.children, function(child) {
            console.log("child", child);
        });

        let dates = store.getState().dates;
        if (dates.length === 0) {
            console.log("+++ ADDING STATE VALUES +++");
            store.dispatch(addDates(this.props.dates));
            store.dispatch(addTimes(this.props.times));
            store.dispatch(addRooms(this.props.rooms));
            store.dispatch(addSessions(this.props.sessions));
            store.dispatch(setStartId(this.props.startCellId));
            store.dispatch(setTargetId(this.props.targetCellId))
        }
        this.updateCellData();
    }

    // ======= ======= ======= cellData ======= ======= =======
    // ======= ======= ======= cellData ======= ======= =======
    // ======= ======= ======= cellData ======= ======= =======

    updateCellData() {
        console.log("\n +++++++ == Grid:updateCellData +++++++ ==");
        console.log("this.state:", this.state);
        console.log("this.props:", this.props);

        // == get cell data objects from store
        let cellDataStore = store.getState().cellDataObj[0];
        let startCellId = store.getState().startCellId;
        console.log("startCellId:", startCellId);
        console.log("cellDataStore:", cellDataStore);

        // == get cell location data from mounted cell components
        let dayCells = ReactDOM.findDOMNode(this.refs.day_0);
        let timeCell = document.getElementById("roomLabel_0");
        let anchorCell = ReactDOM.findDOMNode(this.refs["2_1"]);
        let dayR = dayCells.getBoundingClientRect();
        let timeR = timeCell.getBoundingClientRect();
        let anchorR = anchorCell.getBoundingClientRect();
        let sessionsGrid = ReactDOM.findDOMNode(this.refs.sessions);
        let sessionsR = sessionsGrid.getBoundingClientRect();

        // == get arrays of cell components per day
        let dayColumns = this.refs.sessions.childNodes;
        let cellCounter = 0;

        // == loop through each day
        for (var d = 1; d < dayColumns.length; d++) {
            let nextDayCells = dayColumns[d].childNodes;

            // == loop through each cell per day
            for (var c = 0; c < nextDayCells.length; c++) {
                let cell = nextDayCells[c];
                let cellId = nextDayCells[c].id;
                if (cell.className.includes('cell')) {
                    cellCounter++;
                    let cellR = nextDayCells[c].getBoundingClientRect();
                    if (cellDataStore[cellId]) {
                        let cellData = cellDataStore[cellId];
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
        console.log("cellDataStore[startCellId]:", cellDataStore[startCellId]);
        let title = cellDataStore[startCellId].sessionData
            ? cellDataStore[startCellId].sessionData.session_title
            : null
            console.log("title:", title);

        let gridL = sessionsR.left + timeR.width;           // limit to left drag
        let gridT = sessionsR.top + timeR.height;           // limit to top drag
        let gridW = sessionsR.width - timeR.width + 10;     // limit to right drag when added to gridL
        let gridH = sessionsR.height - timeR.height - 5;    // limit to bottom drag when added to gridH
        // let dragStates = "dragStates";
        let dragStates = {
            text: { x:anchorR.left + timeR.width, y:anchorR.top + timeR.height },
            gridXY: { x:timeR.left, y:timeR.top },
            gridWH: { x:gridL, y:gridT, w:gridW, h:sessionsR.height },
            dragXY: { x:timeR.width + 6, y:anchorR.height + 3 },
            dragWH: { w:anchorR.width, h:anchorR.height },
            mouseXY: { x:0, y:0 },
            relXY: { x:0, y:0 },
            scrollStart: 0,
            dragging: false,
            scrolling: false
        };
        console.log("dragStates:", dragStates);

        // == add DOM-dependent data to store
        store.dispatch(addDragStates(dragStates));
        store.dispatch(addCellData(cellDataStore));

        // == create dragger, boundaries and behaviors
        document.getElementById("sessions").addEventListener('scroll', this.detectGridScroll);

        // == trigger dragger render
        console.log("+++ SETTING STATES +++");
        this.setState({
            draggerId: "dragger1"
        })

        // console.log("cellDataStore:", cellDataStore);
    }

    // ======= ======= ======= dates ======= ======= =======
    // ======= ======= ======= dates ======= ======= =======
    // ======= ======= ======= dates ======= ======= =======

    makeDateHeaders(dates) {
        console.log("== Grid: makeDateHeaders ==");
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
        console.log("== Grid: makeRoomTimes ==");

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
        console.log("== Grid: makeTimeslots ==");

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
        console.log("== Grid: convertTimes ==");
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
        console.log("\n== Grid:makeGridCells ==");

        // == cell data management variables (used by all grid building methods below)
        let cellDataObj = {};               // future storage object for element xywh and session data
        let cellDataObjArray = [];          // array of row_column ids ("2_1") for search functions

        // == make cells for currently scheduling sessions
        this.makeSessionCells(sessions, cellDataObj);

        // == add roomCells (spacers) and emptyCells then add to cellDataObj
        this.makeDayColumns(dates, rooms, times, cellDataObj, cellDataObjArray);

        // == get cell component objects for high end storage
        let cellComponents = this.makeCellComponents(cellDataObj, cellDataObjArray);

        // == add cell data object to store
        let storeCellData = store.getState().cellDataObj;
        if (storeCellData == "") {
            console.log("+++ ADDING cellDataObj +++");
            store.dispatch(addCellData(cellDataObj));
        }
        return cellComponents;
    }

    // ======= create grid cell for each scheduled session
    makeSessionCells(sessions, cellDataObj) {
        console.log("== Grid:makeSessionCells ==");
        let times = this.state.times;
        let timesCount = times.length + 1;      // number of daily timeslots (plus 1 for room label blank)

        // == initialize/create cell data object for each session
        let sessionDataArray = sessions.map((session, s) => {
            let nextRoom = parseInt(session.room_id);

            // == extract day and time values from session startTime object
            let nextCol = parseInt(session.session_start.substring(8,10)) - 1;
            let nextRow = parseInt(session.session_start.substring(11,13)) - 7 + ((nextRoom-1) * timesCount);
            let cellId = nextRow + "_" + nextCol;
            cellDataObj[cellId] = { id:cellId, addr:cellId, cellType:"sessionCell", sessionData:session }
        });
    }

    // ======= create data objects for: each day => each room per day => each timeslot per room per day
    makeDayColumns(dates, rooms, times, cellDataObj, cellDataObjArray) {
        console.log("== Grid:makeDayColumns ==");
        let cellCount = 0;

        // == loop through days (dates)
        let dayDataArray = dates.map((date, d) => {
            let nextCol = d + 1;
            cellDataObjArray[d] = [];

            // == loop through rooms
            let roomDataArray = rooms.map((room, r) => {
                cellCount++;
                let nextRow = 1 + (r * 9);
                let roomId = nextRow + "_" + nextCol;
                cellDataObjArray[d].push(roomId);
                cellDataObj[roomId] = { id:null, addr:roomId, cellType:"roomCell" };

                // == loop through timeslots
                let emptyDataArray = times.map((time, t) => {
                    cellCount++;
                    let nextRow = (t + 2) + (r * 9);
                    let nextCellId = nextRow + "_" + nextCol;
                    cellDataObjArray[d].push(nextCellId);

                    // == avoid existing cells for previously-scheduled sessions
                    if (!cellDataObj[nextCellId]) {
                        cellDataObj[nextCellId] = { id:null, addr:nextCellId, cellType:"emptyCell", sessionData:null };
                    }
                });
            });
        });
    }

    // ======= create react components for each cell location (via days/rooms/times counts)
    makeCellComponents(cellDataObj, cellDataObjArray) {
        console.log("== Grid:makeCellComponents ==");
        var text, color, className, sessionData, title;

        // == loop through days (nested arrays within cellDataObjArray)
        let dayComponentsArray = cellDataObjArray.map((dayCells, d) => {

            // == loop through timeslot/blank row cells of each nested day array
            let cellComponentsArray = dayCells.map((cellId, c) => {

                // == get cell data pertaining to each cell address (e.g. "2_1")
                let cellData = cellDataObj[cellId];
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
                        // locateDragger={this.locateDragger}
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
        console.log("+++++++ == Grid:makeDragger == +++++++ ");

        let startCellId, targetCellId;
        let dragXY, dragWH, gridWH, gridXY, startCellData, text, draggerId;
        let cellDataStore = store.getState().cellDataObj[0];
        let dragStates = store.getState().dragStates;
        // let dragStates = { key: "prop"};
        console.log("dragStates:", dragStates);

        function isEmpty(obj) {
            for(var key in obj) {
                return !obj.hasOwnProperty(key);
            }
            return true;
        }
        let dragStates_empty = isEmpty(dragStates);
        console.log("dragStates_empty:", dragStates_empty);

        // == get dragger location data
        if (!dragStates_empty) {
            console.log("store.getState():", store.getState());
            startCellId = store.getState().startCellId[0];
            targetCellId = store.getState().targetCellId[0];
            cellDataStore = store.getState().cellDataObj[0];
            dragXY = dragStates.dragXY;
            dragWH = dragStates.dragWH;
            gridWH = dragStates.gridWH;
            gridXY = dragStates.gridXY;
            draggerId = "dragger1";

            // == get session data for startCell (for temp storage while dragging)
            cellDataStore[startCellId]
                ? startCellData = cellDataStore[startCellId].sessionData
                : startCellData = null;

            // == get startCell session title (to set text of dragger component)
            cellDataStore[startCellId].sessionData
                ? text = cellDataStore[startCellId].sessionData.session_title
                : text = null;

        } else {
            startCellData = null;
            draggerId = "initDragger";
            text = "initDragger";
        }
        console.log("startCellData:", startCellData);
        console.log("draggerId:", draggerId);
        console.log("text:", text);

        // == make dragger component
        return (
            <Dragger
                id={draggerId}
                ref={draggerId}
                text={text}
                startCellData={startCellData}
            />
        )
    }

    // ======= ======= ======= render ======= ======= ======= ======= ======= ======= render ======= ======= =======
    // ======= ======= ======= render ======= ======= ======= ======= ======= ======= render ======= ======= =======
    // ======= ======= ======= render ======= ======= ======= ======= ======= ======= render ======= ======= =======

    render() {
        console.log("== Grid: render ==");
        console.log("this.state:", this.state);

        let dateHeaders, roomTimes, gridCells, dragStates, dragger;
        dateHeaders = this.makeDateHeaders(this.state.dates);
        roomTimes = this.makeRoomTimes(this.state.rooms, this.state.times);
        gridCells = this.makeGridCells(this.state.dates, this.state.rooms, this.state.times, this.state.sessions);
        dragger = this.makeDragger();
        console.log("dragger:", dragger);

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
export default Grid;
// export default connect(mapStateToProps, mapDispatchToProps)(Grid);
