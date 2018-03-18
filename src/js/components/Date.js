import React from 'react';
import ReactDOM from 'react-dom'

// ======= Date =======
class Date extends React.Component {
    constructor(props) {
        console.log("\n== Date:constructor ==");
        super(props);
        console.log("props:", props);
        this.state = {
            text: props.text
        }
    }

    componentWillMount() {
        console.log("\n== Date:componentWillMount ==");
        let text = this.props.text.substring(5, 10);
        console.log("text:", text);
        this.setState({
            text: text

        })
    }

    render() {
        console.log("\n== Date:render ==");
        return (
            <div
                id={this.props.id}
                className={"dateCell"}>
                <p>{this.state.text}</p>
            </div>
        );
    }
}

export default Date;
