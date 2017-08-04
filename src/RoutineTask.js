import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import AddRoutine from './AddRoutine';
import './css.css';

class RoutineTask extends Component {
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


    commitEdit(data){
        this.props.changeTask(this.props.data.task_id,data);
        this.close();
    }

    renderTime(time){
        if (time===undefined)
            return "";
        var date = new Date(time-0);

        return date.getMonth()+1+"-"+date.getDate();
    }

    changeStatus(e) {
        var event = window.event || arguments.callee.caller.arguments[0];
        var stateList = ['doing', 'todo', 'finish'];
        var newState = stateList[e];
        var data = {
            status:newState
        }
        this
            .props
            .changeTask(this.props.data.routine_id,data);
        event.stopPropagation();
    }

    render() {
        var data = JSON.parse(JSON.stringify(this.props.data));
        var stateList = {
            doing: 'primary',
            finish: 'success',
            todo: 'info',
        }
        var stateTitle = {
            doing: '进行中',
            finish: '已完成',
            todo: '将做',
        }
        data.state = stateList[data.status];
        data.stateTitle = stateTitle[data.status];
        return (
            <div className="task">
                <Grid fluid>
                    <Row>
                        <Col sm={6} xs={8} md={6} onClick={this.show.bind(this)}>
                            <a className="h4 task-title" >{data.title}
                            </a>
                        </Col>
                        <Col sm={2} md={2} xsHidden>
                             <a className="h4 task-title" >{this.renderTime(data.end)}
                            </a>
                        </Col>
                        <Col sm={2} md={2} xsHidden>
                             <a className="h4 task-title" >{"每"+data.every+"天"}
                            </a>
                        </Col>
                        <Col sm={2} xs={4} md={2}>
                            <DropdownButton
                                bsStyle={data.state}
                                title={data.stateTitle}
                                onSelect={this.changeStatus.bind(this)}
                                id={data.routine_id||1}
                                >
                                <MenuItem eventKey={0}>进行中</MenuItem>
                                <MenuItem eventKey={1}>将做</MenuItem>
                                <MenuItem eventKey={2}>完成</MenuItem>
                            </DropdownButton>
                        </Col>
                    </Row>
                </Grid>
                <AddRoutine show={this.state.show} close={this.close.bind(this)} commitAdd={this.commitEdit.bind(this)} data={this.props.data} isAdd={false}/>
            </div>
        );
    }
}

RoutineTask.propTypes = {
    data: PropTypes.object.isRequired,
    changeTask: PropTypes.func.isRequired,
};

export default RoutineTask;