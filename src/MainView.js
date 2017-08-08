import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'react-bootstrap/lib/Grid';
import Col from 'react-bootstrap/lib/Col';
import Filter from './Filter';
import TaskList from './TaskList';
import Button from 'react-bootstrap/lib/Button';
import AddModal from './AddModal';
import AddRoutine from './AddRoutine';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import './css.css';
import Sender from './sender';
import FilterRules from './FilterRules';
import ProcessView from './ProcessView';

class MainView extends Component {
    constructor(props){
        super(props);
        this.state={
            show:false,
            mode:'begintime',
            oldData:[],
            routine:[]
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
         var data = {
            ins:'routine',
            usn:this.props.usn
        }
        sender.getData(data,this.setData.bind(this));
    }


    setData(data){
        if (typeof data==='string'){
            document.write(data);
            return;
        }
        if (data.status===1){
            if (data.data.length===0)
                return ;
            if (data.data[0].hasOwnProperty("task_id"))
                this.setState({
                    data:data.data
                })
            else this.setState({
                routine:data.data
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

    checkUndo(response){
        //check if it needs to undo
        if (typeof response==='string'){
            document.write(response);
            return;
        }
        var data;
        var oldData = this.state.oldData;
        if (response.status!==1){
            //undo
            data = this.state.data;
            var id = "task_id";
            if (response.type==="routine"){
                data = this.state.routine;
                id = "routine_id";
            }
                for (var i=0;i<data.length;i++)
                    for (var j=0;j<oldData.length;j++)
                        if ((data[i][id]===oldData[j][id])){
                            data[i]=oldData[j];
                            oldData.splice(j,1);
                            break;
                        }
                if (response.type==="task")
                    this.setState({
                        data:data,
                        oldData:oldData
                    })
                else this.setState({
                    routine:data,
                    oldData:oldData
                })
        }
    }


    changeTask(id,newData,type){
        var ins = {
            ins:'update',
            id:id,
            data:newData
        }
        if (type==="routine")
            ins.ins='updateRoutine';
        var data = this.state.data,
        oldData ;
        if (type==='routine')
            data = this.state.routine;
        for (var i=0;i<data.length;i++){
            if ((data[i].task_id===id)||(data[i].routine_id===id)){
                oldData = JSON.parse(JSON.stringify(data[i]));
                for (var name in newData){
                    data[i][name]=newData[name];
                }
                break;
            }
        }
        var sender = new Sender();
        sender.getData(ins,this.checkUndo.bind(this));
        if (type==="task")
            this.setState({
                data:data,
                oldData:this.state.oldData.concat(oldData)
            })
        else this.setState({
            routine:data,
            oldData:this.state.oldData.concat(oldData)
        })
    }

    refreshData(data){
        if (typeof data==='string'){
            document.write(data);
            return;
        }
        if (data.status===1){
            if (data.type==="task"){
                var dataToAdd = JSON.parse(JSON.stringify(this.state.dataToAdd));
                dataToAdd.task_id = data.id;
                this.setState({
                    data:this.state.data.concat(dataToAdd)
                })
            } else {
                var dataToAdd = JSON.parse(JSON.stringify(this.state.routineToAdd));
                dataToAdd.routine_id = data.id;
                this.setState({
                    routine:this.state.routine.concat(dataToAdd)
                })
            }
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
        if (this.props.module==="routine")
            ins.ins="addRoutine";
        var sender = new Sender();
        sender.getData(ins,this.refreshData.bind(this));
        if (this.props.module==="routine"){
            this.setState({
                routineToAdd:data
            })
        } else {
            this.setState({
                dataToAdd:data
            })
        }
        this.close();
    }

    changeMode(mode){
        this.setState({
            mode:mode
        })
    }

    render() {
        //generate add modal
        var addModal = <AddModal show={this.state.show} close={this.close.bind(this)} commitAdd={this.commitAdd.bind(this)} data={{isAdd:true}}/>;
        if (this.props.module==="routine")
            addModal = <AddRoutine show={this.state.show} close={this.close.bind(this)} commitAdd={this.commitAdd.bind(this)} isAdd={true} data={{}}/>;
        if (!this.state.show)
            addModal=null;
        //filter data
        var filter = new FilterRules();
        var data = this.props.module==="routine"?this.state.routine:this.state.data;
        var taskList = filter.filterData(this.props.module,this.state.mode,data);
        var routine = filter.filterData("everyday_"+this.props.module,this.state.mode,this.state.routine);
        //generate mainview
        var mainView = <div>
            <Col sm={3} md={3} xs={3}>
                <Button onClick={this.showAdd.bind(this)}><Glyphicon glyph="plus-sign" />添加日程</Button>
            </Col>
            <Col xs={12}>
                <TaskList module={this.props.module} data={taskList} mode={'normal'} changeTask={this.changeTask.bind(this)} routine={routine}/>
            </Col>   
        </div>;
        if (this.props.module==="process")
             mainView = <ProcessView data={taskList||{}} />;
        return (
            <div>
                <Grid fluid>         
                        <Col xsHidden sm={3} md={3}>
                            <Filter changeMode={this.changeMode.bind(this)}/></Col>
                        <Col sm={8} md={8} xs={12}>                            
                            {mainView}                        
                        </Col>                 
                </Grid>
                {addModal}
            </div>
        );
    }
}

MainView.propTypes = {
    usn:PropTypes.string.isRequired,
    module:PropTypes.string.isRequired
};

export default MainView;