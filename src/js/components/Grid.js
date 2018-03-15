// ======= src/js/components/Grid.js =======
import React from 'react';
import ReactDOM from 'react-dom'
import store from "../store/index";
import { connect } from "react-redux";
import { addDates } from "../actions/index";
import { addTimes } from "../actions/index";
import { addRooms } from "../actions/index";
import { addGridCells } from "../actions/index";
import Day from './Day';
import Date from './Date';
// import Dragger from './Dragger';
import RoomTime from './RoomTime';
import SessionCell from './SessionCell';

console.log("store:", store);

// ======= ======= ======= Store ======= ======= =======
// ======= ======= ======= Store ======= ======= =======
// ======= ======= ======= Store ======= ======= =======

const mapStateToProps = (state) => {
    console.log("== mapStateToProps ==")
    console.log("state:", state);
    return {
        dates: state.dates,
        times: state.times,
        rooms: state.rooms,
        gridCells: state.gridCells
    };
}
const mapDispatchToProps = (dispatch) => {
    console.log("== mapDispatchToProps ==")
    return {
        addDates: dates => dispatch(addDates(dates)),
        addTimes: times => dispatch(addTimes(times)),
        addRooms: rooms => dispatch(addRooms(rooms)),
        addGridCells: gridCells => dispatch(addGridCells(gridCells))
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
        this.state = {
            dates: props.dates,
            times: props.times,
            rooms: props.rooms,
            gridCells: props.gridCells
        };
    }

    componentDidMount() {
        console.log("== Grid: componentDidMount ==");
        console.log("  this.props:", this.props);
        console.log("  this.state:", this.state);

        let dates = ["2018-10-02", "2018-10-03", "2018-10-04", "2018-10-05"];
        let times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
        let rooms = ["R100", "R200", "R300", "North Hall"];

        this.props.addDates(dates);
        this.props.addTimes(times);
        this.props.addRooms(rooms);
    }

    componentWillReceiveProps(nextProps) {
        console.log("== Grid: componentWillReceiveProps ==");
        console.log("  nextProps:", nextProps);

        let storeData = store.getState();
        console.log("  +++++++ storeData:", storeData);

        // if ((this.state.times != newTimes) && (this.state.rooms != newRooms)) {
            let roomTimes = this.makeRoomTimes(storeData);
            let gridCells = this.makeGridCells(storeData);
            console.log("  gridCells:", gridCells);
            console.log("  this.props:", this.props);
            this.props.addGridCells(gridCells);
        // }

        // this.setState({
        //     dates: nextProps.dates,
        //     times: nextProps.times,
        //     rooms: nextProps.rooms,
        //     gridCells: nextProps.gridCells
        // });
    }

    componentDidUpdate() {
        console.log("== Grid: componentDidUpdate ==");
        console.log("  this.props:", this.props);
        console.log("  this.state:", this.state);

        // if (this.state.dates != newDates) {
        //     dateHeaders = grid.makeDateHeaders(newDates);
        //     console.log("  dateHeaders:", dateHeaders);
        //     this.setState({
        //         dates: newDates,
        //         dateHeaders: dateHeaders
        //     });
        // }
        // if (this.state.times != newTimes) {
        //     this.setState({
        //         times: newTimes,
        //         roomTimes: roomTimes
        //     });
        // }
        // if (this.state.rooms != newRooms) {
        //     this.setState({
        //         rooms: newRooms
        //     });
        // }
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

    makeRoomTimes(storeData) {
        console.log("== Grid: makeRoomTimes ==");

        let rooms = storeData.rooms[0];
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
                    {this.makeTimeslots(r, storeData)}
                </div>
            )
        });
        return roomTimesArray;
    }

    makeTimeslots(r, storeData) {
        console.log("== Grid: makeTimeslots ==");

        let times = storeData.times[0];
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

    makeGridCells(storeData) {
        console.log("== Grid:makeGridCells ==");

        // == cell data management variables (used by all grid building methods below)
        let cellDataObj = {};
        let cellDataObjArray = [];

        // == make cells for currently scheduling sessions
        this.makeSessionCells(cellDataObj);

        // == add roomCells (spacers) and emptyCells then add to cellDataObj
        this.makeDayColumns(storeData, cellDataObj, cellDataObjArray);

        let cellComponents = this.makeCellComponents(cellDataObj, cellDataObjArray);
        console.log("cellComponents:", cellComponents);

        // STORE ON STORE

        return cellComponents;
    }

    makeSessionCells(cellDataObj) {
        console.log("== Grid:makeSessionCells ==");
        // == for database data only
        // let sessionDataArray = databaserecords.map((session, s) => {
        //     let nextRoom = parseInt(session.room_id);
        //     let nextCol = parseInt(session.session_start.substring(8,10)) - 1;
        //     let nextRow = parseInt(session.session_start.substring(11,13)) - 7 + ((nextRoom-1) * 9);
        //     let rowCol = nextRow.toString() + "_" + nextCol.toString();
        //     let title = session.session_title.split(" (")[0];
        //     let id = session.session_id;
        //     cellDataObj[rowCol] = { id:null, addr:rowCol, cellType:"sessionCell", sessionData:session }
        // });
    }

    makeDayColumns(storeData, cellDataObj, cellDataObjArray) {
        console.log("== Grid:makeDayColumns ==");
        let cellCount = 0;
        let dayDataArray = storeData.dates[0].map((date, d) => {
            let nextCol = d + 1;
            cellDataObjArray[d] = [];
            let roomDataArray = storeData.rooms[0].map((room, r) => {
                cellCount++;
                let nextRow = 1 + (r * 9);
                let roomId = nextRow + "_" + nextCol;
                cellDataObjArray[d].push(roomId);
                cellDataObj[roomId] = { id:null, addr:roomId, cellType:"roomCell" };
                let emptyDataArray = storeData.times[0].map((time, t) => {
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
        let gridCells = null;
        let roomTimes = null;
        let dateHeaders = null;
        if (this.state.dateHeaders) {
            console.log("+++ dateHeaders +++");
            dateHeaders = this.state.dateHeaders;
        }
        if (this.state.roomTimes) {
            console.log("+++ roomTimes +++");
            roomTimes = this.state.roomTimes;
        }
        if (this.state.gridCells) {
            console.log("+++ gridCells +++");
            gridCells = this.state.gridCells;
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
                        id={"roomTimes"}
                        ref={"roomTimes"}>
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

// import { LOREM_IPSUM } from "../constants/action-types";
//
// let sessionTitles;
// function sessionNameSeeds(lorem) {
//     console.log("== sessionNameSeeds ==")
//     sessionTitles = [];
//     for (var i = 0; i < 80; i++) {
//         let startChar = i * lorem.length/80;
//         let endChar = (i * lorem.length/80) + lorem.length/80;
//         let nextTitle = lorem.substring(startChar, endChar);
//         sessionTitles.push(nextTitle);
//     }
// }
// sessionNameSeeds(LOREM_IPSUM);
// // console.log("sessionTitles:", sessionTitles);
