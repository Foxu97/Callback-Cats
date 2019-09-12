import axios from 'axios';
import Container from '@material-ui/core/Container';
import React, { Component } from 'react';
import Post from './Post/Post';

export default class Home extends Component {
    state = {
        items: []
    }


    renderPosts(posts) {
        for (let post of posts) {
            this.setState({ items: [...this.state.items, <Post title={post.title} description={post.description} name={post.createdBy.username}></Post>] })
        }
    }

    componentDidMount() {
        const jwt = localStorage.getItem('jwt-token')
        axios.get('/post/list', { headers: { Authorization: `JWT ${jwt}` } }).then(res => {
            this.renderPosts(res.data.posts);
        })
    }

    render() {
        return (
            <div>
                {this.state.items}
            </div>
        );
    }
}