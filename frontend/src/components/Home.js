import React, { Component } from 'react';
import axios from 'axios';

export default class Home extends Component {
    state = {
        user: undefined,
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
            birthdate: this.state.birthdate
        }).then(res => {
            console.log(res);
        })
    }

    render() {
        if (this.state.user === undefined) {
            return (
                <>
                    <h1>Witaj nieznajomy!</h1>
                    <div>Zarejestruj się już teraz i dziel się z innymi!</div>
                    <form onSubmit={this.handleSubmit}>
                        <p>Username <input type="text" name="username" onChange={this.handleChange} value={this.state.username}></input></p>
                        <p>E-mail <input type="text" name="email" onChange={this.handleChange} value={this.state.email}></input></p>
                        <p>Password <input type="password" name="password" onChange={this.handleChange} value={this.state.password}></input></p>
                        <p>Birthdate <input type="date" name="birthdate" onChange={this.handleChange} value={this.state.birthdate}></input></p>
                        <p><input type="radio" value="male" name="gender" onChange={this.handleChange}></input> Male <input type="radio" value="female" name="gender" onChange={this.handleChange}></input> Female</p>
                        <button type="submit">Register</button>
                    </form>
                    <div>Jeżeli masz już konto, <a href='/login'>zaloguj się</a></div>
                </>
            )
        }
        return (
            <div>Witaj {this.state.user}</div>
        )
    }
}