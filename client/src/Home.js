import React, { Component } from "react";
import axios from 'axios';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { serverStatus: "" };
    }

    callAPI() {
        axios.get(`http://localhost:9000/users`, {})
            .then(res => {
                console.log(res.data);
                this.setState({ serverStatus: "API service is online" })
            }).catch(function (error) {
                this.setState({ serverStatus: "API service is not available" })
            });
    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        return (
            <div>
                <p>{this.state.serverStatus}</p>
            </div>
        );
    }
}

export default Home;