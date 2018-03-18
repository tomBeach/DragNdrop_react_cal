// ======= src/js/components/App.js =======
import React from "react";
import PropTypes from 'prop-types';
import Grid from "./Grid";

const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
const dates = ["2018-10-02", "2018-10-03", "2018-10-04", "2018-10-05"];
const rooms = ["R100", "R200", "R300", "North Hall"];
const sessions = [
    { seq:1, abs:1, title:"next_abstract_title_1" },
    { seq:1, abs:2, title:"next_abstract_title_2" },
    { seq:1, abs:3, title:"next_abstract_title_3" },
    { seq:1, abs:4, title:"next_abstract_title_4" },
    { seq:1, abs:5, title:"next_abstract_title_5" },
    { seq:1, abs:6, title:"next_abstract_title_6" },
    { seq:1, abs:7, title:"next_abstract_title_7" },
    { seq:1, abs:8, title:"next_abstract_title_8" },
    { seq:1, abs:9, title:"next_abstract_title_9" }
];
const data = [times, dates, rooms, sessions];

const App = () => (
    <div id="contentBox">
        <div id="yield" className="section" data-state="default">
            <div>
                <h2 className="dataTitle">Calendar</h2>
                <Grid
                    dates={dates}
                    times={times}
                    rooms={rooms}
                    sessions={sessions}
                    gridCells={null}
                />
            </div>
        </div>
    </div>
    );

export default App;
