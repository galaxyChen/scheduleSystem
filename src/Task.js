import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import AddModal from './AddModal';
import './css.css';

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            state: 'info',
            show:false
        }
    }

    show(){
        this.setState({
            show:true
        })
    }

    close(){
        this.setState({
            show:false
        })
    }

    changeStatus(e) {
        var event = window.event || arguments.callee.caller.arguments[0];
        var stateList = ['doing', 'wait', 'emergent', 'todo', 'finish'];
        var newState = stateList[e];
        var data = {
            status:newState
        }
        this
            .props
            .changeTask(this.props.data.task_id,data,"task");
        event.stopPropagation();
    }

    commitEdit(data){
        console.log(data);
        this.props.changeTask(this.props.data.task_id,data,"task");
        this.close();
    }

    renderTime(time){
        if (time===undefined)
            return "无";
        var date = new Date(time-0);

        return date.getMonth()+1+"-"+date.getDate();
    }

    renderTitle(title){
        //add some length control if needed
        return title;
    }

    render() {
        var data = JSON.parse(JSON.stringify(this.props.data));
        var stateList = {
            doing: 'primary',
            finish: 'success',
            todo: 'info',
            wait: 'warning',
            emergent: 'danger'
        }
        var stateTitle = {
            doing: '进行中',
            finish: '已完成',
            todo: '将做',
            wait: '等待',
            emergent: '紧急'
        }
        data.state = stateList[data.status];
        data.stateTitle = stateTitle[data.status];
        var addModal = <AddModal show={this.state.show} close={this.close.bind(this)} commitAdd={this.commitEdit.bind(this)} data={this.props.data}/>;
        if (!this.state.show) addModal=null;
        return (
            <div className="task">
                <Grid fluid>
                    <Row>
                        <Col sm={6} xs={8} md={6} onClick={this.show.bind(this)}>
                            <a className="h4 task-title" >{this.renderTitle(data.title)}
                            </a>
                        </Col>
                        <Col sm={2} md={2} xsHidden>
                             <a className="h4 task-title" >{data.status==="todo"?"":"从:"+this.renderTime(data.begin)}
                            </a>
                        </Col>
                        <Col sm={2} md={2} xsHidden>
                             <a className="h4 task-title" >{data.status==="todo"?"":"到:"+this.renderTime(data.end)}
                             </a>
                        </Col>
                        <Col sm={2} xs={4} md={2}>
                            <DropdownButton
                                bsStyle={data.state}
                                title={data.stateTitle}
                                onSelect={this.changeStatus.bind(this)}
                                id={data.task_id||1}
                                >
                                <MenuItem eventKey={0}>进行中</MenuItem>
                                <MenuItem eventKey={1}>等待</MenuItem>
                                <MenuItem eventKey={2}>紧急</MenuItem>
                                <MenuItem eventKey={3}>将做</MenuItem>
                                <MenuItem eventKey={4}>完成</MenuItem>
                            </DropdownButton>
                        </Col>
                    </Row>
                </Grid>
                {addModal}
            </div>
        );
    }
}

Task.propTypes = {
    data: PropTypes.object.isRequired,
    changeTask: PropTypes.func.isRequired
};

export default Task;