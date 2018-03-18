import React from 'react';
import ReactDOM from 'react-dom';

// ======= ======= ======= DRAGGER ======= ======= =======
// ======= ======= ======= DRAGGER ======= ======= =======
// ======= ======= ======= DRAGGER ======= ======= =======

class Dragger extends React.Component {
    constructor(props) {
        // console.log("== Dragger:constructor ==");
        super(props);
        this.state = {
            id: props.id,
            text: props.text,
            timeslots: props.timeslots,
            roomnames: props.roomnames,
            scrollStart: 0,
            dragging: false,
            scrolling: false,
            cellDataObj: null,
            cellIdsArray: null,
            startCellId: props.startCellId,
            targetCellId: props.targetCellId,
            startCellData: props.startCellData,
            gridxy: props.gridxy,
            gridwh: props.gridwh,
            dragxy: props.dragxy,
            dragwh: props.dragwh,
            mousexy: { x:0, y:0 },
            relXY: { x:0, y:0 }
        };

        this.detectCellHover = this.detectCellHover.bind(this);
        this.locateDragger = this.locateDragger.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    componentWillMount() {
        // console.log("\n++++++ Dragger:_willMOUNT");
    }

    componentDidMount() {
        // console.log("+++ Dragger:_DidMount");
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    componentWillReceiveProps(nextProps) {
        // console.log("+++ Dragger:_WillReceiveProps");
        if ((nextProps.dragxy.x !== this.state.dragxy.x) || (nextProps.dragwh.w !== this.state.dragwh.w)) {
            this.setState({
                gridxy: nextProps.gridxy,
                dragxy: nextProps.dragxy,
                dragwh: nextProps.dragwh,
                cellDataObj: nextProps.cellDataObj,
                cellIdsArray: nextProps.cellIdsArray,
                text: nextProps.text
            });
        }
    }

    shouldComponentUpdate(props) {
        // console.log("+++ Dragger:_SHOULDupdate");
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        // console.log("+++ Dragger:_WillUpdate ==");
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("+++ Dragger:_DidUpdate ==");
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
        let targetCellData = this.state.cellDataObj[targetCellId];
        console.log("targetCellData/xy:", targetCellData.x, targetCellData.y);
        let dragX = targetCellData.x;   // + col * pxOffsetX
        let dragY = targetCellData.y;   // + row * pxOffsetY
        let title = this.state.cellDataObj[targetCellId].sessionData
            ? this.state.cellDataObj[targetCellId].sessionData.session_title
            : null

        this.setState({
            dragxy: {
                x: dragX + 6,
                y: dragY + 3
            },
            text: title,
            startCellId: targetCellId,
            targetCellId: targetCellId
        })
    }

    // ======= ======= ======= DRAG ======= ======= =======
    // ======= ======= ======= DRAG ======= ======= =======
    // ======= ======= ======= DRAG ======= ======= =======

    // ======= ======= ======= init drag ======= ======= =======
    onMouseDown(e) {
        console.log("\n\n== Dragger:onMouseDown ==");

        // == determine dragger location on DOM
        const dragger = ReactDOM.findDOMNode(this);
        let dragR = dragger.getBoundingClientRect();
        let tempStartData = this.state.cellDataObj[this.state.startCellId];
        let title = tempStartData.sessionData
            ? tempStartData.sessionData.session_title
            : null
        let scrollStart = $('#sessions').scrollTop();
        console.log("scrollStart:", scrollStart);

        // == load location and start cell data onto dragger
        this.setState({
            startCellData: tempStartData,
            scrollStart: scrollStart,
            dragging: true,
            relXY: {
                x: e.pageX - dragR.left,
                y: e.pageY - dragR.top
            },
            mousexy: {
                x: e.pageX,
                y: e.pageY
            },
            text: title
        })
        e.stopPropagation();
        e.preventDefault();
    }

    scrollGridWindow(scrollTop, direction, dragY) {
        console.log("== Dragger:scrollGridWindow ==");
        console.log("scrollTop:", scrollTop);

        let scrollInterval;
        let scrollEl = $('#sessions')[0];
        if (scrollTop === 0) {
            let scrollTop = $('#sessions').scrollTop();
        }
        let scrolling = true;
        let maxB = (this.state.gridwh.y + this.state.gridwh.h - this.state.dragwh.h) - this.state.gridxy.y - 2 - 20;
        console.log("maxB:", maxB);
        console.log("dragY:", dragY);
        console.log("direction:", direction);
        console.log("scrollTop:", scrollTop);

        if ((dragY > maxB) && (scrolling === true)) {
            this.setState({
                dragging: false,
                scrolling: true
            });
            scrollInterval = setInterval(function() {
                console.log("+++ SCROLL UP +++");
                scrollTop--;
                console.log("scrollTop:", scrollTop);
                $(scrollEl).scrollTop(scrollTop);
                console.log("$(scrollEl).scrollTop(scrollTop):", $(scrollEl).scrollTop(scrollTop));
            }, 500);
        } else {
            console.log("+++ SCROLL STOP +++");
            scrolling = false;
            window.clearInterval(scrollInterval)
        }
    }

    onMouseMove(e) {
        console.log("== Dragger:onMouseMove ==");
        if (!this.state.dragging) return

        // == move dragger with mouse (corrected for dragger and grid offsets)
        let dragX = e.pageX - this.state.relXY.x - this.state.gridxy.x;
        let dragY = e.pageY - this.state.relXY.y - this.state.gridxy.y;
        let minL = this.state.gridwh.x - this.state.gridxy.x + 2;
        let maxR = (this.state.gridwh.x + this.state.gridwh.w - this.state.dragwh.w) - this.state.gridxy.x - 2;
        let minT = this.state.gridwh.y - this.state.gridxy.y + 2;
        let maxB = (this.state.gridwh.y + this.state.gridwh.h - this.state.dragwh.h) - this.state.gridxy.y - 2 - 20;
        console.log("dragXY:", dragX, dragY);
        // console.log("maxB:", maxB);
        if ((dragX > minL) && (dragX < maxR) && (dragY > minT) && (dragY < maxB)) {
            this.setState({
                dragging: true,
                dragxy: {
                    x: dragX,
                    y: dragY
                },
                mousexy: {
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
    detectCellHover = (dragX, dragY) => {
        // console.log("\n== Dragger:detectCellHover ==");

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
        this.setState({
            dragging: false
        })
        this.dropDragger(e);
        e.stopPropagation();
        e.preventDefault();
    }

    dropDragger(e) {
        console.log("== Dragger:dropDragger ==");

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
            let roomCount = dragger.state.roomnames.length;
            let timeCount = dragger.state.timeslots.length;
            let rowArray = [];
            for (var r = 1; r <= dragger.state.roomnames.length; r++) {
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

        // ======= determine entry point on target cell (above or below center) =======
        const dragY = e.pageY - dragger.state.relXY.y - dragger.state.gridxy.y;
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
            dragger.setState({
                startCellId: targetCellId,
                cellDataObj: cellDataObj,
                dragging: false,
                dragxy: {
                    x: cellX + 6,
                    y: cellY + 3
                },
                text: targetCellData.sessionData.session_title
            });
        }

        // ======= shift data, update components =======
        updateShiftComponents();
        updateDraggerComponent();
        console.log("cellDataObj:", cellDataObj);
    }

    getSearchRows(targetRow, entry) {
        console.log("== Dragger:getSearchRows ==");
        let roomCount = this.state.roomnames.length;
        let timeCount = this.state.timeslots.length;
        let rowArray = [];
        for (var r = 1; r <= this.state.roomnames.length; r++) {
            let hiRow = (timeCount * (r - 1)) + r + 1;
            let loRow = (timeCount * r) + r;
            if ((hiRow <= parseInt(targetRow)) && (targetRow <= loRow)) {
                if (entry === "top") {
                    for (var i = parseInt(targetRow); i <= loRow; i++) {
                        rowArray.push(i);
                    }
                    return rowArray;
                } else {
                    for (var j = loRow; j >= parseInt(targetRow); j--) {
                        rowArray.push(j);
                    }
                    return rowArray;
                }
            }
        }
    }

    // ======= ======= ======= utilities ======= ======= =======
    getRowTimerange(targetRow, targetCol) {
        console.log("== Dragger:getRowTimerange ==");
        let roomCount = this.state.roomnames.length;
        let timeCount = this.state.timeslots.length;

        let rowArray = [];

        for (var r = 1; r <= this.state.roomnames.length; r++) {
            let hiRow = (timeCount * (r - 1)) + r + 1;
            let loRow = (timeCount * r) + r;
            if ((hiRow <= targetRow) && (targetRow <= loRow)) {
                let rowRange = [hiRow, loRow];
                return rowRange;
            }
        }
        return null;
    }

    // ======= ======= ======= RENDER ======= ======= =======
    // ======= ======= ======= RENDER ======= ======= =======
    // ======= ======= ======= RENDER ======= ======= =======

    render() {
        let mouseX = parseInt(this.state.mousexy.x);
        let gridX = parseInt(this.state.gridxy.x);
        let dragX = parseInt(this.state.dragxy.x);
        let dragY = parseInt(this.state.dragxy.y);
        let dragW = parseInt(this.state.dragwh.w);
        let dragH = parseInt(this.state.dragwh.h);
        let relX = parseInt(this.state.relXY.x);

        return(
            <div
                id={this.props.id}
                gridxy={this.state.gridxy}
                dragxy={this.props.dragxy}
                dragwh={this.state.dragwh}
                style={{
                        position: 'absolute',
                        left: dragX + 'px',
                        top: dragY + 'px',
                        width: dragW + 'px',
                        height: dragH + 'px'
                }}
                onMouseDown={(e) => this.onMouseDown(e)}>
                <p>{this.state.text}</p>
            </div>
        )
    }
}

export default Dragger;
