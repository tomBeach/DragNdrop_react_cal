// ======= src/js/components/Grid.js =======
import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from "react-redux";
import { addDates } from "../actions/index";
import { addTimes } from "../actions/index";
import { addRooms } from "../actions/index";
// import Day from './Day';
import Date from './Date';
// import Dragger from './Dragger';
import RoomTime from './RoomTime';
// import SessionCell from './SessionCell';

// ======= Store =======
const mapStateToProps = (state) => {
    console.log("== mapStateToProps ==")
    console.log("state:", state);
    console.log("state.dates:", state.dates);
    return {
        dates: state.dates,
        times: state.times,
        rooms: state.rooms
    };
}
const mapDispatchToProps = (dispatch) => {
    console.log("== mapDispatchToProps ==")
    return {
        addDates: dates => dispatch(addDates(dates)),
        addTimes: times => dispatch(addTimes(times)),
        addRooms: rooms => dispatch(addRooms(rooms))
    }
}

// ======= ======= ======= grid ======= ======= =======
// ======= ======= ======= grid ======= ======= =======
// ======= ======= ======= grid ======= ======= =======

// ======= Grid =======
class Grid extends React.Component {
    constructor(props) {
        console.log("\n== Grid: constructor ==");
        console.log("props:", props);
        super(props);
        this.state = {
            dates: [],
            times: [],
            rooms: []
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

    componentDidUpdate() {
        console.log("== Grid: componentDidUpdate ==");
        console.log("  this.props:", this.props);
        console.log("  this.state:", this.state);

        let roomTimes, dateHeaders;
        let grid = this;
        let newDates = this.props.dates[0];
        let newTimes = this.props.times[0];
        let newRooms = this.props.rooms[0];

        if ((this.state.times != newTimes) && (this.state.rooms != newRooms)) {
            roomTimes = grid.makeRoomTimes(newRooms, newTimes);
        }

        if (this.state.dates != newDates) {
            dateHeaders = grid.makeDateHeaders(newDates);
            console.log("  dateHeaders:", dateHeaders);
            this.setState({
                dates: newDates,
                dateHeaders: dateHeaders
            });
        }
        if (this.state.times != newTimes) {
            this.setState({
                times: newTimes,
                roomTimes: roomTimes
            });
        }
        if (this.state.rooms != newRooms) {
            this.setState({
                rooms: newRooms
            });
        }
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

    // ======= ======= ======= render ======= ======= =======
    // ======= ======= ======= render ======= ======= =======
    // ======= ======= ======= render ======= ======= =======

    render() {
        console.log("== Grid: render ==");
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
                    {/* {dragger}
                    {gridCells} */}
                </div>
            </div>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Grid)
