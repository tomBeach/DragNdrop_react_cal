import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import store from "../store/index";

// ======= ======= ======= DRAGGER ======= ======= =======
// ======= ======= ======= DRAGGER ======= ======= =======
// ======= ======= ======= DRAGGER ======= ======= =======

const mapStateToProps = (state, ownProps) => {
    console.log("\n +++++++ == Dragger: mapStateToProps == +++++++ ")
    console.log("store.getState():", store.getState());
    console.log("ownProps:", ownProps);
    return {
        draggerId: state.draggerId,         // cell data
        startCellId: state.startCellId,
        targetCellId: state.targetCellId,

        dragStates: state.dragStates,       // position data
        cellDataObj: state.cellDataObj,
        cellIdsArray: state.cellIdsArray
    };
}

class DraggerRedux extends React.Component {
    constructor(props) {
        console.log("\n +++++++ == Dragger: constructor == +++++++");
        super(props);
        this.state = {
            draggerId: null,
            startCellId: null,
            targetCellId: null,

            cellDataObj: null,
            cellIdsArray: null,

            gridXYWH: null,
            dragXYWH: null,
            mouseXY: null,
            relXY: null,

            text: null,
            dragging: false,
            scrolling: false,
            scrollStart: 0
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
    }

    componentWillReceiveProps() {
        console.log("\n +++++++ == Dragger: componentWillReceiveProps == +++++++");
        let newState = store.getState();
        let dragStates = newState.dragStates[newState.dragStates.length - 1];
        let newId = newState.draggerId[newState.draggerId.length - 1];
        if (newId == "dragger1") {
            console.log("+++++ time to update +++++");
            console.log("dragStates:", dragStates);
            console.log("dragStates.dragXYWH:", dragStates.dragXYWH);
            this.setState({
                draggerId: newState.draggerId[newState.draggerId.length - 1],         // cell data
                startCellId: newState.startCellId[newState.startCellId.length - 1],
                targetCellId: newState.targetCellId[newState.targetCellId.length - 1],

                gridXYWH: dragStates.gridXYWH,
                dragXYWH: dragStates.dragXYWH,
                mouseXY: dragStates.mouseXY,
                relXY: dragStates.relXY,

                cellDataObj: newState.cellDataObj[newState.cellDataObj.length - 1],
                cellIdsArray: newState.cellIdsArray[newState.cellIdsArray.length - 1],
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("\n +++++++ == Dragger: componentDidUpdate == +++++++");
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
        console.log("\n == Dragger:locateDragger ==");
        let targetCellData = this.state.cellDataObj[targetCellId];
        let dragX = targetCellData.x;   // + col * pxOffsetX
        let dragY = targetCellData.y;   // + row * pxOffsetY
        let title = this.state.cellDataObj[targetCellId].sessionData
            ? this.state.cellDataObj[targetCellId].sessionData.session_title
            : null

        this.setState({
            dragXYWH: {
                x: dragX + 6,
                y: dragY + 3,
                w: targetCellData.w,
                h: targetCellData.h
            },
            text: title,
            startCellId: targetCellId,
            targetCellId: targetCellId
        })
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

        let startCellId = this.state.startCellId;
        let targetCellId = this.state.targetCellId;
        let cellDataObj = this.state.cellDataObj;
        let cellIdsArray = this.state.cellIdsArray;

        // == determine dragger location on DOM
        const dragger = ReactDOM.findDOMNode(this);
        let dragR = dragger.getBoundingClientRect();
        let tempStartData = cellDataObj[startCellId];
        let title = tempStartData.sessionData
            ? tempStartData.sessionData.session_title
            : null
        let scrollStart = $('#sessions').scrollTop();

        // == load location and start cell data onto dragger
        this.setState({
            text: title,
            startCellData: tempStartData,
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
        if (!this.state.dragging) return

        // == move dragger with mouse (corrected for dragger and grid offsets)
        let dragX = e.pageX - this.state.relXY.x;
        let dragY = e.pageY + this.state.relXY.y - this.state.gridXYWH.y;
        let dragW = this.state.dragXYWH.w;
        let dragH = this.state.dragXYWH.h;
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
                    y: dragY,
                    w: dragW,
                    h: dragH
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
    detectCellHover(dragX, dragY) {
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
                console.log("+++++++ hit +++++++");
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
        this.setState({
            dragging: false
        })
        this.dropDragger(e);
        e.stopPropagation();
        e.preventDefault();
    }

    dropDragger(e) {
        console.log("\n == Dragger:dropDragger ==");

        // ======= ======= ======= INIT ======= ======= =======
        // ======= ======= ======= INIT ======= ======= =======
        // ======= ======= ======= INIT ======= ======= =======

        // ======= dragger scope variable =======
        const dragger = this;

        // ======= START and TARGET cell data =======
        const cellDataObj = this.state.cellDataObj;
        const startCellId = this.state.startCellId;
        const targetCellId = this.state.targetCellId;
        const startCellData = cellDataObj[startCellId];
        const targetCellData = cellDataObj[targetCellId];

        // ======= get target row and column from targetCellId string =======
        const startRow = startCellId.split("_")[0];
        const startCol = startCellId.split("_")[1];
        const targetRow = targetCellId.split("_")[0];
        const targetCol = targetCellId.split("_")[1];

        // ======= get list of time cells in target room =======
        function getRoomTimes() {
            console.log("== Dragger:getRoomTimes ==");
            let roomCount = store.getState().rooms[0].length;
            let timeCount = store.getState().times[0].length;
            console.log("roomCount:", roomCount);

            let rowArray = [];
            for (var r = 1; r <= roomCount; r++) {
                let hiRow = (timeCount * (r - 1)) + r + 1;
                let loRow = (timeCount * r) + r;
                if ((hiRow <= parseInt(targetRow)) && (targetRow <= loRow)) {
                    for (var i = hiRow; i <= loRow; i++) {
                        rowArray.push(i);
                    }
                    return rowArray;
                }
            }
        }
        const roomTimesArray = getRoomTimes();

        // ======= get rows above and below target row =======
        let aboveCenterRows = roomTimesArray.filter(row => row <= targetRow);
        let belowCenterRows = roomTimesArray.filter(row => row >= targetRow);
        console.log("cellDataObj[targetCellId]:", cellDataObj[targetCellId]);

        // ======= determine entry point on target cell (above or below center) =======
        const dragY = e.pageY - dragger.state.relXY.y - dragger.state.gridXYWH.y;
        const cellCenterY = cellDataObj[targetCellId].y + (cellDataObj[targetCellId].h/2);
        let sessionCellsArray;
        const cellAddr = function(row, targetCol) {
            return row + "_" + targetCol;
        };
        const cellData = function(cellAddr) {
            return cellDataObj[cellAddr];
        };
        dragY > cellCenterY
            ? sessionCellsArray = aboveCenterRows.map(row => cellData(cellAddr(row, targetCol))).reverse()
            : sessionCellsArray = belowCenterRows.map(row => cellData(cellAddr(row, targetCol)));

        // ======= include only cells required for data shift; get nearest empty row =======
        const removeNullCells = function(cell) {
            if (cell) {
                return cell;
            }
        };
        let nearestEmptyRow = null;
        const shiftAddrsArray = sessionCellsArray.map((cell, c) => {
            if (cell.addr === startCellData.addr) {
                console.log("+++ START CELL +++");
            }
            if (nearestEmptyRow === null) {
                if (cell.cellType === "emptyCell") {
                    nearestEmptyRow = cell;
                    return cell.addr;
                } else if (cell.cellType === "sessionCell") {
                    return cell.addr;
                }
            }
        }).filter(removeNullCells).reverse();
        console.log("shiftAddrsArray:", shiftAddrsArray);
        console.log("nearestEmptyRow:", nearestEmptyRow);

        // ======= ======= ======= SWAP or SHIFT ======= ======= =======
        // ======= ======= ======= SWAP or SHIFT ======= ======= =======
        // ======= ======= ======= SWAP or SHIFT ======= ======= =======

        // ======= check for no empty cells
        shiftAddrsArray.length === sessionCellsArray.length
            ? swapStartTarget()
            : shiftCellData();

        // ======= shift cell data up or down =======
        function shiftCellData() {
            console.log("\n\n== shiftCellData ==");

            // == map source data to shifted cell
            shiftAddrsArray.map((addr, c) => {
                if (c < (shiftAddrsArray.length - 1)) {
                    let sourceDataAddr = shiftAddrsArray[c+1];
                    let sourceData = cellDataObj[sourceDataAddr];
                    let shiftData = cellDataObj[addr];
                    shiftData.cellType = sourceData.cellType;
                    shiftData.className = sourceData.className;
                    shiftData.sessionData = sourceData.sessionData;
                }
            });
            console.log("cellDataObj:", cellDataObj);
            swapStartTarget();
            updateStartTargetComps("start");
            updateStartTargetComps("target");
        }

        // ======= swap start and target cell data =======
        function swapStartTarget() {
            console.log("\n\n== swapStartTarget ==");
            let tempCellType = targetCellData.cellType;
            let tempClassName = targetCellData.className;
            let tempSessionData = targetCellData.sessionData;
            targetCellData.cellType = startCellData.cellType;
            targetCellData.className = startCellData.className;
            targetCellData.sessionData = startCellData.sessionData;
            if (nearestEmptyRow) {
                startCellData.cellType = "emptyCell";
                startCellData.className = "cell emptyCell";
                startCellData.sessionData = null;
            } else {
                startCellData.cellType = tempCellType;
                startCellData.className = tempClassName;
                startCellData.sessionData = tempSessionData;
            }
            console.log("cellDataObj:", cellDataObj);
            updateStartTargetComps("start");
            updateStartTargetComps("target");
        };

        // ======= update component to revised data =======
        function updateStartTargetComps(whichComp) {
            console.log("== updateStartComponent ==");

            let tempSessionData, title, cellComponent, cellData, bgColor;
            if (whichComp === "start") {
                tempSessionData = startCellData.sessionData;
                cellComponent = startCellData.cellComp;
                cellData = startCellData;
                bgColor = startCellData.cellType === "sessionCell"
                    ? "white"
                    : "#b1b9by";
            } else if (whichComp === "target"){
                tempSessionData = targetCellData.sessionData;
                cellComponent = targetCellData.cellComp;
                cellData = targetCellData;
                bgColor = targetCellData.cellType === "sessionCell"
                    ? "white"
                    : "#b1b9by";
            }
            if (nearestEmptyRow) {
                title = null;
            } else {
                title = tempSessionData.session_title;
            }
            console.log("cellComponent:", cellComponent);
            console.log("cellData:", cellData);

            cellComponent.setState({
                highlighted: false,
                color: bgColor,
                className: cellData.className,
                sessionData: cellData.sessionData,
                text: title
            })
        }

        // ======= update shifted components to revised data =======
        function updateShiftComponents() {
            console.log("== updateShiftComponents ==");
            shiftAddrsArray.map((addr, c) => {
                let cell = cellDataObj[addr];
                if (cell.addr === startCellId) {
                    if (nearestEmptyRow) {
                        cell = nearestEmptyRow;
                    }
                }
                let cellComponent = cell.cellComp;
                let bgColor = cell.cellType === "sessionCell"
                    ? "white"
                    : "#b1b9by";

                cellComponent.setState({
                    highlighted: false,
                    color: bgColor,
                    className: cell.className,
                    sessionData: cell.sessionData,
                    text: cell.sessionData.session_title
                })
            });
        }

        // ======= update dragger component data =======
        function updateDraggerComponent() {
            console.log("== updateDraggerComponent ==");
            let cellX = targetCellData.x;
            let cellY = targetCellData.y;
            let cellW = targetCellData.w;
            let cellH = targetCellData.h;
            dragger.setState({
                startCellId: targetCellId,
                cellDataObj: cellDataObj,
                dragging: false,
                dragXYWH: {
                    x: cellX + 6,
                    y: cellY + 3,
                    w: cellW,
                    h: cellH
                },
                text: targetCellData.sessionData.session_title
            });
        }

        // ======= shift data, update components =======
        updateShiftComponents();
        updateDraggerComponent();
        console.log("cellDataObj:", cellDataObj);
    }

    // ======= ======= ======= RENDER ======= ======= =======
    // ======= ======= ======= RENDER ======= ======= =======
    // ======= ======= ======= RENDER ======= ======= =======

    render() {
        console.log("\n == Dragger:render ==");
        // console.log("this.state:", this.state);

        // == initialize text and id
        let text, cellType, dragStyles, dragXYWH;
        let id = this.state.draggerId;
        let startCellId = this.state.startCellId;
        if (id === "dragger1") {
            cellType = this.state.cellDataObj[startCellId].cellType;
            if (cellType === "sessionCell") {
                text = this.state.cellDataObj[startCellId].sessionData.session_title;
            } else {
                text = null;
            }
            dragXYWH = this.state.dragXYWH;
            dragStyles = {
                position: 'absolute',
                display: 'block',       // none
                left: dragXYWH.x + 'px',
                top: dragXYWH.y + 'px',
                width: dragXYWH.w + 'px',
                height: dragXYWH.h + 'px'
            }
        } else {
            text = null;
            dragStyles = null;
        }

        return(
            <div
                id={id}
                style={dragStyles}
                onMouseDown={(e) => this.onMouseDown(e)}>
                <p>{text}</p>
            </div>
        )
    }
}

function showState() {
    console.log("\n == Dragger: showState ==");
    const state = store.getState();
    console.log("state:", state);
}
store.subscribe(showState);

const Dragger = connect(mapStateToProps, null, null, { withRef: true })(DraggerRedux);
export default Dragger;
// export default DraggerRedux;
