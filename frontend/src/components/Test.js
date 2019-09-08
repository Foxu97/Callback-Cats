import React, { Component } from 'react';
//import axios from 'axios';

export default class Test extends Component {
    state = {
        user: undefined
    }

    componentDidMount() {
        const jwt = localStorage.getItem('jwt-token');
        if (!jwt) {

        }
    }

    render() {
        if (!this.state.user) {
            return (
                <div>Loading...</div>
            )
        }
        return (
            <div>asd</div>
        )
    }
}