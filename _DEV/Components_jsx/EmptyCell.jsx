import React from 'react';
import ReactDOM from 'react-dom'

// ======= EmptyCell =======
class EmptyCell extends React.Component {
    constructor(props) {
        // console.log("\n== EmptyCell:constructor ==");
        super(props);
        this.state = {
            id: props.id,
            text: props.text,
            className: "cell emptyCell"
        }
    }

    render() {
        // console.log("\n== EmptyCell:render ==");
        return (
            <div
                id={this.state.id}
                key={this.state.id}
                text={this.props.text}
                className={this.state.className}>
            </div>
        );
    }
}

export default EmptyCell;
