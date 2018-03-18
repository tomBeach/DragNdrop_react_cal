import React from 'react'
import ReactDOM from 'react-dom'
import Calendar from './Calendar';

$(document).on('turbolinks:load', function() {
    // console.log("== turbolinks:load ==");

    const rooms = ["R100", "R200", "R300", "North Hall"];
    const dates = ["2018-10-02", "2018-10-03", "2018-10-04", "2018-10-05"];
    const timeslots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
    const calendarData = [ rooms, dates, timeslots ];

    render() {
        <Calendar
            calendarData={calendarData}
        />
    )
})
