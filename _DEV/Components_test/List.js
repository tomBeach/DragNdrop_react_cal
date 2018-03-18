// ======= src/js/components/List.js =======
import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

const mapStateToProps = state => {
    console.log("== List:mapStateToProps ==");
    console.log("  state:", state);
    return { articles: state.articles };
};

const ConnectedList = ({ articles }) => {
    console.log("== List:ConnectedList ==");
    console.log("  articles:", articles);
    return (
        <ul className="list-group list-group-flush">
            {articles.map(function(el) {
                console.log("  el.title:", el.title);
                return (
                    <li className="list-group-item" key={el.id}>
                        {el.title}
                    </li>
                )})
            }
        </ul>
    )
};

const List = connect(mapStateToProps)(ConnectedList);
export default List;

// • List receives the prop articles (a copy of the articlesarray)
// • The array lives inside the Redux state created earlier which comes from the reducer:
//     const rootReducer = (state = initialState, action) => {
//       switch (action.type) {
//         case ADD_ARTICLE:
//           return { ...state, articles: [...state.articles, action.payload] };
//           ...
// • The prop is used in JSX for generating a list of articles:
//     {articles.map(el => (
//       <li className="list-group-item" key={el.id}>
//           {el.title}
//       </li>
//     ))}
// • List is the result of connecting the stateless component ConnectedList with the Redux store.
// • A stateless component does not have its own local state. Data gets passed to it as props
