// ======= src/js/components/Grid.js =======
import React from "react";
import ReactDOM from "react-dom"
import autoBind from "react-autobind";

// import store from "../store/index";
import { connect } from "react-redux";

import { addDates } from "../actions/index";
import { addTimes } from "../actions/index";
import { addRooms } from "../actions/index";
import { addSessions } from "../actions/index";
import { addGridCells } from "../actions/index";

import Day from "./Day";
import Date from "./Date";
import RoomTime from "./RoomTime";
import SessionCell from "./SessionCell";

// ======= ======= ======= Store ======= ======= =======
// ======= ======= ======= Store ======= ======= =======
// ======= ======= ======= Store ======= ======= =======

const mapStateToProps = (state, ownProps) => {
    console.log("\n== mapStateToProps ==")
    console.log("state:", state);
    return {
        dates: ownProps.dates,
        times: ownProps.times,
        rooms: ownProps.rooms,
        sessions: ownProps.sessions,
    };
}
const mapDispatchToProps = (dispatch, ownProps) => {
    console.log("\n == mapDispatchToProps ==")
    return {
        addDates: dates => dispatch(addDates(ownProps.dates)),
        addTimes: times => dispatch(addTimes(ownProps.times)),
        addRooms: rooms => dispatch(addRooms(ownProps.rooms)),
        addSessions: sessions => dispatch(addSessions(ownProps.sessions))
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
            gridCells: props.gridCells
        };
    }

    componentDidMount(props) {
        console.log("\n +++++++ +++++++ == Grid: componentDidMount ==");
        console.log("  this.props:", this.props);
        console.log("  this.state:", this.state);
    }

    componentWillReceiveProps(nextProps) {
        console.log("== Grid: componentWillReceiveProps ==");
        console.log("  nextProps:", nextProps);
    }

    componentDidUpdate() {
        console.log("\n +++++++ +++++++ == Grid: componentDidUpdate ==");
        console.log("  this.props:", this.props);
        console.log("  this.state:", this.state);
    }

    // ======= ======= ======= dates ======= ======= =======
    // ======= ======= ======= dates ======= ======= =======
    // ======= ======= ======= dates ======= ======= =======

    makeDateHeaders(dates) {
        console.log("== Grid: makeDateHeaders ==");
        console.log("  this.props:", this.props);
        console.log("  this.state:", this.state);
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
        console.log("\n +++++++ +++++++ == Grid: makeRoomTimes ==");

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

    // ======= ======= ======= grid ======= ======= =======
    // ======= ======= ======= grid ======= ======= =======
    // ======= ======= ======= grid ======= ======= =======

    makeGridCells(dates, rooms, times, sessions) {
        console.log("== Grid:makeGridCells ==");

        // == cell data management variables (used by all grid building methods below)
        let cellDataObj = {};
        let cellDataObjArray = [];

        // == make cells for currently scheduling sessions
        this.makeSessionCells(sessions, cellDataObj);

        // == add roomCells (spacers) and emptyCells then add to cellDataObj
        this.makeDayColumns(dates, rooms, times, cellDataObj, cellDataObjArray);

        // == get cell component objects for high end storage
        let cellComponents = this.makeCellComponents(cellDataObj, cellDataObjArray);
        console.log("cellComponents:", cellComponents);

        // STORE ON STORE

        return cellComponents;
    }

    makeSessionCells(sessions, cellDataObj) {
        console.log("== Grid:makeSessionCells ==");
        console.log("sessions:", sessions);
        let sessionDataArray = sessions.map((session, s) => {
            let nextRoom = parseInt(session.room_id);
            let nextCol = parseInt(session.session_start.substring(8,10)) - 1;
            let nextRow = parseInt(session.session_start.substring(11,13)) - 7 + ((nextRoom-1) * 9);
            let rowCol = nextRow.toString() + "_" + nextCol.toString();
            let title = session.session_title.split(" (")[0];
            let id = session.session_id;
            cellDataObj[rowCol] = { id:null, addr:rowCol, cellType:"sessionCell", sessionData:session }
        });
    }

    makeDayColumns(dates, rooms, times, cellDataObj, cellDataObjArray) {
        console.log("== Grid:makeDayColumns ==");
        let cellCount = 0;
        let dayDataArray = dates.map((date, d) => {
            let nextCol = d + 1;
            cellDataObjArray[d] = [];
            let roomDataArray = rooms.map((room, r) => {
                cellCount++;
                let nextRow = 1 + (r * 9);
                let roomId = nextRow + "_" + nextCol;
                cellDataObjArray[d].push(roomId);
                cellDataObj[roomId] = { id:null, addr:roomId, cellType:"roomCell" };
                let emptyDataArray = times.map((time, t) => {
                    cellCount++;
                    let nextRow = (t + 2) + (r * 9);
                    let nextCellId = nextRow + "_" + nextCol;
                    cellDataObjArray[d].push(nextCellId);
                    if (!cellDataObj[nextCellId]) {
                        cellDataObj[nextCellId] = { id:null, addr:nextCellId, cellType:"emptyCell", sessionData:null };
                    }
                });
            });
        });
    }

    makeCellComponents(cellDataObj, cellDataObjArray) {
        console.log("== Grid:makeCellComponents ==");
        var text, color, className, sessionData, title;
        let dayComponentsArray = cellDataObjArray.map((dayCells, d) => {
            let cellComponentsArray = dayCells.map((cellId, c) => {
                let cellData = cellDataObj[cellId];
                if (cellData.sessionData) {
                    title = cellData.sessionData.session_title
                } else {
                    title = null
                }
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
                        // sessionData={sessionData}
                        // locateDragger={this.locateDragger}
                    />
                );
            });
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


    // ======= ======= ======= render ======= ======= =======
    // ======= ======= ======= render ======= ======= =======
    // ======= ======= ======= render ======= ======= =======

    render() {
        console.log("== Grid: render ==");
        console.log("this.state.gridCells:", this.state.gridCells);

        let dateHeaders, roomTimes, gridCells;

        if (!this.state.gridCells) {
            console.log("+++ gridCells +++");
            dateHeaders = this.makeDateHeaders(this.state.dates);
            roomTimes = this.makeRoomTimes(this.state.rooms, this.state.times);
            gridCells = this.makeGridCells(this.state.dates, this.state.rooms, this.state.times, this.state.sessions);
        } else {
            roomTimes = null;
            dateHeaders = null;
            gridCells = null;
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
                    {/* {dragger} */}
                    {gridCells}
                </div>
            </div>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Grid);
