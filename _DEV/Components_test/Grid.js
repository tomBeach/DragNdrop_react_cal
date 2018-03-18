import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";

const mapStateToProps = state => {
    console.log("== Grid:mapStateToProps ==");
    console.log("  state:", state);
    return { dates: state.dates };
};

class ConnectedGrid extends Component {
    constructor(props) {
        // console.log("== ConnectedGrid:constructor ==");
        super(props);
        // console.log("  props:", props);
        this.state = {
            title: ""
        };
    }

    componentDidUpdate() {
        // console.log("== ConnectedGrid:componentDidUpdate ==");
        // console.log("  this.state:", this.state);
    }

    render() {
        console.log("== ConnectedGrid:render ==");
        // console.log("  this.state:", this.state);
        const { title } = this.state;
        return (
            <div className="form-group">
                <p>ftu</p>
            </div>
        );
    }
}

const Grid = connect(mapStateToProps)(ConnectedGrid);  // Redux connect()

export default Grid;


// // const mapStateToProps = state => {
// //     console.log("== Grid:mapStateToProps ==");
// //     console.log("  state:", state);
// //     return { dates: state.dates };
// // };
//
// // ======= Grid =======
// class Grid extends React.Component {
//     console.log("== Grid ==");
//     console.log("  dates:", dates);
//     constructor(props) {
//         console.log("\n== Grid:constructor ==");
//         super(props);
//         // this.state = {
//         //     dates: null
//         // }
//     }
//
//     // componentDidMount() {
//     //     console.log("== Grid:componentDidMount ==");
//     //     console.log("  this.state:", this.state);
//     //     console.log("  this.props:", this.props);
//     //     const { store } = this.props;
//     //     // this.context.redux.getState();
//     // }
//     //
//     // componentDidUpdate() {
//     //     console.log("== Grid:componentDidUpdate ==");
//     //     console.log("  this.state:", this.state);
//     // }
//
//     render () {
//         console.log("== Grid:render ==");
//         // console.log("  this.state:", this.state);
//         // console.log("  this.props:", this.props);
//         // const props = this.props;
//         // const { store } = props;
//         // const state = store.getState();
//         // <ul className="list-group list-group-flush">
//         //     {dates.map(function(date) {
//         //         console.log("  date:", date);
//         //         return (
//         //             <li className="list-group-item" key={date.id}>
//         //                 {date}
//         //             </li>
//         //         )})}
//         // </ul>
//         <div></div>
//
//     }
// }
//
// // const Grid = connect(mapStateToProps)(ConnectedGrid);
// export default Grid;
