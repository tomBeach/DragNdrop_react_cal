import React from 'react';
import ReactDOM from 'react-dom'

// ======= SessionRoomCell =======
class SessionRoomCell extends React.Component {
    constructor(props) {
        // console.log("\n== SessionRoomCell:constructor ==");
        super(props);
        this.state = {
            id: props.id,
            className: "sessionRoomCell"
        }
    }

    render() {
        // console.log("\n== SessionRoomCell:render ==");
        return (
            <div
                id={this.state.id}
                className={this.state.className}>
            </div>
        );
    }
}

export default SessionRoomCell;
