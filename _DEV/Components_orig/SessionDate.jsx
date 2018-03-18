import React from 'react';
import ReactDOM from 'react-dom'

// ======= SessionDate =======
class SessionDate extends React.Component {
    constructor(props) {
        // console.log("\n== SessionDate:constructor ==");
        super(props);
        this.state = {
            id: props.id,
            text: props.text,
            className: props.className
        }
    }

    makeSessionDate() {
        // console.log("\n== SessionDate:makeSessionDate ==");
        return this.state.text.substring(5, 10);
    }

    render() {
        // console.log("\n== SessionDate:render ==");
        var dateText = this.makeSessionDate();
        return (
            <div
                id={this.state.id}
                className={this.state.className}>
                <p>{dateText}</p>
            </div>
        );
    }
}

export default SessionDate;
