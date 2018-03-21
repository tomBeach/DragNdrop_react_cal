// ======= src/js/index.js =======
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import PropTypes from 'prop-types';
import store from "./store/index";
import App from "./components/App";

require('../../sass/styles.scss');

const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
const dates = ["2018-10-02", "2018-10-03", "2018-10-04", "2018-10-05"];
const rooms = ["R100", "R200", "R300", "North Hall"];
const sessions = [
    { session_id: 1, room_id: 1, session_title: "session_title_1", session_start: "2018-10-02 09:00:00", room_name: "R100",
        sequences: [ { seq: 1, abs: 11, title: "abs_title_1" },  { seq: 2, abs: 22, title: "abs_title_2" }, { seq: 3, abs: 33, title: "abs_title_3" } ]
    },
    { session_id: 2, room_id: 1, session_title: "session_title_2", session_start: "2018-10-02 10:00:00", room_name: "R100",
        sequences: [ { seq: 1, abs: 11, title: "abs_title_4" },  { seq: 2, abs: 22, title: "abs_title_5" }, { seq: 3, abs: 33, title: "abs_title_6" } ]
    },
    { session_id: 3, room_id: 1, session_title: "session_title_3", session_start: "2018-10-02 11:00:00", room_name: "R100",
        sequences: [ { seq: 1, abs: 11, title: "abs_title_7" },  { seq: 2, abs: 22, title: "abs_title_8" }, { seq: 3, abs: 33, title: "abs_title_9" } ]
    },
    { session_id: 4, room_id: 1, session_title: "session_title_4", session_start: "2018-10-02 12:00:00", room_name: "R100",
        sequences: [ { seq: 1, abs: 11, title: "abs_title_10" },  { seq: 2, abs: 22, title: "abs_title_11" }, { seq: 3, abs: 33, title: "abs_title_12" } ]
    },
    { session_id: 5, room_id: 1, session_title: "session_title_5", session_start: "2018-10-02 13:00:00", room_name: "R100",
        sequences: [ { seq: 1, abs: 11, title: "abs_title_13" },  { seq: 2, abs: 22, title: "abs_title_14" }, { seq: 3, abs: 33, title: "abs_title_15" } ]
    },
    { session_id: 6, room_id: 1, session_title: "session_title_6", session_start: "2018-10-02 14:00:00", room_name: "R100",
        sequences: [ { seq: 1, abs: 11, title: "abs_title_16" },  { seq: 2, abs: 22, title: "abs_title_17" }, { seq: 3, abs: 33, title: "abs_title_18" } ]
    },
    { session_id: 7, room_id: 1, session_title: "session_title_7", session_start: "2018-10-02 15:00:00", room_name: "R100",
        sequences: [ { seq: 1, abs: 11, title: "abs_title_19" },  { seq: 2, abs: 22, title: "abs_title_20" }, { seq: 3, abs: 33, title: "abs_title_21" } ]
    },
    { session_id: 8, room_id: 1, session_title: "session_title_8", session_start: "2018-10-02 16:00:00", room_name: "R100",
        sequences: [ { seq: 1, abs: 11, title: "abs_title_22" },  { seq: 2, abs: 22, title: "abs_title_23" }, { seq: 3, abs: 33, title: "abs_title_24" } ]
    }
];
const data = [times, dates, rooms, sessions];

render(
    <Provider store={store}>
        <App
            dates={dates}
            times={times}
            rooms={rooms}
            sessions={sessions}
            draggerId={"initDragger"}
            startCellId={"2_1"}
            targetCellId={"2_1"}
            dragStates={null}
            cellDataObj={null}
            cellIdsArray={null}
        />
    </Provider>,
    document.getElementById("app")
);
