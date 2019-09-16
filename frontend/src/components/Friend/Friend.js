import React, { Component } from 'react';
import "./Friend.css";

export default class Friend extends Component {

    render() {
        return <article className="Friend">
            <div className="Friend-avatar">
                <img src={"users/" + this.props.avatar} width="100px" height="110px" alt="user avatar"></img>
            </div>
            <div className="Friend-name">
                {this.props.name}
            </div>
        </article>;
    }
}