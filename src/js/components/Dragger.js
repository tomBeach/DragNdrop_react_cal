import React from 'react';
import ReactDOM from 'react-dom';
import store from "../store/index";

// ======= ======= ======= DRAGGER ======= ======= =======
// ======= ======= ======= DRAGGER ======= ======= =======
// ======= ======= ======= DRAGGER ======= ======= =======

class Dragger extends React.Component {
    constructor(props) {
        console.log("== +++++++ Dragger:constructor +++++++ ==");
        super(props);
        console.log("props:", props);
        this.state = {
            id: props.id,
            text: props.text,
            startCellData: props.startCellData,
            scrollStart: 0,
            dragging: false,
            scrolling: false,
            gridXYWH: props.gridXYWH,
            dragXYWH: props.dragXYWH,
            relXY: props.relXY,
            mouseXY: props.mouseXY
        };
        this.detectCellHover = this.detectCellHover.bind(this);
        this.locateDragger = this.locateDragger.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    componentDidMount() {
        console.log("+++ Dragger:_DidMount");
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("+++ Dragger:_DidUpdate ==");
        console.log("this.state:", this.state);
        if (this.state.dragging && !prevState.dragging) {
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
        } else if (!this.state.dragging && prevState.dragging) {
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
        }
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

    scrollGridWindow() {
        console.log("== Dragger:scrollGridWindow ==");
    }

    // ======= onMouseDown =======
    onMouseDown(e) {
        console.log("\n\n== Dragger:onMouseDown ==");

        let startCellId = store.getState().startCellId[0];
        let targetCellId = store.getState().targetCellId[0];
        let cellDataStore = store.getState().cellDataObj[0];
        // console.log("cellDataStore:", cellDataStore);

        // == determine dragger location on DOM
        const dragger = ReactDOM.findDOMNode(this);
        let dragR = dragger.getBoundingClientRect();
        let tempStartData = cellDataStore[startCellId];
        let title = tempStartData.sessionData
            ? tempStartData.sessionData.session_title
            : null
        let scrollStart = $('#sessions').scrollTop();

        // == set drag position values on dragger
        let dragStates = store.getState().dragStates[0];
        // console.log("dragStates:", dragStates);

        // == load location and start cell data onto dragger
        this.setState({
            startCellData: tempStartData,
            scrollStart: scrollStart,
            dragging: true,
            gridXYWH: dragStates.gridXYWH,
            dragXYWH: dragStates.dragXYWH,
            relXY: {
                x: e.pageX - dragR.left,
                y: e.pageY - dragR.top
            },
            mouseXY: {
                x: e.pageX,
                y: e.pageY
            },
            text: title
        })
        e.stopPropagation();
        e.preventDefault();
    }

    // ======= onMouseMove =======
    onMouseMove(e) {
        console.log("== Dragger:onMouseMove ==");
        // console.log("this.state:", this.state);
        if (!this.state.dragging) return

        // == move dragger with mouse (corrected for dragger and grid offsets)
        let dragX = e.pageX - this.state.relXY.x - this.state.gridXYWH.x;
        let dragY = e.pageY - this.state.relXY.y - this.state.gridXYWH.y;
        let minL = this.state.gridXYWH.x - this.state.gridXYWH.x + 2;
        let maxR = (this.state.gridXYWH.x + this.state.gridXYWH.w - this.state.dragXYWH.w) - this.state.gridXYWH.x - 2;
        let minT = this.state.gridXYWH.y - this.state.gridXYWH.y + 2;
        let maxB = (this.state.gridXYWH.y + this.state.gridXYWH.h - this.state.dragXYWH.h) - this.state.gridXYWH.y - 2 - 20;
        console.log("dragXY:", dragX, dragY);
        // console.log("maxB:", maxB);
        if ((dragX > minL) && (dragX < maxR) && (dragY > minT) && (dragY < maxB)) {
            this.setState({
                dragging: true,
                dragXY: {
                    x: dragX,
                    y: dragY
                },
                mouseXY: {
                    x: e.pageX,
                    y: e.pageY
                }
            })

            // == check for dragger collision with grid cells
            e.stopPropagation();
            e.preventDefault();
            this.detectCellHover(dragX, dragY);
        } else if (dragY < minT) {
            this.scrollGridWindow(this.state.scrollStart, "down", dragY);
        } else if (dragY > maxB) {
            this.scrollGridWindow(this.state.scrollStart, "up", dragY);
        }
    }

    // ======= ======= ======= target detection ======= ======= =======
    detectCellHover() {
        console.log("\n== Dragger:detectCellHover ==");

        // == scan all target cells for collision
        for (var i = 0; i < this.state.cellIdsArray.length; i++) {
            let targetCellId = this.state.cellIdsArray[i];          // identify next cell to check
            let targetData = this.state.cellDataObj[targetCellId];  // access to cell position data
            let cellType = targetData.cellType;                     // for avoiding roomCells
            let tempTargetCell = targetData.cellComp;               // for clearing highlights

            // == clear all cell highlights (until new cell collision detected)
            tempTargetCell.setState({
                highlighted: false
            })

            // == continuously detect dragger collision with cells
            if ((dragX > targetData.x) && (dragX < (targetData.x + targetData.w)) && (dragY > targetData.y) && (dragY < (targetData.y + targetData.h))) {
                if ((targetCellId !== this.state.startCellId) && (cellType !== "roomCell")) {

                    // == load and highlight target cell; trigger detailed data display
                    this.setState({
                        targetCellId: targetCellId      // store new target cell id on dragger
                    })
                    tempTargetCell.setState({
                        highlighted: true               // highlight hover cell
                    })
                    break;
                }
            }
        }
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
        console.log("== Dragger:render ==");
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
            dragX = parseInt(dragStates.dragXYWH.x);
            dragY = parseInt(dragStates.dragXYWH.y);
            dragW = parseInt(dragStates.dragXYWH.w);
            dragH = parseInt(dragStates.dragXYWH.h);
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
