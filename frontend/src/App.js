import React from 'react';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
//import Test from './components/Test';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home}></Route>
        <Route path="/login" exact component={Login}></Route>

      </Switch>
    </BrowserRouter>
  );
}

export default App;
