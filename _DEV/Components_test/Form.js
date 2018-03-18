// ======= src/js/components/Form.js =======
import React, { Component } from "react";
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addArticle } from "../actions/index";

const mapDispatchToProps = dispatch => {
    console.log("== Form:mapDispatchToProps ==");
    return {
        addArticle: article => dispatch(addArticle(article))
    };
};

class ConnectedForm extends Component {
    constructor(props) {
        console.log("== ConnectedForm:constructor ==");
        super(props);
        console.log("  props:", props);
        this.state = {
            title: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate() {
        console.log("== ConnectedForm:componentDidUpdate ==");
        console.log("  this.state:", this.state);
    }

    handleChange(event) {
        // console.log("== ConnectedForm:handleChange ==");
        // console.log("event:", event);
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit(event) {
        console.log("== ConnectedForm:handleSubmit ==");
        event.preventDefault();
        const { title } = this.state;
        const id = uuidv1();
        console.log("  id:", id);
        console.log("  title:", title);
        console.log("  this.props:", this.props);
        this.props.addArticle({ title, id });   // Redux addArticle() action gets dispatched
        this.setState({
            title: ""                           // return local state to default
        });
    }

    render() {
        console.log("== ConnectedForm:render ==");
        console.log("  this.state:", this.state);
        const { title } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={this.handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-success btn-lg">
                    SAVE
                </button>
            </form>
        );
    }
}

const Form = connect(null, mapDispatchToProps)(ConnectedForm);  // Redux connect()

export default Form;

// Form is the result of connecting ConnectedForm with the Redux store.
// The first argument for connect must be null when mapStateToProps is absent
