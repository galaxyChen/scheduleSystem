import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import Task from './Task';

class App extends Component {
  constructor(){
    super();
    this.state={
      status:'doing'
    }
  }

  selectTime(t) {
    console.log(t.getDate());
  }

  handleChange(state){
    this.setState({
      status:state
    })
  }

  render() {
    var data={
      status:this.state.status,
      title:'测试',
      id:1
    }
    return (
      <div>
        <Task data={data} changeTask={this.handleChange.bind(this)}/>
      </div>
    );
  }
}

App.propTypes = {};

export default App;