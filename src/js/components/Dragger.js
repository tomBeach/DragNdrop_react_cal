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
            cellDataIndex: 0,

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
        // == holds start cell data (cell is converted to empty status)
        this.tempStartData = { cellType:null, className:null, sessionData:null };
        this.cellDataHistory = [];
        this.scrollInterval = null;

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
                x: targetCellData.x + 4,
                y: targetCellData.y + 2,
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

    // ======= ======= ======= SCROLL ======= ======= =======
    // ======= ======= ======= SCROLL ======= ======= =======
    // ======= ======= ======= SCROLL ======= ======= =======

    scrollGridWindow(scrollTop, direction, dragY) {
        console.log(" == Dragger: scrollGridWindow ==");

        let scrollEl = $('#sessions')[0];
        if (scrollTop === 0) {
            let scrollTop = $('#sessions').scrollTop();
        }
        let scrolling = true;
        // let maxB = (this.state.gridXYWH.y + this.state.gridXYWH.h - this.state.dragXYWH.h) - this.state.gridXYWH.y;
        let maxB = this.state.gridXYWH.y + this.state.gridXYWH.h + this.state.gridXYWH.y;
        console.log("dragY:", dragY);
        console.log("maxB:", maxB);
        // console.log("dragY:", dragY);
        // console.log("direction:", direction);
        console.log("scrollTop:", scrollTop);

        if ((dragY > maxB) && (scrolling === true)) {
            console.log("+++ SCROLL +++");
            this.setState({
                dragging: false,
                scrolling: true
            });
            // this.scrollInterval = setInterval(function() {
            //     console.log("+++ SCROLL UP +++");
            //     scrollTop--;
            //     console.log("scrollTop:", scrollTop);
            //     $(scrollEl).scrollTop(scrollTop);
            //     console.log("$(scrollEl).scrollTop(scrollTop):", $(scrollEl).scrollTop(scrollTop));
            // }, 500);
        } else {
            console.log("+++ SCROLL STOP +++");
            scrolling = false;
            window.clearInterval(this.scrollInterval)
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

    // ======= ======= ======= save all recent changes ======= ======= =======
    saveNewGrid() {
        console.log("\n == Dragger:saveNewGrid ==");
        this.cellDataHistory.push(this.state.cellDataObj);
        let currentIndex = this.cellDataHistory.length - 1;
        this.setState({
            cellDataIndex: currentIndex
        });
    }

    // ======= ======= ======= undo all recent changes ======= ======= =======
    undoGridUpdates() {
        console.log("\n == Dragger:undoGridUpdates ==");
        let currentIndex = this.state.cellDataIndex;
        if (currentIndex > 0) {
            let prevGrid = this.cellDataHistory[currentIndex - 1];
            this.setState({
                cellDataObj: prevGrid,
                cellDataIndex: currentIndex - 1,
            })
        }
    }

    // ======= ======= ======= redo all recent changes ======= ======= =======
    redoGridUpdates() {
        console.log("\n == Dragger:redoGridUpdates ==");
        let currentIndex = this.state.cellDataIndex;
        if (currentIndex < this.cellDataHistory.length - 1) {
            let nextGrid = this.cellDataHistory[currentIndex + 1];
            this.setState({
                cellDataObj: nextGrid,
                cellDataIndex: currentIndex + 1,
            })
        }
    }

    // ======= ======= ======= end drag ======= ======= =======
    onMouseUp(e) {
        console.log("\n == Dragger:onMouseUp ==");
        this.setState({
            dragging: false
        })
        window.clearInterval(this.scrollInterval)
        this.dropDragger(e);
        this.saveNewGrid();
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
        let sameColumn, hiORlo;

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

        // ======= ======= ======= kick off cell shifting ======= ======= =======
        // ======= ======= ======= kick off cell shifting ======= ======= =======
        // ======= ======= ======= kick off cell shifting ======= ======= =======

        updateStartData();

        // ======= check if target cell is empty =======
        targetCellData.cellType === "emptyCell"
            ? swapCellData()
            : shiftCellData();

        // ======= store start data on dragger; clear start cell =======
        function updateStartData() {
            console.log("\n == updateStartData ==");
            dragger.tempStartData.cellType = startCellData.cellType;
            dragger.tempStartData.className = startCellData.className;
            dragger.tempStartData.sessionData = startCellData.sessionData;
            startCellData.cellType = "emptyCell";
            startCellData.className = "cell emptyCell";
            startCellData.sessionData = null;
        }

        // ======= target empty: swap start and target data =======
        function updateTargetData() {
            console.log("\n == updateTargetData ==");
            targetCellData.cellType = dragger.tempStartData.cellType;
            targetCellData.className = dragger.tempStartData.className;
            targetCellData.sessionData = dragger.tempStartData.sessionData;
        }

        // ======= target empty: swap start and target data =======
        function swapCellData() {
            console.log("\n == swapCellData ==");
            startCellData.cellType = targetCellData.cellType;
            startCellData.className = targetCellData.className;
            startCellData.sessionData = targetCellData.sessionData;
            targetCellData.cellType = dragger.tempStartData.cellType;
            targetCellData.className = dragger.tempStartData.className;
            targetCellData.sessionData = dragger.tempStartData.sessionData;
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
                    x: cellX + 4,
                    y: cellY + 2,
                    w: cellW,
                    h: cellH
                },
                text: targetCellData.sessionData.session_title
            });
        }

        // ======= ======= ======= SHIFT CELLS ======= ======= ======= ======= ======= ======= SHIFT CELLS ======= ======= =======
        // ======= ======= ======= SHIFT CELLS ======= ======= ======= ======= ======= ======= SHIFT CELLS ======= ======= =======
        // ======= ======= ======= SHIFT CELLS ======= ======= ======= ======= ======= ======= SHIFT CELLS ======= ======= =======

        // ======= target occupied: shift cell data up or down =======
        function shiftCellData() {
            console.log("\n == shiftCellData ==");

            // ======= if empty row available get list of shifting cells =======
            let roomTimesArray;             // get all cells (timeslots) in target room
            let searchRowsArray;            // row numbers (to be combined with column number => address)
            let searchCellsArray;           // cells to search for empty cell (from cell addresses)

            let rowsAboveTarget;            // rows above target that may require data shifting
            let cellsAboveTarget;           // cells above target to search for empty cell
            let shiftAboveArray;            // cells above target for data shifting if required
            let nearestAboveEmpty = null;   // whether an empty cell exists above target

            let rowsBelowTarget;            // rows below target that may require data shifting
            let cellsBelowTarget;           // cells below target to search for empty cell
            let shiftBelowArray;            // cells below target for data shifting if required
            let nearestBelowEmpty = null;   // whether an empty cell exists below target

            let shiftAddrsArray;            // cells with data to shift

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

            // ======= get rows above or below target row =======
            function getSearchRowsArray(roomTimesArray, hiORlo) {
                console.log("\n == getSearchRowsArray ==");
                hiORlo === "lo"
                    ? searchRowsArray = roomTimesArray.filter(row => (row >= targetRow))
                    : searchRowsArray = roomTimesArray.filter(row => (row <= targetRow)).reverse();
                return searchRowsArray;
            }

            // ======= get cell data above or below target row =======
            function getSearchCellsArray(searchRowsArray, hiORlo) {
                console.log("\n == getSearchCellsArray ==");
                const cellData = function(cellAddr) {           // get cell data for row and target column
                    return cellDataObj[cellAddr];
                };
                const cellAddr = function(row, targetCol) {     // create row_col (addr) from row items and targetCol
                    return row + "_" + targetCol;
                };
                hiORlo === "lo"
                    ? searchCellsArray = searchRowsArray.map(row => cellData(cellAddr(row, targetCol)))
                    : searchCellsArray = searchRowsArray.map(row => cellData(cellAddr(row, targetCol)));
                return searchCellsArray;
            }

            // ======= get nearest empty row above or below target row =======
            function getNearestEmptyRow(checkCellsArray, hiORlo) {
                console.log("\n == getNearestEmptyRow ==");

                let nearestEmptyRow = null;

                // ======= filter for occupied (non-null) cells only =======
                const removeNullCells = function(cell) {
                    if (cell) {
                        return cell;
                    }
                };
                shiftAddrsArray = checkCellsArray.map((cell, c) => {
                    // console.log("cell:", cell);
                    if (nearestEmptyRow === null) {
                        if (cell.cellType === "emptyCell") {
                            nearestEmptyRow = cell;
                            return cell.addr;
                        } else if (cell.cellType === "sessionCell") {
                            return cell.addr;
                        }
                    }
                }).filter(removeNullCells).reverse();

                hiORlo === "lo"
                    ? nearestBelowEmpty = nearestEmptyRow
                    : nearestAboveEmpty = nearestEmptyRow;
                return shiftAddrsArray;
            }

            // ======= get nearest empty row above and below target row =======
            function shiftSelectedDirection(shiftCellsArray) {
                console.log("\n == shiftSelectedDirection ==");

                // == map source data (1 cell above or below) to shifted cell
                shiftCellsArray.map((addr, c) => {
                    if (c < (shiftCellsArray.length - 1)) {
                        let sourceDataAddr = shiftCellsArray[c+1];
                        let sourceData = cellDataObj[sourceDataAddr];
                        let shiftData = cellDataObj[addr];
                        shiftData.cellType = sourceData.cellType;
                        shiftData.className = sourceData.className;
                        shiftData.sessionData = sourceData.sessionData;
                        console.log("shiftCellsArray:", addr, ":  ", shiftData.sessionData.session_title);
                    }
                });
            }

            // ======= update shifted components to revised data =======
            function updateShiftComps(shiftAddrsArray, nearestEmptyRow) {
                console.log("== updateShiftComps ==");

                shiftAddrsArray.map((addr, c) => {
                    let text;
                    let cell = cellDataObj[addr];
                    if (cell.addr === startCellId) {
                        if (nearestEmptyRow) {
                            cell = nearestEmptyRow;
                        }
                    }
                    let bgColor = cell.cellType === "sessionCell"
                        ? "white"
                        : "#b1b9by";
                    cell.sessionData
                        ? text = cell.sessionData.session_title
                        : text = null;
                    cell.cellComp.setState({
                        highlighted: false,
                        color: bgColor,
                        className: cell.className,
                        sessionData: cell.sessionData,
                        text: text
                    })
                });
            }

            roomTimesArray = getRoomTimes();
            rowsAboveTarget = getSearchRowsArray(roomTimesArray, "hi");
            cellsAboveTarget = getSearchCellsArray(rowsAboveTarget, "hi");
            shiftAboveArray = getNearestEmptyRow(cellsAboveTarget, "hi");
            rowsBelowTarget = getSearchRowsArray(roomTimesArray, "lo");
            cellsBelowTarget = getSearchCellsArray(rowsBelowTarget, "lo");
            shiftBelowArray = getNearestEmptyRow(cellsBelowTarget, "lo");

            if (hiORlo === "lo") {
                if (nearestAboveEmpty != null) {
                    shiftSelectedDirection(shiftAboveArray);
                    updateTargetData();
                    updateShiftComps(shiftAboveArray, nearestAboveEmpty);
                } else if (nearestBelowEmpty != null) {
                    shiftSelectedDirection(shiftBelowArray);
                    updateTargetData();
                    updateShiftComps(shiftBelowArray, nearestBelowEmpty);
                } else {
                    swapCellData();     // no empty cells in target room; swap start/target data
                }
            } else {
                if (nearestBelowEmpty != null) {
                    shiftSelectedDirection(shiftBelowArray);
                    updateTargetData();
                    updateShiftComps(shiftBelowArray, nearestBelowEmpty);
                } else if (nearestAboveEmpty != null) {
                    shiftSelectedDirection(shiftAboveArray);
                    updateTargetData();
                    updateShiftComps(shiftAboveArray, nearestAboveEmpty);
                } else {
                    swapCellData();     // no empty cells in target room; swap start/target data
                }
            }
            updateStartTargetComps(startCellData);
            updateStartTargetComps(targetCellData);
            updateDraggerComp();

            console.log("\n ========================");
            console.log("targetRow:", targetRow);
            console.log("hiORlo:", hiORlo);
            console.log("roomTimesArray:", roomTimesArray);
            console.log("searchRowsArray:", searchRowsArray);
            console.log("searchCellsArray:", searchCellsArray);
            console.log("rowsAboveTarget:", rowsAboveTarget);
            console.log("rowsBelowTarget:", rowsBelowTarget);
            console.log("cellsAboveTarget:", cellsAboveTarget);
            console.log("cellsBelowTarget:", cellsBelowTarget);
            console.log("shiftAboveArray:", shiftAboveArray);
            console.log("shiftBelowArray:", shiftBelowArray);
            console.log("nearestAboveEmpty:", nearestAboveEmpty);
            console.log("nearestBelowEmpty:", nearestBelowEmpty);

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
