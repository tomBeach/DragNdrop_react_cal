// ======= src/js/components/Dragger.js =======
import React from "react";
import ReactDOM from "react-dom"
import autoBind from "react-autobind";

import Day from "./Day";
import Date from "./Date";
import RoomTime from "./RoomTime";
import SessionCell from "./SessionCell";

// ======= ======= ======= component ======= ======= =======
// ======= ======= ======= component ======= ======= =======
// ======= ======= ======= component ======= ======= =======

// ======= Dragger =======
class Dragger extends React.Component {
    constructor(props) {
        console.log("\n == Dragger: constructor ==");
        console.log("props:", props);
        super(props);
        autoBind(this);
        this.state = {
            dates: props.dates,
            times: props.times,
            rooms: props.rooms,
            sessions: props.sessions,

            draggerId: "dragger1",      // active data
            startCellId: "2_1",
            targetCellId: "2_1",

            gridXYWH: {},               // position data
            dragXYWH: {},
            mouseXY: {},
            relXY: {},

            text: null,                 // display data
            dragging: false,
            scrolling: false,
            scrollStart: 0
        }
        this.cellDataObj = {};          // storage object for element xywh and session data
        this.cellIdsArray = [];         // array of cell ids used for hover detection while dragging
        this.cellDaysArray = [];        // multidimensional array of days => cells
        this.dateHeaders = null;
        this.roomTimes = null;
        this.gridCells = null;
        this.dragger = null;
    }

    componentWillMount() {
        console.log("\n == Dragger: componentWillMount ==");
    }

    componentDidMount(props) {
        console.log("\n == Dragger: componentDidMount ==");
        this.updateCellData();
        this.addSessionData();
        this.locateDragger(this.state.startCellId);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("\n == Dragger: componentDidUpdate ==");
    }

    // ======= ======= ======= cellData ======= ======= =======
    // ======= ======= ======= cellData ======= ======= =======
    // ======= ======= ======= cellData ======= ======= =======

