import React from 'react';
import ReactDOM from 'react-dom';

// ======= ======= ======= DRAGGER ======= ======= =======
// ======= ======= ======= DRAGGER ======= ======= =======
// ======= ======= ======= DRAGGER ======= ======= =======

class Dragger extends React.Component {
    constructor(props) {
        console.log("\n +++++++ == Dragger: constructor == +++++++");
        super(props);
        console.log("props:", props);
        this.state = {
            times: props.times,
            rooms: props.rooms,

            cellDataObj: props.cellDataObj,
            cellIdsArray: props.cellIdsArray,

            startCellId: props.startCellId,
            targetCellId: props.targetCellId,

            gridXYWH: props.gridXYWH,
            dragXYWH: props.dragXYWH,
            mouseXY: { x:0, y:0 },
            relXY: { x:0, y:0 },

            text: null,
            dragging: false,
            scrolling: false,
            scrollStart: 0
        };

        this.tempStartData = { cellType:null, className:null, sessionData:null };

        this.detectCellHover = this.detectCellHover.bind(this);
        this.locateDragger = this.locateDragger.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    componentDidMount() {
        console.log("\n +++++++ == Dragger: componentDidMount == +++++++");
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    componentWillReceiveProps(props) {
        console.log("\n +++++++ == Dragger: componentWillReceiveProps == +++++++");
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("\n +++++++ == Dragger: componentDidUpdate == +++++++");
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
        let title = this.state.cellDataObj[targetCellId].sessionData
            ? this.state.cellDataObj[targetCellId].sessionData.session_title
            : null
        this.setState({
            dragXYWH: {
                x: targetCellData.x + 5,
                y: targetCellData.y + 3,
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
        console.log("\n == Dragger:onMouseDown ==");
        console.log("this.state:", this.state);

        let startCellId = this.state.startCellId;
        let targetCellId = this.state.targetCellId;
        let cellDataObj = this.state.cellDataObj;
        let cellIdsArray = this.state.cellIdsArray;

        // == determine dragger location on DOM
        const dragger = ReactDOM.findDOMNode(this);
        let dragR = dragger.getBoundingClientRect();
        let title = cellDataObj[startCellId].sessionData
            ? cellDataObj[startCellId].sessionData.session_title
            : null
        let scrollStart = $('#sessions').scrollTop();

        // == load location and start cell data onto dragger
        this.setState({
            text: title,
            // startCellData: cellDataObj[startCellId],
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
        let minL = this.state.gridXYWH.x - this.state.gridXYWH.x + 2;
        let minT = this.state.gridXYWH.y - this.state.gridXYWH.y + 2;
        let maxR = (this.state.gridXYWH.x + this.state.gridXYWH.w - this.state.dragXYWH.w) - this.state.gridXYWH.x - 2;
        let maxB = (this.state.gridXYWH.y + this.state.gridXYWH.h - this.state.dragXYWH.h) - this.state.gridXYWH.y - 2 - 20;
        // console.log("dragY:", dragY);

        // == limit dragging to active grid rectangle
        if ((dragX > minL) && (dragX < maxR) && (dragY > minT) && (dragY < maxB)) {
            this.setState({
                dragging: true,
                dragXYWH: {
                    x: dragX,
                    y: dragY,
                    w: this.state.dragXYWH.w,
                    h: this.state.dragXYWH.h
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
        // console.log("\n == Dragger:detectCellHover ==");

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
                        targetCellId: targetCellId      // set new target cell id on dragger
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

    // ======= ======= ======= UPDATE DATA and COMPONENTS ======= ======= =======
    // ======= ======= ======= UPDATE DATA and COMPONENTS ======= ======= =======
    // ======= ======= ======= UPDATE DATA and COMPONENTS ======= ======= =======

    dropDragger(e) {
        console.log("\n == Dragger:dropDragger ==");

        // ======= dragger scope variable =======
        const dragger = this;

        // ======= conditional settings =======
        let targetEmpty, sameColumn, hiORlo;

        // ======= START and TARGET cell data =======
        const cellDataObj = this.state.cellDataObj;
        const startCellId = this.state.startCellId;
        const targetCellId = this.state.targetCellId;
        const startCellData = cellDataObj[startCellId];
        const targetCellData = cellDataObj[targetCellId];

        // ======= get start/target ROWS and COLUMNS (from cellId strings) =======
        const startRow = startCellId.split("_")[0];
        const startCol = startCellId.split("_")[1];
        const targetRow = targetCellId.split("_")[0];
        const targetCol = targetCellId.split("_")[1];

        // ======= pick up data from start cell =======
        this.tempStartData.cellType = startCellData.cellType;
        this.tempStartData.className = startCellData.className;
        this.tempStartData.sessionData = startCellData.sessionData;
        console.log("...cellType:", this.tempStartData.cellType);
        console.log("...className:", this.tempStartData.className);
        console.log("...sessionData:", this.tempStartData.sessionData);
        // startCellData.cellType = "emptyCell";
        // startCellData.className = "cell emptyCell";
        // startCellData.sessionData = null;

        // ======= determine entry point on target cell (above or below center) =======
        const dragY = e.pageY + dragger.state.relXY.y - dragger.state.gridXYWH.y;
        const cellCenterY = cellDataObj[targetCellId].y + (cellDataObj[targetCellId].h/2);
        dragY > cellCenterY
            ? hiORlo = "lo"         // lo entry point: push cells up
            : hiORlo = "hi";        // hi entry point: push cells down

        // ======= check if same or different column =======
        startCol === targetCol
            ? sameColumn = true
            : sameColumn = false;

        // ======= check if target cell is empty =======
        targetCellData.cellType === "emptyCell"
            ? swapCellData()
            : shiftCellData();

        // ======= target empty: swap start and target data =======
        function swapCellData() {
            console.log("\n == swapCellData ==");
            let moveCellType = dragger.tempStartData.cellType;
            let moveClassName = dragger.tempStartData.className;
            let moveSessionData = dragger.tempStartData.sessionData;
            startCellData.cellType = targetCellData.cellType;
            startCellData.className = targetCellData.className;
            startCellData.sessionData = targetCellData.sessionData;
            targetCellData.cellType = moveCellType;
            targetCellData.className = moveClassName;
            targetCellData.sessionData = moveSessionData;
            // console.log("cellDataObj:", cellDataObj);
            updateStartTargetComps(startCellData);
            updateStartTargetComps(targetCellData);
            updateDraggerComp();
        }

        // ======= update cell component (start or target) to revised data =======
        function updateStartTargetComps(cellData) {
            console.log("\n == updateStartTargetComps ==");

            // == set color for empty/occupied condition
            let title;
            let bgColor = cellData.cellType === "sessionCell"
                ? "white"
                : "#b1b9by";

            // == get session title if session cell
            if (cellData.sessionData) {
                title = cellData.sessionData.session_title;
            } else {
                title = null;
            }
            console.log("title:", title);

            // == set new component state
            cellData.cellComp.setState({
                highlighted: false,
                color: bgColor,
                className: cellData.className,
                sessionData: cellData.sessionData,
                text: title
            })
        }

        // ======= update dragger component to revised data =======
        function updateDraggerComp() {
            console.log("\n == updateDraggerComp ==");

            // == move dragger component to location/size of target cell
            let cellX = targetCellData.x;
            let cellY = targetCellData.y;
            let cellW = targetCellData.w;
            let cellH = targetCellData.h;
            dragger.setState({
                startCellId: targetCellId,
                startCellData: targetCellData,
                cellDataObj: cellDataObj,
                dragging: false,
                dragXYWH: {
                    x: cellX + 5,
                    y: cellY + 3,
                    w: cellW,
                    h: cellH
                },
                text: targetCellData.sessionData.session_title
            });
        }

        // ======= target occupied: shift cell data up or down =======
        function shiftCellData() {
            console.log("\n == shiftCellData ==");

            // ======= if empty row available get list of shifting cells =======
            let roomTimesArray;             // all cells (timeslots) in target room
            let shiftAddrsArray;            // cells with data to shift
            let aboveORbelowArray;          // cells to search for empty cell
            let nearestEmptyRow = null;     // starting point for cell data shift

            // // ======= clear startCell and save data to dragger =======
            // function loadStartData() {
            //     console.log("\n == loadStartData ==");
            //
            //     dragger.tempStartData.cellType = startCellData.cellType;
            //     dragger.tempStartData.className = startCellData.className;
            //     dragger.tempStartData.sessionData = startCellData.sessionData;
            //     startCellData.cellType = "emptyCell";
            //     startCellData.className = "cell emptyCell";
            //     startCellData.sessionData = null;
            //     console.log("cellDataObj[startCellId]:", cellDataObj[startCellId]);
            // }
            // loadStartData();

            // ======= get list of time cells in target room =======
            function getRoomTimes() {
                console.log("\n == getRoomTimes ==");

                let roomCount = dragger.state.rooms.length;
                let timeCount = dragger.state.times.length;
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

            // ======= get rows above and below target row =======
            function getAboveORbelow(hiORlo, roomTimesArray) {
                console.log("\n == getAboveORbelow ==");
                const aboveCenterRows = roomTimesArray.filter(row => row <= targetRow);
                const belowCenterRows = roomTimesArray.filter(row => row >= targetRow);
                const cellAddr = function(row, targetCol) {
                    return row + "_" + targetCol;
                };
                const cellData = function(cellAddr) {
                    return cellDataObj[cellAddr];
                };
                hiORlo === "lo"
                    ? aboveORbelowArray = aboveCenterRows.map(row => cellData(cellAddr(row, targetCol))).reverse()
                    : aboveORbelowArray = belowCenterRows.map(row => cellData(cellAddr(row, targetCol)));
                return aboveORbelowArray;
            }

            function getNearestEmptyRow() {
                console.log("\n == getNearestEmptyRow ==");

                // ======= filter for occupied (non-null) cells only =======
                const removeNullCells = function(cell) {
                    if (cell) {
                        return cell;
                    }
                };
                shiftAddrsArray = aboveORbelowArray.map((cell, c) => {
                    if (nearestEmptyRow === null) {
                        if (cell.cellType === "emptyCell") {
                            nearestEmptyRow = cell;
                            return cell.addr;
                        } else if (cell.cellType === "sessionCell") {
                            return cell.addr;
                        }
                    }
                }).filter(removeNullCells).reverse();
                return shiftAddrsArray;
            }
            roomTimesArray = getRoomTimes();
            aboveORbelowArray = getAboveORbelow(hiORlo, roomTimesArray);
            shiftAddrsArray = getNearestEmptyRow();

            console.log("hiORlo:", hiORlo);
            console.log("roomTimesArray:", roomTimesArray);
            console.log("aboveORbelowArray:", aboveORbelowArray);
            console.log("shiftAddrsArray:", shiftAddrsArray);
            console.log("nearestEmptyRow:", nearestEmptyRow);

            // == if no empty row check alternative direction
            if ((!nearestEmptyRow) && (hiORlo === "lo")) {
                console.log("+++++++++ SWITCH TO BELOW +++++++");
                hiORlo = "hi"
                shiftAddrsArray = getNearestEmptyRow(hiORlo, roomTimesArray);
            } else if ((!nearestEmptyRow) && (hiORlo === "hi")) {
                console.log("+++++++++ SWITCH TO ABOVE +++++++");
                hiORlo = "lo"
                shiftAddrsArray = getNearestEmptyRow(hiORlo, roomTimesArray);

            // == no empty row in elther direction (all room cells occupied)
            } else if (!nearestEmptyRow) {
                console.log("+++++++++ SAME COLUMN? +++++++");
                swapCellData();     // no empty cells in target room; swap start/target data
            }
            console.log("shiftAddrsArray2:", shiftAddrsArray);

            // console.log("sameColumn:", sameColumn);
            // console.log("roomTimesArray:", roomTimesArray);
            // console.log("aboveCenterRows:", aboveCenterRows);
            // console.log("belowCenterRows:", belowCenterRows);

            // ======= shift cell data up or down =======
            function moveShiftData() {
                console.log("\n == moveShiftData ==");

                // == map source data (1 cell above or below) to shifted cell
                shiftAddrsArray.map((addr, c) => {
                    if (c < (shiftAddrsArray.length - 1)) {
                        let sourceDataAddr = shiftAddrsArray[c+1];
                        let sourceData = cellDataObj[sourceDataAddr];
                        let shiftData = cellDataObj[addr];
                        shiftData.cellType = sourceData.cellType;
                        shiftData.className = sourceData.className;
                        shiftData.sessionData = sourceData.sessionData;
                        console.log("shiftAddrsArray:", addr, ":  ", shiftData.sessionData.session_title);
                    }
                });

                // == set final cell data to empty status (prepares for swapCellData() function)
                let shiftData = cellDataObj[shiftAddrsArray[shiftAddrsArray.length-1]];
                shiftData.cellType = "emptyCell";
                shiftData.className = "cell emptyCell";
                shiftData.sessionData = null;
                console.log("cellDataObj:", cellDataObj);
            }

            // ======= update shifted components to revised data =======
            function updateShiftComps() {
                console.log("== updateShiftComps ==");

                shiftAddrsArray.map((addr, c) => {
                    let text;
                    let cell = cellDataObj[addr];
                    if (cell.addr === startCellId) {
                        if (nearestEmptyRow) {
                            cell = nearestEmptyRow;
                        }
                    }
                    let cellComponent = cell.cellComp;
                    if (cell.sessionData) {
                        text = cell.sessionData.session_title;
                    } else {
                        text = null;
                    }
                    let bgColor = cell.cellType === "sessionCell"
                        ? "white"
                        : "#b1b9by";
                    cellComponent.setState({
                        highlighted: false,
                        color: bgColor,
                        className: cell.className,
                        sessionData: cell.sessionData,
                        text: text
                    })
                });
            }
            moveShiftData();        // move cell data up or up or down
            updateShiftComps();     // update components to match data
            swapCellData();         // swap start and target cell data
        }
    }

    // ======= ======= ======= RENDER ======= ======= =======
    // ======= ======= ======= RENDER ======= ======= =======
    // ======= ======= ======= RENDER ======= ======= =======

    render() {
        // console.log("\n == Dragger:render ==");
        let text;
        let startCellId = this.state.startCellId;
        let cellType = this.state.cellDataObj[startCellId].cellType;
        let dragXYWH = this.state.dragXYWH;
        let dragStyles = {
            position: 'absolute',
            display: 'block',
            left: dragXYWH.x + 'px',
            top: dragXYWH.y + 'px',
            width: dragXYWH.w + 'px',
            height: dragXYWH.h + 'px'
        }
        if (cellType === "sessionCell") {
            text = this.state.cellDataObj[startCellId].sessionData.session_title;
        } else {
            text = null;
        }

        return(
            <div
                id={"dragger1"}
                style={dragStyles}
                onMouseDown={(e) => this.onMouseDown(e)}>
                <p>{text}</p>
            </div>
        )
    }
}

export default Dragger;
