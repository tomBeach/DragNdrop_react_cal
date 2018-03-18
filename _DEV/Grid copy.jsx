import React from 'react';
import ReactDOM from 'react-dom'
import Day from './Day';
import Date from './Date';
import Dragger from './Dragger';
import RoomTime from './RoomTime';
import SessionCell from './SessionCell';

// ======= ======= ======= grid ======= ======= =======
// ======= ======= ======= grid ======= ======= =======
// ======= ======= ======= grid ======= ======= =======

// ======= Grid =======
class Grid extends React.Component {
    constructor(props) {
        console.log("\n== Grid:constructor ==");
        // console.log("props:", props);
        super(props);
        this.state = {
            dates: props.dates,
            timeslots: props.timeslots,
            roomnames: props.roomnames,
            all_sessions_array: props.all_sessions_array,
            // cellIdsArray: [],
            // cellDataObj: null,
            text: null,
            startCellId: "2_1",
            targetCellId: "2_1",
            dragging: true,
            scrolling: false,
            scrollTimer: -1,
            gridxy: { x:0, y:0 },
            gridwh: { x:0, y:0, w:0, h:0 },
            dragxy: { x:0, y:0 },
            dragwh: { w:0, h:0 }
        }
        this.cellDataObj = null;
        this.cellIdsArray = [];             // cell address strings only (used in for loop searches)
        this.locateDragger = this.locateDragger.bind(this);
        this.detectGridScroll = this.detectGridScroll.bind(this);
    }

    // ======= ======= ======= init ======= ======= =======
    // ======= ======= ======= init ======= ======= =======
    // ======= ======= ======= init ======= ======= =======

    detectGridScroll() {
        // console.log("== Grid:detectGridScroll ==");

        const grid = this;
        function scrollFinished(grid) {
            console.log("== scrollFinished ==");
            console.log("arguments:", arguments);
            grid.updateCellData();
        }
        if (this.state.scrollTimer != -1)
            clearTimeout(this.state.scrollTimer);
        this.state.scrollTimer = window.setTimeout(scrollFinished.bind(null, grid), 500)
    }

