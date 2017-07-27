import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import AddModal from './AddModal';

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
        var stateList = ['doing', 'wait', 'emergent', 'todo', 'finish'];
        var newState = stateList[e];
        this
            .props
            .changeTask(newState);
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
        return (
            <div onClick={this.show.bind(this)}>
                <Grid>
                    <Row>
                        <Col sm={9} xs={9} md={9}>
                            <a className="h3">{data.title}
                            </a>
                        </Col>
                        <Col sm={3} xs={3} md={3}>
                            <DropdownButton
                                bsStyle={data.state}
                                title={data.stateTitle}
                                onSelect={this.changeStatus.bind(this)}
                                id={data.id}>
                                <MenuItem eventKey={0}>进行中</MenuItem>
                                <MenuItem eventKey={1}>等待</MenuItem>
                                <MenuItem eventKey={2}>紧急</MenuItem>
                                <MenuItem eventKey={3}>将做</MenuItem>
                                <MenuItem eventKey={4}>完成</MenuItem>
                            </DropdownButton>
                        </Col>
                    </Row>
                </Grid>
                <AddModal show={this.state.show} close={this.close.bind(this)}/>
            </div>
        );
    }
}

Task.propTypes = {
    data: PropTypes.object.isRequired,
    changeTask: PropTypes.func.isRequired
};

export default Task;