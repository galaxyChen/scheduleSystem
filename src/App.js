import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import NavList from './NavList';
import MainView from './MainView';


class App extends Component {

  constructor() {
    super();
    this.state = {
      login: true
    }
  }

  handleLogin(type, usn, pw) {
    this.setState({login: false})
  }

  render() {
    if (!this.state.login) 
      return <Login commit={this
        .handleLogin
        .bind(this)}/>
    return <div>
      <NavList userName={'Tester'}/>
      <MainView/>
    </div>
  }
}

export default App;