// ======= src/js/store/index.js =======
import { createStore } from "redux";
import initDataReducer from "../reducers/index";
import { composeWithDevTools } from "redux-devtools-extension";

// const store = createStore(initDataReducer);
const store = createStore(initDataReducer, composeWithDevTools());

export default store;
