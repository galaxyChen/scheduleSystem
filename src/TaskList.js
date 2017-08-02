import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Task from './Task';
import './css.css';
import Panel from 'react-bootstrap/lib/Panel';

class TaskPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }

    showPanel() {
        this.setState({show: !this.state.show})
    }

    render() {
        var taskList = this.props.data.map((value, index) => {
                return <Task data={value} key={index} changeTask={this.props.changeTask}/>
            })
        var header = <h3 onClick={this.showPanel.bind(this)}>{this.props.title}</h3>
        return (
            <Panel collapsible expanded={this.state.show} header={header} bsStyle={this.props.titleStyle}>
                {taskList}
            </Panel>
        )
    }
}

TaskPanel.propTypes = {
    changeTask: PropTypes.func.isRequired,
    title:PropTypes.string.isRequired,
    titleStyle:PropTypes.string.isRequired,
    data:PropTypes.array.isRequired
}

class TaskList extends Component {
    render() {
        var TaskPanelList=[];
        var title,style;
        var index=0;
        for (var name in this.props.data){
            switch (name){
                case "outOfDate":title="已过期";
                                 style="danger";
                                 break;
                case "now":title="今日待办";
                           style="primary";
                           break;
                case "tomorrow":title="明日待办";
                                style="primary";
                                break;
                case "longterm":title="长任务";
                                style="info";
                                break;
                case "once":title="一次性";
                            style="primary";
                            break;
                case "todo":title="待办";
                            style="info";
                            break;
                case "wait":title="等待";
                            style="warning";
                            break;
                case "emergent":title="紧急长任务";
                                style="danger";
                                break;
                default:
            }
            console.log(name);
            if (this.props.data[name].length>0)
                TaskPanelList.push(<TaskPanel key={index} title={title} titleStyle={style} changeTask={this.props.changeTask} data={this.props.data[name]} />);
            index++;
        }


        return (
            <div className={"task-list"}>
                {TaskPanelList}
            </div>
        );
    }
}

TaskList.propTypes = {
    data: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    changeTask: PropTypes.func.isRequired
};

export default TaskList;