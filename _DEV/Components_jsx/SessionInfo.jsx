import React from 'react';
import ReactDOM from 'react-dom'

// ======= SessionInfo =======
class SessionInfo extends React.Component {
    constructor(props) {
        // console.log("\n== SessionInfo:constructor ==");
        super(props);
        this.state = {
            id: props.id,
            text: props.text,
            className: "sessionInfo",
            session_title: this.props.session_title,
            session_chairs: this.props.session_chairs,
            session_seq: this.props.session_seq
        }
    }

    componentDidMount() {
        // console.log("\n== SessionInfo:componentDidMount ==");
    }

    componentDidUpdate(props) {
        // console.log("\n== SessionInfo:componentDidUpdate ==");
    }

    render() {
        // console.log("\n== SessionInfo:render ==");

        function AbstractList(abstractList) {
            const abstractInfo = abstractList.map((abstractData, i) =>
                <li key={i}>
                    <a href={"/show_abstract/" + abstractData[2]}>{abstractData[2]}</a>
                </li>
            );
            return (
                <ul>{abstractInfo}</ul>
            );
        }

        return (
            <div>
                <p className={"calLabel"}>session</p>
                <div
                    className={"sessionTitle"}>
                    {this.state.session_title}
                </div>
                <p className={"calLabel"}>chairs</p>
                <div
                    className={"sessionChairs"}>
                    {this.state.session_chairs}
                </div>
                <p className={"calLabel"}>abstracts</p>
                <div
                    className={"sessionAbstracts"}>
                    {AbstractList(this.state.session_seq)}
                </div>
            </div>
        );
    }
}

export default SessionInfo;
