import React from 'react';
import ReactDOM from 'react-dom'

// ======= Day =======
class Day extends React.Component {
    constructor(props) {
        // console.log("\n== Day:constructor ==");
        super(props);
        this.state = {
            id: props.id
        }
    }

    render() {
        // console.log("\n== Day:render ==");
        return (
            <div
                id={this.props.id}
                ref={this.props.id}
                className={"day"}>
                {this.props.cells}
            </div>
        );
    }
}

export default Day;
