// ======= src/js/components/App.js =======
import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import store from "../store/index";

import { addDates } from "../actions/index";
import { addTimes } from "../actions/index";
import { addRooms } from "../actions/index";
import { addSessions } from "../actions/index";
import { setStartId } from "../actions/index";
import { setTargetId } from "../actions/index";
import { setDraggerId } from "../actions/index";
import { addCellDataObj } from "../actions/index";
import { addDragStates } from "../actions/index";
import { addCellIdsArray } from "../actions/index";

import Grid from "./Grid";

// ======= App =======
class App extends React.Component {
    constructor(props) {
        console.log("\n == App: constructor ==");
        console.log("props:", props);
        super(props);
        autoBind(this);
        this.state = {
            dates: props.dates,                 // database
            times: props.times,
            rooms: props.rooms,
            sessions: props.sessions,

            draggerId: props.draggerId,         // cells
            startCellId: props.startCellId,
            targetCellId: props.targetCellId,

            cellDataObj: props.cellDataObj,     // cell interactions
            cellIdsArray: props.cellIdsArray
        };

        // == add remote database data to store
        store.dispatch(addDates(props.dates));
        store.dispatch(addTimes(props.times));
        store.dispatch(addRooms(props.rooms));
        store.dispatch(addSessions(props.sessions));

        // == add DOM-dependent data to store
        store.dispatch(setStartId(props.startCellId));
        store.dispatch(setTargetId(props.targetCellId));
        store.dispatch(setDraggerId(props.draggerId));
    }

    componentDidMount(props) {
        console.log("\n == App: componentDidMount ==");
    }


    render() {
        console.log("\n == App: render ==");
        return (
            <div id="contentBox">
                <div id="yield" className="section" data-state="default">
                    <div>
                        <h2 className="dataTitle">Calendar 4</h2>
                        <Grid />
                    </div>
                </div>
            </div>
        )
    }
}

function showState() {
    console.log("\n == App: showState ==");
    const state = store.getState();
    console.log("state:", state);
}
store.subscribe(showState);

export default App;
