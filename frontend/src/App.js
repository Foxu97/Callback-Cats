import React from 'react';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import TopBar from './components/TopBar';
import Profile from './components/Profile';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <TopBar></TopBar>

        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/profile" exact component={Profile}></Route>
        </Switch>
      </BrowserRouter >
    </>
  );
}

export default App;
