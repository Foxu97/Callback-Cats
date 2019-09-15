import React from 'react';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import TopBar from './components/TopBar';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <TopBar></TopBar>

        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/login" exact component={Login}></Route>
        </Switch>
      </BrowserRouter >
    </>
  );
}

export default App;
