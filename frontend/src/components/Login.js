import React, { Component } from 'react';
import axios from 'axios';

export default class Login extends Component {
    state = {
        email: '',
        password: ''
    }

    change = (e) => {
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
        }).catch(res => {
            console.log(res)
        })
    }

    render() {
        return (
            <form onSubmit={this.submitLogin}>
                <p><label>E-mail</label><input type="text" name="email" onChange={this.change} value={this.state.email}></input></p>
                <p><label>Password</label><input type="password" name="password" onChange={this.change} value={this.state.password}></input></p>
                <button type="submit">Submit</button>
            </form>
        )
    }
}