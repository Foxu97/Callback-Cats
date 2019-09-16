import React, { Component } from 'react';
import axios from 'axios';
import "./Friend/Friend.css";
import Friend from './Friend/Friend'

export default class Profile extends Component {
    state = {
        items: []
    }

    renderFriends(friends) {
        for (let friend of friends) {
            this.setState({ items: [...this.state.items, <Friend avatar={friend.avatar} name={friend.username}></Friend>] })
        }
    }

    componentDidMount() {
        const jwt = localStorage.getItem('jwt-token')
        axios.get('/friends/friendsList', { headers: { Authorization: `JWT ${jwt}` } }).then(res => {
            this.renderFriends(res.data);
        })
    }

    render() {
        return (
            <>

                <div class="Friends-container"><span class="test">My friends</span>{this.state.items}</div>
            </>
        )
    }
}