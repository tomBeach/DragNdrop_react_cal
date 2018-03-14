import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addDates } from "../actions/index";

const mapDispatchToProps = dispatch => {
    console.log("\n\n== ConnectedCalendar:mapDispatchToProps ==");
    return {
        addDates: dates => dispatch(addDates(dates))
    };
};

// ======= calendar =======
class ConnectedCalendar extends React.Component {
    constructor(props) {
        console.log("\n\n\n== ConnectedCalendar:constructor ==");
        super(props);
    }

    componentDidMount() {
        console.log("\n\n== ConnectedCalendar:componentDidMount ==");
        console.log("  this.state:", this.state);
        console.log("  this.props:", this.props);
    }

    componentDidUpdate() {
        console.log("\n\n== ConnectedCalendar:componentDidUpdate ==");
        console.log("  this.state:", this.state);
    }

    render() {
        console.log("\n\n== ConnectedCalendar:render ==");
        return (
            <div>
                <h2>Calendar</h2>
            </div>
        );
    }
}
const Calendar = connect(null, mapDispatchToProps)(ConnectedCalendar);  // Redux connect()
export default Calendar;
