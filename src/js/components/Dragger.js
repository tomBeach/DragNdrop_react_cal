import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import store from "../store/index";

// ======= ======= ======= DRAGGER ======= ======= =======
// ======= ======= ======= DRAGGER ======= ======= =======
// ======= ======= ======= DRAGGER ======= ======= =======

const mapStateToProps = (state, ownProps) => {
    console.log("\n == Dragger: mapStateToProps ==")
    console.log("state:", state);
    console.log("ownProps:", ownProps);
    return {
        draggerId: state.draggerId,
        startCellId: state.startCellId,
        targetCellId: state.targetCellId,
        dragStates: state.dragStates,
        cellDataObj: state.cellDataObj,
        cellDaysArray: state.cellDaysArray
    };
}

class Dragger extends React.Component {
    constructor(props) {
        console.log("\n +++++++ == Dragger: constructor == +++++++");
        super(props);
        this.state = {
            draggerId: props.draggerId,
            text: props.text,
            scrollStart: 0,
            dragging: false,
            scrolling: false,
            startCellId: props.startCellId,
            targetCellId: props.targetCellId,
            startCellData: props.startCellData,
            cellDataObj: null,
            cellIdsArray: null,
            dragStates: props.dragStates
        };
        this.detectCellHover = this.detectCellHover.bind(this);
        this.locateDragger = this.locateDragger.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    componentDidMount() {
        console.log("\n +++++++ == Dragger: componentDidMount == +++++++");
        console.log("this.state:", this.state);
        document.removeEventListener('mouseup', this.onMouseUp);
        let checkStore = store.getState();
        let dragStates = store.getState().dragStates;
        console.log("checkStore:", checkStore);
        console.log("dragStates:", dragStates);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("\n +++++++ == Dragger: componentDidUpdate == +++++++");
        console.log("prevProps:", prevProps);
        console.log("prevState:", prevState);

        // let dragStates = store.getState().dragStates[0];
        // console.log("dragStates:", dragStates);
        // if (!dragStates) {
        //     console.log("+++++++ UPDATING ID +++++++");
        //     this.setState({
        //         id: "dragger1"
        //     })
        // } else {
        //     console.log("+++++++ dragStates +++++++");
        // }

        if (this.state.dragging && !prevState.dragging) {
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
        } else if (!this.state.dragging && prevState.dragging) {
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
        }
        // console.log("this.state.startCellId:", this.state.startCellId);
        // console.log("store.getState().dragStates:", store.getState().dragStates);
        // if (!this.state.startCellId) {
        //     let startCellId = store.getState().startCellId[0];
        //     console.log(" +++++++ NO START CELL ID +++++++");
        //     this.setState({
        //         startCellId: startCellId,
        //         targetCellId: store.getState().targetCellId[0],
        //         startCellData: store.getState().cellDataObj[0][startCellId],
        //         cellIdsArray: store.getState().cellIdsArray[0],
        //         cellDataObj: store.getState().cellDataObj[0],
        //         dragXYWH: store.getState().dragStates[0].dragXYWH,
        //         gridXYWH: store.getState().dragStates[0].gridXYWH
        //     });
        // }
    }

    // ======= ======= ======= JUMP ======= ======= =======
    // ======= ======= ======= JUMP ======= ======= =======
    // ======= ======= ======= JUMP ======= ======= =======

    locateDragger(targetCellId) {
        console.log("\n == Dragger:locateDragger ==");
    }

    // ======= ======= ======= DRAG ======= ======= =======
    // ======= ======= ======= DRAG ======= ======= =======
    // ======= ======= ======= DRAG ======= ======= =======

    scrollGridWindow() {
        console.log("\n == Dragger:scrollGridWindow ==");
    }

    // ======= onMouseDown =======
    onMouseDown(e) {
        console.log("\n\n== Dragger:onMouseDown ==");
        console.log("this.state:", this.state);

        let startCellId = store.getState().startCellId[0];
        let targetCellId = store.getState().targetCellId[0];
        let cellDataObj = store.getState().cellDataObj[0];
        let cellIdsArray = store.getState().cellIdsArray[0];
        // console.log("cellDataObj:", cellDataObj);

        // == determine dragger location on DOM
        const dragger = ReactDOM.findDOMNode(this);
        let dragR = dragger.getBoundingClientRect();
        let tempStartData = cellDataObj[startCellId];
        let title = tempStartData.sessionData
            ? tempStartData.sessionData.session_title
            : null
        let scrollStart = $('#sessions').scrollTop();

        // == get drag values from store; set on dragger
        let dragStates = store.getState().dragStates[0];
        // console.log("dragStates:", dragStates);

        // == load location and start cell data onto dragger
        this.setState({
            text: title,
            startCellData: tempStartData,
            cellIdsArray: cellIdsArray,
            cellDataObj: cellDataObj,

            dragXYWH: dragStates.dragXYWH,
            gridXYWH: dragStates.gridXYWH,
            mouseXY: {
                x: e.pageX,
                y: e.pageY
            },
            relXY: {
                x: e.pageX - dragR.left,
                y: e.pageY - dragR.top
            },
            dragging: true,
            scrollStart: scrollStart
        })
        e.stopPropagation();
        e.preventDefault();
    }

    // ======= onMouseMove =======
    onMouseMove(e) {
        // console.log("\n == Dragger:onMouseMove ==");
        // console.log("this.state:", this.state);
        if (!this.state.dragging) return

        // == move dragger with mouse (corrected for dragger and grid offsets)
        let dragX = e.pageX - this.state.relXY.x - this.state.gridXYWH.x;
        let dragY = e.pageY - this.state.relXY.y - this.state.gridXYWH.y;
        let minL = this.state.gridXYWH.x - this.state.gridXYWH.x + 2;
        let minT = this.state.gridXYWH.y - this.state.gridXYWH.y + 2;
        let maxR = (this.state.gridXYWH.x + this.state.gridXYWH.w - this.state.dragXYWH.w) - this.state.gridXYWH.x - 2;
        let maxB = (this.state.gridXYWH.y + this.state.gridXYWH.h - this.state.dragXYWH.h) - this.state.gridXYWH.y - 2 - 20;

        // == limit dragging to active grid rectangle
        if ((dragX > minL) && (dragX < maxR) && (dragY > minT) && (dragY < maxB)) {
            this.setState({
                dragging: true,
                dragXYWH: {
                    x: dragX,
                    y: dragY
                },
                mouseXY: {
                    x: e.pageX,
                    y: e.pageY
                }
            })

            // == check for dragger collision with grid cells
            // e.stopPropagation();
            // e.preventDefault();
            // this.detectCellHover(dragX, dragY);

        } else if (dragY < minT) {
            // this.scrollGridWindow(this.state.scrollStart, "down", dragY);
        } else if (dragY > maxB) {
            // this.scrollGridWindow(this.state.scrollStart, "up", dragY);
        }
    }

    // ======= ======= ======= target detection ======= ======= =======
    detectCellHover(dragX, dragY) {
        console.log("\n== Dragger:detectCellHover ==");
        console.log("this.state.cellIdsArray[0].length:", this.state.cellIdsArray[0].length);

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
        console.log("\n == Dragger:onMouseUp ==");
    }

    dropDragger(e) {
        console.log("\n == Dragger:dropDragger ==");
    }

    // ======= ======= ======= RENDER ======= ======= =======
    // ======= ======= ======= RENDER ======= ======= =======
    // ======= ======= ======= RENDER ======= ======= =======

    render() {
        console.log("\n == Dragger:render ==");
        console.log("this.state:", this.state);
        console.log("this.props:", this.props);

        let draggerIds = store.getState().draggerId;
        let draggerId = draggerIds[draggerIds.length - 1];
        console.log("draggerId:", draggerId);

        return(
            <div
                id={draggerId}
                style={this.props.styles}
                onMouseDown={(e) => this.onMouseDown(e)}>
                <p>{this.props.text}</p>
            </div>
        )
    }
}

// export default Dragger;
export default connect(mapStateToProps)(Dragger);
