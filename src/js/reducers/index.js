// ======= src/js/reducers/index.js =======
import { ADD_DATES } from "../constants/action-types";
import { ADD_TIMES } from "../constants/action-types";
import { ADD_ROOMS } from "../constants/action-types";
import { ADD_GRID_CELLS } from "../constants/action-types";

const initialState = {
    dates: [],
    times: [],
    rooms: [],
    gridCells: []
};

const dataReducer = (state = initialState, action) => {
    console.log("\n== dataReducer ==");
    console.log("state:", state);
    console.log("action:", action);

    switch (action.type) {
        case ADD_DATES:
        console.log("-- ADD_DATES --");
        return { ...state, dates: [...state.dates, action.payload] };

        case ADD_TIMES:
        console.log("-- ADD_TIMES --");
        return { ...state, times: [...state.times, action.payload] };

        case ADD_ROOMS:
        console.log("-- ADD_ROOMS --");
        return { ...state, rooms: [...state.rooms, action.payload] };

        case ADD_GRID_CELLS:
        console.log("-- ADD_GRID_CELLS --");
        return { ...state, gridCells: [...state.gridCells, action.payload] };

        default:
        return state;
    }
}
export default dataReducer;

// const rootReducer = (state = initialState, action) => {
//     console.log("== rootReducer ==");
//     switch (action.type) {
//         case ADD_DATES:
//         console.log("-- ADD_DATES --");
//         console.log("  rootReducer:state:", state);
//         console.log("  rootReducer:state.dates:", state.dates);
//         console.log("  rootReducer:action.payload:", action.payload);
//         return { state, dates: [state.dates, action.payload] };
//
//         case ADD_ARTICLE:
//         console.log("-- ADD_ARTICLE --");
//         console.log("  rootReducer:state.articles:", state.articles);
//         console.log("  rootReducer:action.payload:", action.payload);
//         return { ...state, articles: [...state.articles, action.payload] };
//
//     default:
//         return state;
//     }
// };
//
// export default rootReducer;
