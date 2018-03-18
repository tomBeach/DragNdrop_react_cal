// ======= src/js/index.js =======
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import PropTypes from 'prop-types';
import store from "./store/index";
import App from "./components/App";

require('../../sass/styles.scss');

// ======= testing =======
// import { addDates } from "./actions/index";
// console.log("\n+++++++ +++++++1 store.getState():", store.getState());
// store.dispatch(addDates('1956-01-21'));
// store.dispatch(addDates('1967-05-06'));
// console.log("\n+++++++ +++++++2 store.getState():", store.getState());

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app")
);
