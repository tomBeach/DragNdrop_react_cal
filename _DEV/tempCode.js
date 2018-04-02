// ======= get rows above and below target row =======
function getShiftCells(hiORlo, roomTimesArray) {

    const cellAddr = function(row, targetCol) {
        return row + "_" + targetCol;
    };
    const cellData = function(cellAddr) {
        return cellDataObj[cellAddr];
    };
    const searchRoomCells = roomTimesArray.filter(row => row <= targetRow);
    if (hiORlo === "hi") {
        return searchRoomCells.map(row => cellData(cellAddr(row, targetCol))).reverse()
    } else {
        return searchRoomCells.map(row => cellData(cellAddr(row, targetCol)));
    }
}

function getNearestEmptyRow(shiftCellsArray, nearestEmptyRow) {

    // ======= filter for occupied (non-null) cells only =======
    const removeNullCells = function(cell) {
        if (cell) {
            return cell;
        }
    };
    shiftAddrsArray = shiftCellsArray.map((cell, c) => {
        if (nearestEmptyRow === null) {
            if (cell.cellType === "emptyCell") {
                nearestEmptyRow = cell;
                return cell.addr;
            } else if (cell.cellType === "sessionCell") {
                return cell.addr;
            }
        }
    }).filter(removeNullCells).reverse();
    return [shiftAddrsArray, nearestEmptyRow];
}

let aboveCenterCells = getShiftCells("hi", roomTimesArray);
let belowCenterCells = getShiftCells("lo", roomTimesArray);
let initShiftUp = getNearestEmptyRow(aboveCenterCells, nearestEmptyAbove);
let initShiftDown = getNearestEmptyRow(belowCenterCells, nearestEmptyBelow);








// ======= target occupied: shift cell data up or down =======
function shiftCellData() {

    // ======= if empty row available get list of shifting cells =======
    let roomTimesArray;             // all cells (timeslots) in target room
    let shiftAddrsArray;            // cells with data to shift
    let aboveORbelowArray;          // cells to search for empty cell
    let nearestEmptyRow = null;     // starting point for cell data shift

    // ======= get list of time cells in target room =======
    function getRoomTimes() {

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

    // ======= shift cell data up or down =======
    function moveShiftData() {

        // == map source data (1 cell above or below) to shifted cell
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

        // == set final cell data to empty status (prepares for swapCellData() function)
        let shiftData = cellDataObj[shiftAddrsArray[shiftAddrsArray.length-1]];
        shiftData.cellType = "emptyCell";
        shiftData.className = "cell emptyCell";
        shiftData.sessionData = null;
    }

    // ======= update shifted components to revised data =======
    function updateShiftComps() {

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
