import React, { Component } from 'react';
import { Link, Route, BrowserRouter, Switch } from 'react-router-dom';
import { Button } from 'antd';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NewInvPage from './components/NewInvPage';
import './App.css';



class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/newinv" component={NewInvPage} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
