import React, { Component } from 'react';
import axios from 'axios';
import EmailVerification from './EmailVerification';
import SignUp from './SignUp';

export default class Home extends Component {
    state = {
        user: undefined,
        signUpSent: false,
        username: '',
        email: '',
        password: '',
        gender: '',
        birthdate: ''
    }

    componentDidMount() {
        const jwt = localStorage.getItem('jwt-token');
        if (jwt) {
            axios.get('/user/profile', { headers: { Authorization: `JWT ${jwt}` } }).then(res => {
                this.setState({ user: res.data.username });
            })
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/user/register', {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email,
            gender: this.state.gender,
            name: this.state.name,
            surname: this.state.surname,
            birthdate: this.state.birthdate
        }).then(res => {
            this.setState({ signUpSent: true });
        }).catch(err => {
            console.log(err.response.request.response)
        })
    }

    render() {
        if (this.state.signUpSent) {
            return (
                <EmailVerification></EmailVerification>
            )
        }
        else if (this.state.user === undefined) {
            return (
                <SignUp handleSubmit={this.handleSubmit} handleChange={this.handleChange} state={this.state}></SignUp>
            )
        }
        return (
            <div>Witaj {this.state.user}</div>
        )
    }
}