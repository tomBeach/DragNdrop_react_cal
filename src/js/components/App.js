// ======= src/js/components/App.js =======
import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import Grid from "./Grid";

// ======= App =======
class App extends React.Component {
    constructor(props) {
        console.log("\n == App: constructor ==");
        console.log("props:", props);
        super(props);
        autoBind(this);
        this.state = {
            dates: props.dates,         // grid data
            times: props.times,
            rooms: props.rooms,
            sessions: props.sessions,
        }
    }

    componentDidMount(props) {
        console.log("\n == App: componentDidMount ==");
    }

    render() {
        console.log("\n == App: render ==");
        return (
            <div id="contentBox">
                <div id="yield" data-state="default">
                    <div>
                        <div id="calendarMenu">
                            <h2 className="dataTitle">Calendar Test</h2>
                            <button id="undoBtn" type="button" name="button">undo</button>
                            <button id="redoBtn" type="button" name="button">redo</button>
                        </div>
                        <Grid
                            dates={this.state.dates}
                            times={this.state.times}
                            rooms={this.state.rooms}
                            sessions={this.state.sessions}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
