import React, {Component} from 'react';
import './App.css';
import Login from './Login';
import NavList from './NavList';
import MainView from './MainView';
import Sender from './sender';


class App extends Component {

  constructor() {
    super();
    this.state = {
      login: false,
      user:'test',
      module:'today'
    }
  }

  loginCommit(data){
    if (data.status===1){
       this.setState({
         login:true
       })
    } else {
      document.write(data);
    }
  }

  handleLogin(type, usn, pw) {
    var ins = {
        ins:type,
        usn:usn,
        password:pw
      }
    var sender = new Sender();
    sender.getData(ins,this.loginCommit.bind(this));
      this.setState({
        user:usn
      })
  }

  changeModule(module){
    this.setState({
      module:module
    })
  }

  render() {
    if (!this.state.login) 
      return <Login commit={this
        .handleLogin
        .bind(this)}/>
    return <div>
      <NavList userName={'Tester'} changeModule={this.changeModule.bind(this)}/>
      <MainView usn={this.state.user} module={this.state.module}/>
    </div>
  }
}

export default App;