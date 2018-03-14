import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from "react-redux";
import { addDates } from "../actions/index";

// ======= Store =======
const mapStateToProps = function(state){
    return {
        dates: state.dates
    }
}

const mapDispatchToProps = function (dispatch) {
    return {
        addDates: dates => dispatch(addDates(dates))
    };
}

// ======= Component =======
class Grid extends React.Component {

    componentDidMount() {
        console.log("== Grid:componentDidMount ==");
        console.log("this.props:", this.props);
        const { store } = this.props;
    }

    render() {
        console.log("== Grid:render ==");
        console.log("this.props:", this.props);
        const props = this.props;
        const { store } = props;
        return (
            <div>
                <p>grid</p>
            </div>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Grid)
