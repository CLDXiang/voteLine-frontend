import React, { Component } from 'react';
import { Link, Route, BrowserRouter, Switch } from 'react-router-dom';
import { Button } from 'antd';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NewInvPage from './components/NewInvPage';
import InvPage from './components/InvPage';
import SearchPage from './components/SearchPage';
import RedirectPage from './components/RedirectPage';
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
            <Route path="/inv/:iid" component={InvPage} />
            <Route path="/search/:pattern" component={SearchPage} />
            <Route path="/redirect" component={RedirectPage} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
