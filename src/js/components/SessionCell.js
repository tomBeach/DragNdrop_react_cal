import React from 'react';
import ReactDOM from 'react-dom'
import autoBind from 'react-autobind';
// import SessionInfo from './SessionInfo';
// import SessionClear from './SessionClear';

// ======= SessionCell =======
class SessionCell extends React.Component {
    constructor(props) {
        // console.log("\n == SessionCell:constructor ==");
        super(props);
        // console.log("props:", props);
        autoBind(this);
        this.state = {
            id: props.id,
            text: props.text,
            color: props.bgColor,
            className: props.className,
            sessionData: props.sessionData,
            highlighted: false
        }
        this.locateDragger = this.locateDragger.bind(this);
    }

    // ======= ======= ======= cell methods ======= ======= =======
    // ======= ======= ======= cell methods ======= ======= =======
    // ======= ======= ======= cell methods ======= ======= =======

    showSessionDetails(showHide, sessionData) {
        // console.log("\n == SessionCell:showSessionDetails ==");

        // if (this.state.sessionData) {
        //     if (showHide == "show") {
        //         var session_seq = sessionData.sequences;
        //
        //         // == split session title from chairs list (if any)
        //         if (sessionData.session_title.indexOf("(") > -1) {
        //             var session_title = sessionData.session_title.split(" (")[0];
        //             var session_chairs = sessionData.session_title.split(" (")[1].replace(")", "");
        //         } else {
        //             var session_title = sessionData.session_title;
        //             var session_chairs = "";
        //         }
        //
        //         ReactDOM.render(
        //             <SessionInfo
        //                 session_title={session_title}
        //                 session_chairs={session_chairs}
        //                 session_seq={session_seq}
        //             />,
        //             document.getElementById('calInfo')
        //         )
        //     } else {
        //         ReactDOM.render(
        //             <SessionClear />,
        //             document.getElementById('calInfo')
        //         )
        //     }
        // }
    }

    toggleHilite(e) {
        // console.log("\n == toggleHilite ==");
        e.preventDefault();
        if (this.state.className === "cell sessionCell") {
            this.setState({highlighted: !this.state.highlighted});
            if (!this.state.highlighted) {
                this.showSessionDetails("show", this.state.sessionData);
            } else {
                this.showSessionDetails("hide", "");
            }
        }
    }

    // ======= ======= ======= JUMP ======= ======= =======
    locateDragger(e) {
        console.log(" == SessionCell:locateDragger ==");
        console.log("this.state.id:", this.state.id);
        this.props.locateDragger(this.state.id);
    }

    // ======= ======= ======= RENDER ======= ======= =======
    render() {
        // console.log("\n == SessionCell:render ==");
        let stylesHilite = {
            backgroundColor: "thistle"
        }
        let stylesNormal = {
            backgroundColor: this.state.color
        }
        let styles = this.state.highlighted
            ? stylesHilite
            : stylesNormal;
        // console.log("styles:", styles);

        return (
            <div
                id={this.state.id}
                ref={this.saveRef}
                className={this.state.className}
                style={{styles}}
                onClick={(e) => this.locateDragger(e)}
                onMouseEnter={(e) => this.toggleHilite(e)}
                onMouseLeave={(e) => this.toggleHilite(e)}>
                {this.state.text}
            </div>
        );
    }
}

export default SessionCell;
