import React from 'react';
import ReactDOM from 'react-dom'

// ======= RoomTime =======
class RoomTime extends React.Component {
    constructor(props) {
        // console.log("\n== RoomTime:constructor ==");
        super(props);
        this.state = {
            text: props.text
        }
    }

    render() {
        // console.log("\n== RoomTime:render ==");
        return (
            <p
                id={this.props.id}
                className={this.props.className}>
                {this.props.text}
            </p>
        );
    }
}

export default RoomTime;
