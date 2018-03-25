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

    // ======= ======= ======= UPDATE ======= ======= =======
    // ======= ======= ======= UPDATE ======= ======= =======
    // ======= ======= ======= UPDATE ======= ======= =======

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

        // ======= get target row and column from targetCellId string =======
        const startRow = startCellId.split("_")[0];
        const startCol = startCellId.split("_")[1];
        const targetRow = targetCellId.split("_")[0];
        const targetCol = targetCellId.split("_")[1];

        // ======= check if same or different column
        startCol === targetCol
            ? sameColumn = true
            : sameColumn = false;

        // ======= check if target cell is empty
        targetCellData.cellType === "emptyCell"
            ? swapCellData()
            : shiftCellData();

        // ======= swapCellData =======
        function swapCellData() {
            console.log("\n == Dragger:swapCellData ==");
            let moveCellType = startCellData.cellType;
            let moveClassName = startCellData.className;
            let moveSessionData = startCellData.sessionData;
            startCellData.cellType = targetCellData.cellType;
            startCellData.className = targetCellData.className;
            startCellData.sessionData = targetCellData.sessionData;
            targetCellData.cellType = moveCellType;
            targetCellData.className = moveClassName;
            targetCellData.sessionData = moveSessionData;
            console.log("cellDataObj:", cellDataObj);
            updateStartTargetComps(startCellData);
            updateStartTargetComps(targetCellData);
            updateDraggerComp();
        }

        // ======= update component to revised data =======
        function updateStartTargetComps(cellData) {
            console.log("\n == updateStartTargetComps ==");
            console.log("cellData.addr:", cellData.addr);

            let title;
            let tempSessionData = cellData.sessionData;
            let cellComponent = cellData.cellComp;
            let bgColor = cellData.cellType === "sessionCell"
                ? "white"
                : "#b1b9by";
            console.log("cellData.cellType:", cellData.cellType);
            console.log("bgColor:", bgColor);
            if (cellData.sessionData) {
                title = cellData.sessionData.session_title;
            } else {
                title = null;
            }
            console.log("title:", title);
            console.log("cellData.className:", cellData.className);
            cellComponent.setState({
                highlighted: false,
                color: bgColor,
                className: cellData.className,
                sessionData: cellData.sessionData,
                text: title
            })
        }

        // ======= update dragger component data =======
        function updateDraggerComp() {
            console.log("\n == updateDraggerComp ==");
            console.log("targetCellData:", targetCellData);
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

        // ======= shiftCellData =======
        function shiftCellData() {
            console.log("\n == Dragger:shiftCellData ==");
            console.log("dragger:", dragger);

            // ======= get list of time cells in target room =======
            function getRoomTimes() {
                console.log("\n == Dragger:getRoomTimes ==");

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
            const roomTimesArray = getRoomTimes();

            // ======= get rows above and below target row =======
            let aboveCenterRows = roomTimesArray.filter(row => row <= targetRow);
            let belowCenterRows = roomTimesArray.filter(row => row >= targetRow);

            // ======= determine entry point on target cell (above or below center) =======
            let sessionCellsArray;
            const dragY = e.pageY + dragger.state.relXY.y - dragger.state.gridXYWH.y;
            const cellCenterY = cellDataObj[targetCellId].y + (cellDataObj[targetCellId].h/2);
            const cellAddr = function(row, targetCol) {
                return row + "_" + targetCol;
            };
            const cellData = function(cellAddr) {
                return cellDataObj[cellAddr];
            };
            dragY > cellCenterY
                ? hiORlo = "lo"
                : hiORlo = "hi";
            dragY > cellCenterY
                ? sessionCellsArray = aboveCenterRows.map(row => cellData(cellAddr(row, targetCol))).reverse()
                : sessionCellsArray = belowCenterRows.map(row => cellData(cellAddr(row, targetCol)));

            // ======= include only cells required for data shift =======
            const removeNullCells = function(cell) {
                if (cell) {
                    return cell;
                }
            };

            // ======= get nearest empty row =======
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

            // console.log("hiORlo:", hiORlo);
            // console.log("sameColumn:", sameColumn);
            // console.log("roomTimesArray:", roomTimesArray);
            // console.log("aboveCenterRows:", aboveCenterRows);
            // console.log("belowCenterRows:", belowCenterRows);
            // console.log("sessionCellsArray:", sessionCellsArray);
            console.log("shiftAddrsArray:", shiftAddrsArray);
            console.log("nearestEmptyRow:", nearestEmptyRow);

            // ======= shift cell data up or down =======
            function updateShiftData() {
                console.log("\n == updateShiftData ==");

                // == map source data to shifted cell
                shiftAddrsArray.map((addr, c) => {
                    console.log("addr:", c, addr);
                    if (c < (shiftAddrsArray.length - 1)) {
                        let sourceDataAddr = shiftAddrsArray[c+1];
                        let sourceData = cellDataObj[sourceDataAddr];
                        let shiftData = cellDataObj[addr];
                        shiftData.cellType = sourceData.cellType;
                        shiftData.className = sourceData.className;
                        shiftData.sessionData = sourceData.sessionData;
                    }
                });
                let shiftData = cellDataObj[shiftAddrsArray[shiftAddrsArray.length-1]];
                shiftData.cellType = "emptyCell";
                shiftData.className = "cell emptyCell";
                shiftData.sessionData = null;
                console.log("shiftData:", shiftData);
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
            updateShiftData();
            updateShiftComps();
            swapCellData();
        }



        // // ======= swap start and target cell data =======
        // function swapStartTarget() {
        //     console.log("\n\n== swapStartTarget ==");
        //     let tempCellType = targetCellData.cellType;
        //     let tempClassName = targetCellData.className;
        //     let tempSessionData = targetCellData.sessionData;
        //     targetCellData.cellType = startCellData.cellType;
        //     targetCellData.className = startCellData.className;
        //     targetCellData.sessionData = startCellData.sessionData;
        //     startCellData.cellType = tempCellType;
        //     startCellData.className = tempClassName;
        //     startCellData.sessionData = tempSessionData;
        //     console.log("cellDataObj:", cellDataObj);
        //     updateStartTargetComps(startCellData);
        //     updateStartTargetComps(targetCellData);
        //     updateDraggerComp();
        // };

        // // ======= update component to revised data =======
        // function updateStartTargetComps(cellData) {
        //     console.log("== updateStartTargetComps ==");
        //
        //     let title;
        //     let tempSessionData = cellData.sessionData;
        //     let cellComponent = cellData.cellComp;
        //     let bgColor = cellData.cellType === "sessionCell"
        //         ? "white"
        //         : "#b1b9by";
        //     if (cellData.session_title) {
        //         title = cellData.session_title;
        //     } else {
        //         title = null;
        //     }
        //     cellComponent.setState({
        //         highlighted: false,
        //         color: bgColor,
        //         className: cellData.className,
        //         sessionData: cellData.sessionData,
        //         text: title
        //     })
        // }

        // // ======= update dragger component data =======
        // function updateDraggerComp() {
        //     console.log("== updateDraggerComp ==");
        //     console.log("targetCellData:", targetCellData);
        //     let cellX = targetCellData.x;
        //     let cellY = targetCellData.y;
        //     let cellW = targetCellData.w;
        //     let cellH = targetCellData.h;
        //     dragger.setState({
        //         startCellId: targetCellId,
        //         startCellData: targetCellData,
        //         cellDataObj: cellDataObj,
        //         dragging: false,
        //         dragXYWH: {
        //             x: cellX + 6,
        //             y: cellY + 3,
        //             w: cellW,
        //             h: cellH
        //         },
        //         text: targetCellData.sessionData.session_title
        //     });
        // }

        // // ======= get list of time cells in target room =======
        // function getRoomTimes() {
        //     console.log("== Dragger:getRoomTimes ==");
        //     let roomCount = store.getState().rooms[0].length;
        //     let timeCount = store.getState().times[0].length;
        //
        //     let rowArray = [];
        //     for (var r = 1; r <= roomCount; r++) {
        //         let hiRow = (timeCount * (r - 1)) + r + 1;
        //         let loRow = (timeCount * r) + r;
        //         if ((hiRow <= parseInt(targetRow)) && (targetRow <= loRow)) {
        //             for (var i = hiRow; i <= loRow; i++) {
        //                 rowArray.push(i);
        //             }
        //             return rowArray;
        //         }
        //     }
        // }
        // const roomTimesArray = getRoomTimes();

        // // ======= get rows above and below target row =======
        // let aboveCenterRows = roomTimesArray.filter(row => row <= targetRow);
        // let belowCenterRows = roomTimesArray.filter(row => row >= targetRow);
        // console.log("aboveCenterRows:", aboveCenterRows);
        // console.log("belowCenterRows:", belowCenterRows);

        // // ======= determine entry point on target cell (above or below center) =======
        // const dragY = e.pageY - dragger.state.relXY.y - dragger.state.gridXYWH.y;
        // const cellCenterY = cellDataObj[targetCellId].y + (cellDataObj[targetCellId].h/2);
        // let sessionCellsArray;
        // const cellAddr = function(row, targetCol) {
        //     return row + "_" + targetCol;
        // };
        // const cellData = function(cellAddr) {
        //     return cellDataObj[cellAddr];
        // };
        // dragY > cellCenterY
        //     ? sessionCellsArray = aboveCenterRows.map(row => cellData(cellAddr(row, targetCol))).reverse()
        //     : sessionCellsArray = belowCenterRows.map(row => cellData(cellAddr(row, targetCol)));

        // // ======= include only cells required for data shift =======
        // const removeNullCells = function(cell) {
        //     if (cell) {
        //         return cell;
        //     }
        // };

        // // ======= get nearest empty row =======
        // let nearestEmptyRow = null;
        // const shiftAddrsArray = sessionCellsArray.map((cell, c) => {
        //     if (cell.addr === startCellData.addr) {
        //         console.log("+++ START CELL +++");
        //     }
        //     if (nearestEmptyRow === null) {
        //         if (cell.cellType === "emptyCell") {
        //             nearestEmptyRow = cell;
        //             return cell.addr;
        //         } else if (cell.cellType === "sessionCell") {
        //             return cell.addr;
        //         }
        //     }
        // }).filter(removeNullCells).reverse();
        // console.log("shiftAddrsArray:", shiftAddrsArray);
        // console.log("nearestEmptyRow:", nearestEmptyRow);

        // // ======= ======= ======= SWAP or SHIFT ======= ======= =======
        // // ======= ======= ======= SWAP or SHIFT ======= ======= =======
        // // ======= ======= ======= SWAP or SHIFT ======= ======= =======
        //
        // // ======= check for no empty cells
        // shiftAddrsArray.length === sessionCellsArray.length
        //     ? swapStartTarget()
        //     : shiftCellData();

        // // ======= shift cell data up or down =======
        // function shiftCellData() {
        //     console.log("\n\n== shiftCellData ==");
        //
        //     // == map source data to shifted cell
        //     shiftAddrsArray.map((addr, c) => {
        //         if (c < (shiftAddrsArray.length - 1)) {
        //             let sourceDataAddr = shiftAddrsArray[c+1];
        //             let sourceData = cellDataObj[sourceDataAddr];
        //             let shiftData = cellDataObj[addr];
        //             shiftData.cellType = sourceData.cellType;
        //             shiftData.className = sourceData.className;
        //             shiftData.sessionData = sourceData.sessionData;
        //         }
        //     });
        //     console.log("cellDataObj:", cellDataObj);
        //     swapStartTarget();
        //     updateStartTargetComps("start");
        //     updateStartTargetComps("target");
        // }

        // // ======= swap start and target cell data =======
        // function swapStartTarget() {
        //     console.log("\n\n== swapStartTarget ==");
        //     let tempCellType = targetCellData.cellType;
        //     let tempClassName = targetCellData.className;
        //     let tempSessionData = targetCellData.sessionData;
        //     targetCellData.cellType = startCellData.cellType;
        //     targetCellData.className = startCellData.className;
        //     targetCellData.sessionData = startCellData.sessionData;
        //     if (nearestEmptyRow) {
        //         startCellData.cellType = "emptyCell";
        //         startCellData.className = "cell emptyCell";
        //         startCellData.sessionData = null;
        //     } else {
        //         startCellData.cellType = tempCellType;
        //         startCellData.className = tempClassName;
        //         startCellData.sessionData = tempSessionData;
        //     }
        //     console.log("cellDataObj:", cellDataObj);
        //     // updateStartTargetComps("start");
        //     // updateStartTargetComps("target");
        // };
        //
        // // ======= update component to revised data =======
        // function updateStartTargetComps(startORtarget) {
        //     console.log("== updateStartTargetComps ==");
        //
        //     let tempSessionData, title, cellComponent, cellData, bgColor;
        //     if (startORtarget === "start") {
        //         tempSessionData = startCellData.sessionData;
        //         cellComponent = startCellData.cellComp;
        //         cellData = startCellData;
        //         bgColor = startCellData.cellType === "sessionCell"
        //             ? "white"
        //             : "#b1b9by";
        //     } else if (startORtarget === "target"){
        //         tempSessionData = targetCellData.sessionData;
        //         cellComponent = targetCellData.cellComp;
        //         cellData = targetCellData;
        //         bgColor = targetCellData.cellType === "sessionCell"
        //             ? "white"
        //             : "#b1b9by";
        //     }
        //     if (nearestEmptyRow) {
        //         title = null;
        //     } else {
        //         title = tempSessionData.session_title;
        //     }
        //     // console.log("cellComponent:", cellComponent);
        //     // console.log("cellData:", cellData);
        //
        //     cellComponent.setState({
        //         highlighted: false,
        //         color: bgColor,
        //         className: cellData.className,
        //         sessionData: cellData.sessionData,
        //         text: title
        //     })
        // }

        // // ======= update shifted components to revised data =======
        // function updateShiftComps() {
        //     console.log("== updateShiftComps ==");
        //     shiftAddrsArray.map((addr, c) => {
        //         let cell = cellDataObj[addr];
        //         if (cell.addr === startCellId) {
        //             if (nearestEmptyRow) {
        //                 cell = nearestEmptyRow;
        //             }
        //         }
        //         let cellComponent = cell.cellComp;
        //         let bgColor = cell.cellType === "sessionCell"
        //             ? "white"
        //             : "#b1b9by";
        //
        //         cellComponent.setState({
        //             highlighted: false,
        //             color: bgColor,
        //             className: cell.className,
        //             sessionData: cell.sessionData,
        //             text: cell.sessionData.session_title
        //         })
        //     });
        // }

        // // ======= update dragger component data =======
        // function updateDraggerComp() {
        //     console.log("== updateDraggerComp ==");
        //     let cellX = targetCellData.x;
        //     let cellY = targetCellData.y;
        //     let cellW = targetCellData.w;
        //     let cellH = targetCellData.h;
        //     dragger.setState({
        //         startCellId: targetCellId,
        //         cellDataObj: cellDataObj,
        //         dragging: false,
        //         dragXYWH: {
        //             x: cellX + 6,
        //             y: cellY + 3,
        //             w: cellW,
        //             h: cellH
        //         },
        //         text: targetCellData.sessionData.session_title
        //     });
        // }
        //
        // // ======= shift data, update components =======
        // updateShiftComps();
        // updateDraggerComp();
        // console.log("cellDataObj:", cellDataObj);
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
