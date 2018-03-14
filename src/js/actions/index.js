// ======= src/js/actions/index.js =======
import { ADD_DATES } from "../constants/action-types";
import { ADD_TIMES } from "../constants/action-types";
import { ADD_ROOMS } from "../constants/action-types";

export const addDates = (dates) => {
    console.log("== actions: addDates ==");
    return {
        type: "ADD_DATES",
        payload: dates
    }
}
export const addTimes = (times) => {
    console.log("== actions: addTimes ==");
    return {
        type: "ADD_TIMES",
        payload: times
    }
}
export const addRooms = (rooms) => {
    console.log("== actions: addRooms ==");
    return {
        type: "ADD_ROOMS",
        payload: rooms
    }
}







// import { ADD_ARTICLE } from "../constants/action-types";
// import { ADD_DATES } from "../constants/action-types";
//
// export const addDates = dates => {
//     console.log("== actions:addDates ==");
//     console.log("  dates:", dates);
//     let datesObj = {
//         type: ADD_DATES,
//         payload: dates
//     };
//     return datesObj;
// };
//
// export const addArticle = article => {
//     console.log("== actions:addArticle ==");
//     console.log("  article:", article);
//     let articleObj = {
//         type: ADD_ARTICLE,
//         payload: article
//     };
//     return articleObj;
// };


// function articleAction() {
//     console.log("== articleAction ==");
//     let articleObj = {
//         type: ADD_ARTICLE,
//         payload: article
//     }
//     console.log("articleObj:", articleObj);
//     return articleObj;
// }
// let article = articleAction();
// console.log("article:", article);
//
// export article;
