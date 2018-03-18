import React from 'react';
import ReactDOM from 'react-dom'

// ======= SessionClear =======
class SessionClear extends React.Component {
    constructor(props) {
        // console.log("\n== SessionClear:constructor ==");
        super(props);
        this.state = {
            className: "sessionInfo",
        }
    }

    render() {
        // console.log("\n== SessionClear:render ==");
        return (
            <div>
                <p className={"calLabel"}>session</p>
                <div
                    className={"sessionTitle"}>
                    &nbsp;
                </div>
                <p className={"calLabel"}>chairs</p>
                <div
                    className={"sessionChairs"}>
                    &nbsp;
                </div>
                <p className={"calLabel"}>abstracts</p>
                <div
                    className={"sessionAbstracts"}>
                    &nbsp;
                </div>
            </div>
        );
    }
}

export default SessionClear;
