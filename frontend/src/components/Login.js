import React, { Component } from 'react';
import axios from 'axios';
import SignIn from './SignIn';

export default class Login extends Component {
    state = {
        email: '',
        password: ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submitLogin = (e) => {
        e.preventDefault();
        axios.post('/user/signin', {
            email: this.state.email,
            password: this.state.password
        }).then(res => {
            localStorage.setItem('jwt-token', res.data.jwt);
            this.props.history.push('/');
        }).catch(err => {
            console.log(err.response.request.response)
        })
    }

    render() {
        return (
            <SignIn handleChange={this.handleChange} submitLogin={this.submitLogin} state={this.state}></SignIn>
        )
    }
}