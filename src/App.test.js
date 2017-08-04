import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import RoutineTask from './RoutineTask';
import AddRoutine from './AddRoutine';

class App extends Component {
  constructor(){
    super();
    var date = new Date();
    date.setDate(date.getDate()-6);
    this.state={
      status:'doing',
      show:true,
      data:{
            title:"test",
            every:2,  
            status:"doing",
            routine_id:1,
            title:"test",
            description:"tester",
            begin:date.getTime()
        }
    }
  }

  selectTime(t) {
    console.log(t.getDate());
  }

  handleChange(id,data){
    console.log(data);
    var updateData = this.state.data;
    for (var name in data){
      updateData[name]=data[name];
    }
    this.setState({
      data:updateData
    })
  }

  close(){

  }

  render() {
    var data={
      status:this.state.status,
      title:'测试',
      id:1
    }
    return (
      <div>
        <RoutineTask  data={this.state.data} changeTask={this.handleChange.bind(this)}/>
      </div>
    );
  }
}

App.propTypes = {};

export default App;