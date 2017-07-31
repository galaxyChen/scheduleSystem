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

    
    componentWillMount() {
        var sender = new Sender();
        var data = {
            ins:'query',
            option:'task',
            usn:this.props.usn
        }
        sender.getData(data,this.setData.bind(this));
    }

    setData(data){
        if (typeof data=='string'){
            document.write(data);
            return;
        }
        if (data.status==1){
            this.setState({
                data:data.data
            })
        } else {
            alert(data.error);
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

    checkUndo(data){
        //check if it needs to undo
        if (typeof data=='string'){
            document.write(data);
            return;
        }
        if (data.status!=1){
            //undo
            var data = this.state.data;
            for (var i=0;i<data.length;i++)
                if (data[i].task_id===this.state.oldData.task_id){
                    data[i]=this.state.oldData;
                    break;
                }
            this.setState({
                data:data
            })
        }
    }

    changeTask(id,newData){
        var ins = {
            ins:'update',
            id:id,
            data:newData
        }
        var data = this.state.data,
        oldData ;
        for (var i=0;i<data.length;i++){
            if (data[i].task_id===id){
                oldData = JSON.parse(JSON.stringify(data[i]));
                for (name in newData){
                    data[i][name]=newData[name];
                }
                break;
            }
        }
        var sender = new Sender();
        sender.getData(ins,this.checkUndo.bind(this));
        this.setState({
            data:data,
            oldData:oldData
        })
    }

    reflashData(data){
        if (typeof data=='string'){
            document.write(data);
            return;
        }
        if (data.status==1){
            var dataToAdd = JSON.parse(JSON.stringify(this.state.dataToAdd));
            dataToAdd.task_id = data.id;
            this.setState({
                data:this.state.data.concat(dataToAdd)
            })
        } else {
            alert(data.error);
        }
    }

    commitAdd(data){
        var ins = {
            ins:'add',
            usn:this.props.usn,
            data:data
        }
        var sender = new Sender();
        sender.getData(ins,this.reflashData.bind(this));
        this.setState({
            dataToAdd:data
        })
        this.close();
    }

    render() {
        return (
            <div>
                <Grid fluid>
                    <Row>
                        <Col xsHidden sm={3} md={3}><Fliter /></Col>
                        <Col sm={8} md={8}>
                            <Row>
                                <Col sm={3} md={3}><Button onClick={this.showAdd.bind(this)}><Glyphicon glyph="plus-sign" />添加日程</Button></Col>
                            </Row>
                            <Row>
                                <Col><TaskList data={this.state.data||[]} mode={'normal'} changeTask={this.changeTask.bind(this)}/></Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
                <AddModal show={this.state.show} close={this.close.bind(this)} commitAdd={this.commitAdd.bind(this)} data={{isAdd:true}}/>
            </div>
        );
    }
}

MainView.propTypes = {
    usn:PropTypes.string.isRequired
};

export default MainView;