    updateCellData() {
        console.log("== Grid:updateCellData ==");
        let cellIdsArray = [];
        let startCellId = this.state.startCellId;

        let dayCells = ReactDOM.findDOMNode(this.refs.day_0);
        let timeCell = document.getElementById("roomLabel_0");
        let anchorCell = ReactDOM.findDOMNode(this.refs["2_1"]);
        let dayR = dayCells.getBoundingClientRect();
        let timeR = timeCell.getBoundingClientRect();
        let anchorR = anchorCell.getBoundingClientRect();
        let sessionsGrid = ReactDOM.findDOMNode(this.refs.sessions);
        let sessionsR = sessionsGrid.getBoundingClientRect();

        let dayColumns = this.refs.sessions.childNodes;
        let cellCounter = 0;

        for (var d = 2; d < dayColumns.length; d++) {
            let nextDayCells = dayColumns[d].childNodes;
            for (var c = 0; c < nextDayCells.length; c++) {
                let cell = nextDayCells[c];
                let cellId = nextDayCells[c].id;
                if (this.cellIdsArray.length === 0) {
                    cellIdsArray.push(cellId);
                }
                if (cell.className.includes('cell')) {
                    cellCounter++;
                    let cellR = nextDayCells[c].getBoundingClientRect();
                    if (this.cellDataObj[cellId]) {
                        let cellData = this.cellDataObj[cellId];
                        // console.log("cellR.top:", cellId, cellR.top);
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
        this.cellIdsArray = cellIdsArray;
        let title = this.cellDataObj[startCellId].sessionData
            ? this.cellDataObj[startCellId].sessionData.session_title
            : null

        let gridL = sessionsR.left + timeR.width;           // limit to left drag
        let gridT = sessionsR.top + timeR.height;           // limit to top drag
        let gridW = sessionsR.width - timeR.width + 10;     // limit to right drag when added to gridL
        // let gridH = sessionsR.height - timeR.height - 5;    // limit to bottom drag when added to gridH
        this.setState({
            text: { x:anchorR.left + timeR.width, y:anchorR.top + timeR.height },
            gridxy: { x:timeR.left, y:timeR.top },
            gridwh: { x:gridL, y:gridT, w:gridW, h:sessionsR.height },
            dragxy: { x:timeR.width + 6, y:anchorR.height + 3 },
            dragwh: { w:anchorR.width, h:anchorR.height },
            dragging: false,
            cellDataObj: this.cellDataObj,
            cellIdsArray: cellIdsArray
        })

        document.getElementById("sessions").addEventListener('scroll', this.detectGridScroll);
        console.log("this.cellDataObj:", this.cellDataObj);
        console.log("this.cellIdsArray:", this.cellIdsArray);
    }

    componentWillMount() {
        // console.log("== Grid:_willMOUNT");
    }

    componentDidMount() {
        console.log("== Grid:_didMOUNT");
        // this.updateCellData();
    }

    componentWillReceiveProps(nextProps) {
        // console.log("== Grid:_willReceivePROPS");
    }

    shouldComponentUpdate(props) {
        // console.log("== Grid:_SHOULDupdate");
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        // console.log("== Grid:_WillUPDATE ==");
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("== Grid:_DidUPDATE");
        let dragger = this.refs.dragger1;
        dragger.setState({
            gridwh: this.state.gridwh
        })
        // console.log("this.state:", this.state);
        console.log("this.cellIdsArray:", this.cellIdsArray);
    }

    locateDragger(targetCellId) {
        // console.log("== Grid::locateDragger ==");
        let dragger = this.refs.dragger1;
        dragger.locateDragger(targetCellId);
    }

    getGridSize() {
        // console.log("== Grid:getGridSize ==");
        let roomCount = this.state.roomnames.length;
        let timeCount = this.state.timeslots.length;
        return [roomCount, timeCount];
    }

    // ======= ======= ======= dates ======= ======= =======
    // ======= ======= ======= dates ======= ======= =======
    // ======= ======= ======= dates ======= ======= =======

    makeDateHeaders() {
        console.log("== Grid:makeDateHeaders ==");
        let dateHeadersArray = this.state.dates.map((date, d) => {
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

    makeRoomTimes() {
        console.log("== Grid:makeRoomTimes ==");
        let roomTimesArray = this.state.roomnames.map((roomname, r) => {
            return (
                <div
                    key={"roomBox_" + r}>
                    <RoomTime
                        id={"roomLabel_" + r}
                        key={"roomLabel_" + r}
                        text={roomname}
                        className={"roomCell"}
                    />
                    {this.makeTimeslots(r)}
                </div>
            )
        });
        return roomTimesArray;
    }

    makeTimeslots(r) {
        console.log("== Grid:makeTimeslots ==");
        let timeslotsArray = this.state.timeslots.map((timeslot, t) => {
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
        console.log("== Grid:convertTimes ==");
            var ampm = "am";
            var hour = parseInt(time.split(":")[0]);
            var min = time.split(":")[1];
            if (hour > 12) {
                hour = hour - 12
                ampm = "pm"
            }
            return hour + ":" + min + ampm;
    }

    // ======= ======= ======= RENDER ======= ======= =======
    // ======= ======= ======= RENDER ======= ======= =======
    // ======= ======= ======= RENDER ======= ======= =======

    makeGridCells() {
        console.log("== Grid:makeGridCells ==");
        let cellCount = 0;
        let cellDataObj = {};
        let cellDataObjArray = [];
        let activeCells = this.makeSessionCells(cellDataObj);
        let makeDayColumns = this.makeDayColumns(cellCount, cellDataObj, cellDataObjArray);
        let cellComponents = this.makeCellComponents(cellDataObj, cellDataObjArray);
        if (this.cellDataObj === null) {
            this.cellDataObj = cellDataObj;
        }
        return cellComponents;
    }

    makeSessionCells(cellDataObj) {
        console.log("== Grid:makeSessionCells ==");
        let sessionDataArray = this.state.all_sessions_array.map((session, s) => {
            let nextRoom = parseInt(session.room_id);
            let nextCol = parseInt(session.session_start.substring(8,10)) - 1;
            let nextRow = parseInt(session.session_start.substring(11,13)) - 7 + ((nextRoom-1) * 9);
            let rowCol = nextRow.toString() + "_" + nextCol.toString();
            let title = session.session_title.split(" (")[0];
            let id = session.session_id;
            cellDataObj[rowCol] = { id:null, addr:rowCol, cellType:"sessionCell", sessionData:session }
        });
        return sessionDataArray;
    }

    makeDayColumns(cellCount, cellDataObj, cellDataObjArray) {
        console.log("== Grid:makeDayColumns ==");
        let dayDataArray = this.state.dates.map((date, d) => {
            let nextCol = d + 1;
            cellDataObjArray[d] = [];
            let roomDataArray = this.state.roomnames.map((room, r) => {
                cellCount++;
                let nextRow = 1 + (r * 9);
                let roomId = nextRow + "_" + nextCol;
                cellDataObjArray[d].push(roomId);
                cellDataObj[roomId] = { id:null, addr:roomId, cellType:"roomCell" };
                let emptyDataArray = this.state.timeslots.map((time, t) => {
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

    makeDragger() {
        console.log("== Grid:makeDragger ==");
        console.log("");
        let text, startCellData, startCellId, targetCellId;
        let dragxy = this.state.dragxy;
        let dragwh = this.state.dragwh;
        let gridwh = this.state.gridwh;
        let gridxy = this.state.gridxy;
        this.cellIdsArray === []
            ? startCellId = targetCellId = "2_1"
            : startCellId = targetCellId = this.state.startCellId;
        this.cellDataObj[this.state.startCellId]
            ? startCellData = this.cellDataObj[startCellId].sessionData
            : startCellData = null;
        this.cellDataObj[startCellId].sessionData
            ? text = this.cellDataObj[startCellId].sessionData.session_title
            : text = null;
        return (
            <Dragger
                id={"dragger1"}
                ref={"dragger1"}
                text={text}
                timeslots={this.state.timeslots}
                roomnames={this.state.roomnames}
                gridxy={gridxy}
                dragxy={dragxy}
                gridwh={gridwh}
                dragwh={dragwh}
                cellDataObj={this.cellDataObj}
                cellIdsArray={this.cellIdsArray}
                startCellData={startCellData}
            />
        )
    }

    render() {
        console.log("== Grid:render ==");
        let dateHeaders = this.makeDateHeaders();
        let roomTimes = this.makeRoomTimes();
        let gridCells = this.makeGridCells();
        let dragger = this.makeDragger();
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
                    {dragger}
                    {gridCells}
                </div>
            </div>
        );
    }
}
export default Grid;
