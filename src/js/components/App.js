// ======= src/js/components/App.js =======
import React from "react";
import PropTypes from 'prop-types';
import autoBind from "react-autobind";
import Dragger from "./Dragger";

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
                        <Dragger
                            dates={this.state.dates}
                            times={this.state.times}
                            rooms={this.state.rooms}
                            sessions={this.state.sessions}

                            draggerId={"dragger1"}      // active data
                            startCellId={"2_1"}
                            targetCellId={"2_1"}

                            cellDataObj={{}}            // cell data
                            cellIdsArray={[]}

                            gridXYWH={{}}               // position data
                            dragXYWH={{}}
                            mouseXY={{}}
                            relXY={{}}

                            text={null}                 // display data
                            dragging={false}
                            scrolling={false}
                            scrollStart={0}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