    updateCellData() {
        console.log("\n");
        console.log(" +++++++ == Dragger: updateCellData == +++++++ ");
        console.log(" +++++++ == Dragger: updateCellData == +++++++ ");
        console.log(" +++++++ == Dragger: updateCellData == +++++++ ");
        console.log("\n");
        // console.log("this.refs:", this.refs);

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
            dragXYWH: dragXYWH,
            mouseXY: mouseXY,
            relXY: relXY
        })

        // == check for scroll behavior
        document.getElementById("sessions").addEventListener('scroll', this.detectGridScroll);
    }

    addSessionData() {
        console.log("\n == Dragger: addSessionData ==");

        // ======= create Dragger cell for each scheduled session
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
        console.log("this.cellDataObj:", this.cellDataObj);
    }

    locateDragger(targetCellId) {
        console.log(" == Dragger::locateDragger ==");
        let targetCellData = this.cellDataObj[targetCellId];
        console.log("targetCellData:", targetCellData);
        let dragX = targetCellData.x;   // + col * pxOffsetX
        let dragY = targetCellData.y;   // + row * pxOffsetY
        let title = this.cellDataObj[targetCellId].sessionData
            ? this.cellDataObj[targetCellId].sessionData.session_title
            : null

        this.setState({
            dragXYWH: {
                x: dragX + 5,
                y: dragY + 3,
                w: targetCellData.w,
                h: targetCellData.h
            },
            text: title,
            startCellId: targetCellId,
            targetCellId: targetCellId
        })
    }

    // ======= ======= ======= dates ======= ======= =======
    // ======= ======= ======= dates ======= ======= =======
    // ======= ======= ======= dates ======= ======= =======

    makeDateHeaders(dates) {
        console.log("== Dragger: makeDateHeaders ==");
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
        console.log("== Dragger: makeRoomTimes ==");

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
        console.log("== Dragger: makeTimeslots ==");

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
        console.log("== Dragger: convertTimes ==");
            var ampm = "am";
            var hour = parseInt(time.split(":")[0]);
            var min = time.split(":")[1];
            if (hour > 12) {
                hour = hour - 12
                ampm = "pm"
            }
            return hour + ":" + min + ampm;
    }

    // ======= ======= ======= Dragger ======= ======= ======= ======= ======= ======= Dragger ======= ======= =======
    // ======= ======= ======= Dragger ======= ======= ======= ======= ======= ======= Dragger ======= ======= =======
    // ======= ======= ======= Dragger ======= ======= ======= ======= ======= ======= Dragger ======= ======= =======

    makeGridCells(dates, rooms, times, sessions) {
        console.log("\n == Dragger: makeGridCells ==");

        // == add roomCells (spacers) and emptyCells then add to cellDataObj
        this.makeDayColumns(dates, rooms, times);

        // == get cell component objects for high end storage
        let cellComponents = this.makeCellComponents();
        console.log("this.cellDataObj:", this.cellDataObj);

        return cellComponents;
    }

    // ======= create data objects for: each day => each room per day => each timeslot per room per day
    makeDayColumns(dates, rooms, times) {
        console.log(" == Dragger: makeDayColumns ==");
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
                    let nextCellId = nextRow + "_" + nextCol;
                    this.cellDaysArray[d].push(nextCellId);

                    // == avoid existing cells for previously-scheduled sessions
                    this.cellDataObj[nextCellId] = { id:cellCount, addr:nextCellId, cellType:"emptyCell", sessionData:null };
                });
            });
        });
    }

    // ======= create react components for each cell location (via days/rooms/times counts)
    makeCellComponents() {
        console.log(" == Dragger: makeCellComponents ==");
        var text, color, className, sessionData, title;

        // ReactDOM.render(
        //     <App ref="app1" />,
        //     el
        // );
        // ReactDOM.render(
        //   <App ref={inst => {
        //     app1 = inst;
        //   }} />,
        //   el
        // );

        let dragger = this;

        // == loop through days (nested arrays within this.cellDaysArray)
        let dayComponentsArray = this.cellDaysArray.map((dayCells, d) => {

            let app2 = d;

            // == loop through timeslot/blank row cells of each nested day array
            let cellComponentsArray = dayCells.map((cellId, c) => {

                let app1 = cellId;

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
                        // ref={inst => {
                        //     console.log("+++++++++++++++++++:", inst);
                        //     app1 = inst;
                        // }}
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
                    // ref={inst => {
                    //     app2 = inst;
                    // }}
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
        console.log("\n +++++++ == Dragger: makeDragger == +++++++ ");
        console.log("this.state:", this.state);
        console.log("this.cellDataObj:", this.cellDataObj);

        let dragStyles;
        if (this.cellIdsArray.length > 0) {
            dragStyles = {
                position: 'absolute',
                display: 'block',
                left: this.state.dragXYWH.x + 'px',
                top: this.state.dragXYWH.y + 'px',
                width: this.state.dragXYWH.w + 'px',
                height: this.state.dragXYWH.h + 'px'
            }
        } else {
            dragStyles = {
                position: 'absolute',
                display: 'none',
                left: '0',
                top: '0',
                width: '0',
                height: '0'
            }
        }
        return(
            <div
                id={this.state.draggerId}
                style={dragStyles}
                onMouseDown={(e) => this.onMouseDown(e)}>
                <p>{this.state.text}</p>
            </div>
        )
    }

    // ======= ======= ======= render ======= ======= ======= ======= ======= ======= render ======= ======= =======
    // ======= ======= ======= render ======= ======= ======= ======= ======= ======= render ======= ======= =======
    // ======= ======= ======= render ======= ======= ======= ======= ======= ======= render ======= ======= =======

    render() {
        console.log("\n == Dragger: render ==");
        console.log("this.dateHeaders:", this.dateHeaders);
        console.log("this.roomTimes:", this.roomTimes);
        console.log("this.gridCells:", this.gridCells);
        console.log("this.dragger:", this.dragger);

        let dateHeaders, roomTimes, gridCells, dragger;
        if (!this.dateHeaders) {
            console.log("+++++++ NO grid components +++++++");
            let dates = this.state.dates;
            let rooms = this.state.rooms;
            let times = this.state.times;
            let sessions = this.state.sessions;

            let dateHeaders, roomTimes, gridCells, dragger;
            dateHeaders = this.makeDateHeaders(dates);
            roomTimes = this.makeRoomTimes(rooms, times);
            gridCells = this.makeGridCells(dates, rooms, times, sessions);

            this.dateHeaders = dateHeaders;
            this.roomTimes = roomTimes;
            this.gridCells = gridCells;
        } else {
            console.log("+++++++ grid components MADE +++++++");
            dateHeaders = this.dateHeaders;
            roomTimes = this.roomTimes;
            gridCells = this.gridCells;
        }
        dragger = this.makeDragger();
        return (
            <div
                id={"Dragger"}
                ref={"Dragger"}>
                <div
                    id={"dates"}
                    ref={"dates"}>
                    <div id="cornerCell"></div>
                    {this.dateHeaders}
                </div>
                <div
                    id={"sessions"}
                    ref={"sessions"}>
                    <div
                        id={"rooms"}
                        ref={"rooms"}>
                        {this.roomTimes}
                    </div>
                    {dragger}
                    {this.gridCells}
                </div>
            </div>
        )
    }
}

export default Dragger;
