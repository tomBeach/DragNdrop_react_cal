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
                <div id="yield" className="section" data-state="default">
                    <div>
                        <h2 className="dataTitle">Calendar 4</h2>
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
