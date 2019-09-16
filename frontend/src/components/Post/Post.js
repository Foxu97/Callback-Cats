import React, { Component } from "react";
import "./Post.css";

class Post extends Component {
    render() {
        return <article className="Post" ref="Post">
            <header>
                <div className="Post-user">
                    <div className="Post-user-avatar">
                        <img src={"users/" + this.props.avatar} width="50px" alt="user avatar"></img>
                    </div>
                    <div className="Post-user-nickname">
                        <span>{this.props.name}</span>
                    </div>
                </div>
            </header>
            <div className="Post-title">
                {this.props.title}
            </div>
            <div className="Post-photo">
                <img src={"posts/" + this.props.photo} alt="post"></img>
            </div>
            <div className="Post-content">
                {this.props.description}
            </div>
        </article>;
    }
}
export default Post;