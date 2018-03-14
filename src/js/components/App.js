// ======= src/js/components/App.js =======
import React from "react";
import PropTypes from 'prop-types';
import Grid from "./Grid";

const App = () => (
    <div id="contentBox">
        <div id="yield" class="section" data-state="default">
            <div>
                <h2 className="dataTitle">Calendar</h2>
                <Grid />
            </div>
        </div>
    </div>
    );

export default App;
