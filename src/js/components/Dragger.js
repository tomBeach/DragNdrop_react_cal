import React from 'react';
import ReactDOM from 'react-dom';
import store from "../store/index";

// ======= ======= ======= DRAGGER ======= ======= =======
// ======= ======= ======= DRAGGER ======= ======= =======
// ======= ======= ======= DRAGGER ======= ======= =======

class Dragger extends React.Component {
    constructor(props) {
        console.log("== Dragger:constructor ==");
        super(props);
        this.state = {
            id: props.id,
            text: props.text,
            startCellData: props.startCellData
        };
        this.detectCellHover = this.detectCellHover.bind(this);
        this.locateDragger = this.locateDragger.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    componentDidMount() {
        // console.log("+++ Dragger:_DidMount");
        document.removeEventListener('mouseup', this.onMouseUp);
    }
    // ======= ======= ======= JUMP ======= ======= =======
    // ======= ======= ======= JUMP ======= ======= =======
    // ======= ======= ======= JUMP ======= ======= =======

    locateDragger(targetCellId) {
        console.log("\n== Dragger:locateDragger ==");
    }

    // ======= ======= ======= DRAG ======= ======= =======
    // ======= ======= ======= DRAG ======= ======= =======
    // ======= ======= ======= DRAG ======= ======= =======

    // ======= ======= ======= init drag ======= ======= =======
    onMouseDown(e) {
        console.log("\n\n== Dragger:onMouseDown ==");
    }

    scrollGridWindow() {
        console.log("== Dragger:scrollGridWindow ==");
    }

    onMouseMove(e) {
        console.log("== Dragger:onMouseMove ==");
    }

    // ======= ======= ======= target detection ======= ======= =======
    detectCellHover() {
        console.log("\n== Dragger:detectCellHover ==");
    }

    // ======= ======= ======= end drag ======= ======= =======
    onMouseUp(e) {
        console.log("\n\n== Dragger:onMouseUp ==");
    }

    dropDragger(e) {
        console.log("== Dragger:dropDragger ==");
    }

    // ======= ======= ======= RENDER ======= ======= =======
    // ======= ======= ======= RENDER ======= ======= =======
    // ======= ======= ======= RENDER ======= ======= =======

    render() {
        let dragX, dragY, dragW, dragH, dragStyle;
        let dragStates = store.getState().dragStates[0];
        console.log("dragStates:", dragStates);

        function isEmpty(obj) {
            for(var key in obj) {
                return !obj.hasOwnProperty(key);
            }
            return true;
        }
        let dragStates_empty = isEmpty(dragStates);
        console.log("dragStates_empty:", dragStates_empty);

        if (!dragStates_empty) {
            dragX = parseInt(dragStates.dragXY.x);
            dragY = parseInt(dragStates.dragXY.y);
            dragW = parseInt(dragStates.dragWH.w);
            dragH = parseInt(dragStates.dragWH.h);
            dragStyle = {
                position: 'absolute',
                left: dragX + 'px',
                top: dragY + 'px',
                width: dragW + 'px',
                height: dragH + 'px'
            }
        } else {
            dragStyle = {'color':'red'};
        }
        console.log("dragStyle:", dragStyle);
        return(
            <div
                id={this.props.id}
                text={this.props.text}
                style={dragStyle}
                onMouseDown={(e) => this.onMouseDown(e)}>
                <p>{this.props.text}</p>
                {/* id={this.props.id}
                    style={{dragStyle}}
                    onMouseDown={(e) => this.onMouseDown(e)}>
                <p>{this.state.text}</p> */}
            </div>
        )
    }
}

export default Dragger;
