import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Task from './Task';
import './css.css';

class TaskList extends Component {
    render() {
        var taskList = this.props.data.map((value,index)=>{
            return <Task data={value} key={index} changeTask={this.props.changeTask}/>
        })
        return (
            <div className={"task-list"}>
                {taskList}
            </div>
        );
    }
}

TaskList.propTypes = {
    data:PropTypes.array.isRequired,
    mode:PropTypes.string.isRequired,
    changeTask:PropTypes.func.isRequired
};

export default TaskList;