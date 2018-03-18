import React from 'react';
import ReactDOM from 'react-dom'
import Grid from './Grid';

// ======= calendar =======
class Calendar extends React.Component {
    constructor(props) {
        // console.log("\n== Calendar:constructor ==");
        super(props);
        this.state = {
            dates: props.calendarData[0],
            roomnames: props.calendarData[1],
            timeslots: props.calendarData[2],
            all_sessions_array: props.calendarData[3]
        }
    }

    render() {
        // console.log("\n== Calendar:render ==");
        return (
            <div>
                <h2 className="dataTitle">Calendar</h2>
                <Grid
                    dates={this.state.dates}
                    timeslots={this.state.timeslots}
                    roomnames={this.state.roomnames}
                    all_sessions_array={this.state.all_sessions_array}
                />
            </div>
        );
    }
}

export default Calendar;
