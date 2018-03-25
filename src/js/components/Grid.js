// ======= src/js/components/Grid.js =======
import React from "react";
import ReactDOM from "react-dom"
import autoBind from "react-autobind";

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
        console.log("props:", props);
        super(props);
        autoBind(this);
        this.state = {
            dates: props.dates,         // grid data
            times: props.times,
            rooms: props.rooms,
            sessions: props.sessions,

            gridXYWH: {},               // position data
            dragXYWH: {},

            startCellId: "2_1",         // default start/target cells
            targetCellId: "2_1"
        }
        this.cellDataObj = {};          // storage object for element xywh and session data
        this.cellIdsArray = [];         // array of cell ids used for hover detection while dragging
        this.cellDaysArray = [];        // multidimensional array of days => cells
    }

    componentDidMount(props) {
        console.log("\n == Grid: componentDidMount ==");
        this.addCellPositions();
        this.addSessionData();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("\n +++++++ == Grid: componentDidUpdate == +++++++");
        if (this.state.dragging && !prevState.dragging) {
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
        } else if (!this.state.dragging && prevState.dragging) {
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
        }
    }

    // ======= ======= ======= cellData ======= ======= ======= ======= ======= ======= cellData ======= ======= =======
    // ======= ======= ======= cellData ======= ======= ======= ======= ======= ======= cellData ======= ======= =======
    // ======= ======= ======= cellData ======= ======= ======= ======= ======= ======= cellData ======= ======= =======

    addCellPositions() {
        console.log("\n");
        console.log(" +++++++ == Grid: addCellPositions == +++++++ ");
        console.log(" +++++++ == Grid: addCellPositions == +++++++ ");
        console.log(" +++++++ == Grid: addCellPositions == +++++++ ");
        console.log("\n");

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
        for (var d = 1; d < dayColumns.length; d++) {
            let nextDayCells = dayColumns[d].childNodes;

            // == loop through each cell per day
            for (var c = 0; c < nextDayCells.length; c++) {
                let cell = nextDayCells[c];
                let cellId = nextDayCells[c].id;        // DOM element id (same as cellDataObj cellId)

                // == build cellIdsArray used for cell hover detection
                this.cellIdsArray.push(cellId);

                // == get size/position data; add component refs to cellDataObj
                if (cell.className.includes('cell')) {
                    cellCounter++;
                    let cellR = nextDayCells[c].getBoundingClientRect();
                    this.cellDataObj[cellId].x = cellR.left - anchorR.left + timeR.width;
                    this.cellDataObj[cellId].y = cellR.top - anchorR.top + timeR.height;
                    this.cellDataObj[cellId].w = cellR.width;
                    this.cellDataObj[cellId].h = cellR.height;
                    this.cellDataObj[cellId].className = cell.className;
                    this.cellDataObj[cellId].cellComp = this.refs[cellId];
                }
            }
        }

        // == define allowable dragging rectangle from element sizes
        let gridL = sessionsR.left + timeR.width;           // limit to left drag
        let gridT = sessionsR.top + timeR.height;           // limit to top drag
        let gridW = sessionsR.width - timeR.width + 10;     // limit to right drag when added to gridL
        let gridH = sessionsR.height - timeR.height - 5;    // limit to bottom drag when added to gridH

        let gridXYWH = { x:gridL, y:gridT, w:gridW, h:gridH };
        let dragXYWH = { x:timeR.width + 5, y:anchorR.height + 3, w:anchorR.width, h:anchorR.height };
        let mouseXY = { x:0, y:0 };
        let relXY = { x:0, y:0 };

        this.setState({
            gridXYWH: gridXYWH,
            dragXYWH: dragXYWH
        })

        // == check for scroll behavior
        document.getElementById("sessions").addEventListener('scroll', this.detectGridScroll);
    }

    addSessionData() {
        console.log("\n == Grid: addSessionData ==");

        // ======= create Grid cell for each scheduled session
        let timesCount = this.state.times.length + 1;      // number of daily timeslots (plus 1 for room label blank)

        // == initialize/create cell data object for each session
        let sessionDataArray = this.state.sessions.map((session, s) => {
            let nextRoom = parseInt(session.room_id);

            // == extract day and time values from session startTime object
            let nextCol = parseInt(session.session_start.substring(8,10)) - 1;
            let nextRow = parseInt(session.session_start.substring(11,13)) - 7 + ((nextRoom-1) * timesCount);
            let cellId = nextRow + "_" + nextCol;
            this.cellDataObj[cellId].cellType = "sessionCell";
            this.cellDataObj[cellId].sessionData = session;
            this.cellDataObj[cellId].className = "cell sessionCell";
            this.cellDataObj[cellId].cellComp.setState({
                text: session.session_title,
                className: "cell sessionCell",
                sessionData: session
            })
        });
    }

    locateDragger(targetCellId) {
        console.log("== Grid: locateDragger ==");
        console.log("this.refs:", this.refs);
        let dragger = this.refs.dragger1;
        dragger.locateDragger(targetCellId);
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

    // ======= ======= ======= cells ======= ======= =======
    // ======= ======= ======= cells ======= ======= =======
    // ======= ======= ======= cells ======= ======= =======

    makeGridCells(dates, rooms, times, sessions) {
        console.log("\n == Grid: makeGridCells ==");

        // == check if cellDataObj has been made
        function isEmptyObject(object) {
            console.log("\n == isEmptyObject ==");
            for (var key in object) {
                return false;
            }
            return true;
        }
        let isEmpty = isEmptyObject(this.cellDataObj);

        // == add cell data to cellDataObj
        if (isEmpty) {
            this.makeCellDataObj(dates, rooms, times);
        }

        // == get cell component objects for high end storage
        let cellComponents = this.makeCellComponents();
        console.log("this.cellDataObj:", this.cellDataObj);

        return cellComponents;
    }

    // ======= create data objects for: each day => each room per day => each timeslot per room per day
    makeCellDataObj(dates, rooms, times) {
        console.log(" == Grid: makeCellDataObj ==");
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
                this.cellDataObj[roomId] = { id:cellCount, addr:roomId, cellType:"roomCell" };

                // == loop through timeslots
                let emptyDataArray = times.map((time, t) => {
                    cellCount++;
                    let nextRow = (t + 2) + (r * 9);
                    let cellId = nextRow + "_" + nextCol;
                    this.cellDaysArray[d].push(cellId);

                    // == create empty cells
                    this.cellDataObj[cellId] = { id:cellCount, addr:cellId, cellType:"emptyCell", sessionData:null };
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

    // ======= ======= ======= render ======= ======= ======= ======= ======= ======= render ======= ======= =======
    // ======= ======= ======= render ======= ======= ======= ======= ======= ======= render ======= ======= =======
    // ======= ======= ======= render ======= ======= ======= ======= ======= ======= render ======= ======= =======

    makeDragger() {
        console.log("\n +++++++ == Grid: makeDragger == +++++++ ");

        return(
            <Dragger
                ref={"dragger1"}
                startCellId={this.state.startCellId}
                targetCellId={this.state.targetCellId}
                gridXYWH={this.state.gridXYWH}
                dragXYWH={this.state.dragXYWH}
                cellDataObj={this.cellDataObj}
                cellIdsArray={this.cellIdsArray}
            />
        )
    }

    render() {
        console.log("\n == Grid: render ==");

        let dragger;
        let dates = this.state.dates;
        let rooms = this.state.rooms;
        let times = this.state.times;
        let sessions = this.state.sessions;

        let dateHeaders = this.makeDateHeaders(dates);
        let roomTimes = this.makeRoomTimes(rooms, times);
        let gridCells = this.makeGridCells(dates, rooms, times, sessions);

        if (this.cellIdsArray.length > 0) {
            dragger = this.makeDragger();
        } else {
            dragger = "<div></div>";
        }

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
                    {gridCells}
                    {dragger}
                </div>
            </div>
        )
    }
}

export default Grid;
