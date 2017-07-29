import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Fliter from './Fliter';
import TaskList from './TaskList';
import Button from 'react-bootstrap/lib/Button';
import AddModal from './AddModal';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import './css.css';
import Sender from './sender';

class MainView extends Component {
    constructor(props){
        super(props);
        this.state={
            show:false
        }
    }

    close(){
        this.setState({
            show:false
        })
    }

    showAdd(){
        this.setState({
            show:true
        })
    }

    commitAdd(data){
        var ins = {
            ins:'add',
            usn:this.props.usn,
            data:data
        }
        var sender = new Sender();
        sender.getData(ins);
        this.close();
    }

    render() {
        return (
            <div>
                <Grid fluid>
                    <Row>
                        <Col xsHidden sm={3} md={3}><Fliter /></Col>
                        <Col sm={5} md={5}>
                            <Row>
                                <Col sm={3} md={3}><Button onClick={this.showAdd.bind(this)}><Glyphicon glyph="plus-sign" />添加日程</Button></Col>
                            </Row>
                            <Row>
                                <Col><TaskList /></Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
                <AddModal show={this.state.show} close={this.close.bind(this)} commitAdd={this.commitAdd.bind(this)}/>
            </div>
        );
    }
}

MainView.propTypes = {
    usn:PropTypes.string.isRequired
};

export default MainView;