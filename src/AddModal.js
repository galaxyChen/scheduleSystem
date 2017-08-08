import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Panel from 'react-bootstrap/lib/Panel';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';

class AddModal extends Component {
    constructor(props) {
        super(props);
        var isEdit=false;
        var modalTitle = '添加日程';
        var timeSelect = true;
        var status="doing";
        if (!props.data.isAdd){
            isEdit=true;
            modalTitle = '修改日程';
            timeSelect = props.data.begin&&props.data.end;
            status = props.data.status;
        }
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
        var statusTitle = stateTitle[status];
        var statusStyle = stateList[status];
        this.state = {
            modalTitle: modalTitle,
            beginDate:'',
            endDate:'',
            beginDateForShow:'',
            endDateForShow:'',
            beginTime:"",
            endTime:"",
            timeSelect:timeSelect,
            showBeginTimePicker:false,
            showEndTimePicker:false,
            statusTitle:statusTitle,
            statusStyle:statusStyle,
            status:status,
            isEdit:isEdit
        }
    }

    getTimeHelper(date){
        var result="";
        switch(date.getHours()){
                case 0:result='上午';
                        break;
                case 12:result='中午';
                        break;
                case 14:result='下午';
                        break;
                case 17:result='傍晚';
                        break;
                case 19:result='晚上';
                        break;
                default:
            }
        return result;
    }

    componentWillMount() {
        var beginDate = new Date();
        var endDate = new Date();
        var beginTime = '上午';
        var endTime = '下午';
        var timeSelect=true;
        if (!this.props.data.isAdd){
            if (!this.props.data.begin){
                timeSelect=false;
            } else {
                beginDate = new Date(this.props.data.begin-0);
                endDate = new Date(this.props.data.end-0);
                beginTime = this.getTimeHelper(beginDate);
                endTime = this.getTimeHelper(endDate);
            }
        }
        var beginDateForSHow = beginDate.getFullYear()+"-"+(beginDate.getMonth()+1)+"-"+beginDate.getDate();
        var endDateForShow = endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate();
        this.setState({
            beginDate:beginDate,
            endDate:endDate,
            beginDateForShow:beginDateForSHow,
            endDateForShow:endDateForShow,
            beginTime:beginTime,
            endTime:endTime,
            timeSelect:timeSelect
        })
    }
    

    changeTimeSelect(e) {
        //to set future option
        if (this.state.isEdit){
            var changeList = this.state.changeList||[];
            changeList['timeSelect']=true;
            this.setState({
                changeList:changeList
            })
        }
        this.setState({
            timeSelect:!e.target.checked
        })
    }

    changeTime(e){
        //use for change the time (AM,PM) 
        //0-4 begin, 5-9 end
        if (this.state.isEdit){
            var changeList = this.state.changeList||[];
            var type = e>4?'end':'begin'
            changeList[type]=true;
            this.setState({
                changeList:changeList
            })
        }
        var title=['上午','中午','下午','傍晚','晚上'];
        if (e<=5){
            this.setState({
                beginTime:title[e]
            })
        } else {
            this.setState({
                endTime:title[e%5]
            })
        }
    }

    changeText(type,e){
        if (this.state.isEdit){
            var changeList = this.state.changeList||[];
            changeList[type]=true;
            this.setState({
                changeList:changeList
            })
        }
        if (type==='title'){
            this.setState({
                title:e.target.value
            })
        } else {
            this.setState({
                description:e.target.value
            })
        }
    }

    changeStatus(e) {
        if (this.state.isEdit){
            var changeList = this.state.changeList||[];
            changeList['status']=true;
            this.setState({
                changeList:changeList
            })
        }
        var stateList = ['doing', 'wait', 'emergent', 'todo', 'finish'];
        var stateTitle=['进行中','等待','紧急','待安排','完成'];
        var stateStyle=['primary','warning','danger','info','success'];
        this.setState({
            status:stateList[e],
            statusTitle:stateTitle[e],
            statusStyle:stateStyle[e]
        })
    }

    showTimePicker(type){
        if (type==='begin'){
            this.setState({
                showBeginTimePicker:true
            })
        } else {
            this.setState({
                showEndTimePicker:true
            })
        }
    }

    closeTimePicker(){
        this.setState({
            showBeginTimePicker:false,
            showEndTimePicker:false
        })
    }

    selecteBeginDate(date){
        this.setState({
            beginDate:date
        })
    }

    selecteEndDate(date){
        this.setState({
            endDate:date
        })
    }

    generateTime(type){
        var date = type==='begin'?this.state.beginDate:this.state.endDate;
        var time = type==='begin'?this.state.beginTime:this.state.endTime;
        switch(time){
            case '上午':date.setHours(0);
                        break;
            case '中午':date.setHours(12);
                        break;
            case '下午':date.setHours(14);
                        break;   
            case '傍晚':date.setHours(17);
                        break;        
            case '晚上':date.setHours(19);
                        break;
            default:
        }

        return date.getTime();
    }

    commitEdit(){
        if (!this.state.changeList){
            this.props.close();
            return;
        }
        var data={};
        if (this.state.title===''){
            alert("标题必须填写！");
            return ;
        } 
        else if (this.state.changeList['title'])
                data['title']=this.state.title;
        if (this.state.changeList['description']){
            data['description']=this.state.description;
        }
        if (this.state.changeList['status'])
            data['status']=this.state.status;
        if (this.state.changeList['begin']){
            data['begin']=this.generateTime('begin');
            if (data['status']==="todo"||data['status']===undefined)
                data['status']="doing";
        }
        if (this.state.changeList['end']){
            data['end']=this.generateTime('end');
            if (data['status']==="todo"||data['status']===undefined)
                data['status']="doing";            
        }
        if (this.state.changeList['timeSelect']){
            if (!this.state.timeSelect){
                data['status']='todo';
                data['begin']=null;
                data['end']=null;
            }
            else {
                 data['begin']=this.generateTime('begin');
                 data['end']=this.generateTime('end');
            }
        }
        this.props.commitAdd(data);
    }

    commitAdd(){
        if (this.state.beginDate>this.state.endDate){
            alert("结束时间不能比开始时间更早！");
            return ;            
        }
        if (this.state.isEdit){
            this.commitEdit();
            return ;
        }
        var data={};
        if (this.state.title===''){
            alert("标题必须填写！");
            return ;
        } else data['title']=this.state.title;
        if (this.state.description)
            data['description']=this.state.description;
        if (this.state.timeSelect){
            data['begin']=this.generateTime('begin');
            data['end']=this.generateTime('end');
        }
        data['status']=this.state.status;
        if (!this.state.timeSelect)
            data['status']='todo';
        this.props.commitAdd(data);
        
    }
    

    confirmBeginTime(){
        if (this.state.isEdit){
            var changeList = this.state.changeList||[];
            changeList['begin']=true;
            this.setState({
                changeList:changeList
            })
        }
        var date=this.state.beginDate;
        var dateDefault = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        this.setState({
            beginDateForShow:dateDefault,
            showBeginTimePicker:false
        })
    }

    confirmEndTime(){
        if (this.state.isEdit){
            var changeList = this.state.changeList||[];
            changeList['end']=true;
            this.setState({
                changeList:changeList
            })
        }
        var date=this.state.endDate;
        var dateDefault = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        this.setState({
            endDateForShow:dateDefault,
            showEndTimePicker:false
        })
    }

    render() {
        var today = new Date();
        today.setDate(today.getDate()-7);
        return (

            <Modal show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                 <FormGroup controlId="formBasicText" 
                    >
                    <ControlLabel>标题</ControlLabel>
                    <FormControl
                        type="text"
                        placeholder="任务标题"
                        defaultValue={this.props.data.title||""}
                        onChange={this.changeText.bind(this,'title')}
                    />
                </FormGroup>


                    <FormGroup controlId="formControlsTextarea">
                        <ControlLabel>描述</ControlLabel>
                        <FormControl
                            componentClass="textarea"
                            placeholder="描述"
                            onChange={this.changeText.bind(this,'description')}
                            defaultValue={this.props.data.description||""}/>
                            

                        <Checkbox onChange={this.changeTimeSelect.bind(this)} checked={!this.state.timeSelect}>
                            将来
                        </Checkbox>

                        <Panel collapsible expanded={this.state.timeSelect}>
                            <div className="time-select">
                                <a className='h4 right-space'>
                                    开始时间
                                </a>
                                <Button className='right-space' onClick={this.showTimePicker.bind(this,'begin')}>{this.state.beginDateForShow}</Button>
                                
                                <Modal show={this.state.showBeginTimePicker} onHide={this.closeTimePicker.bind(this)}>
                                    <Modal.Header>
                                        选择时间
                                    </Modal.Header>
                                    <Modal.Body>
                                    <div className="time-picker">
                                        <InfiniteCalendar
                                            width={300}
                                            height={400}
                                            minDate={today}
                                            onSelect={this.selecteBeginDate.bind(this)}
                                            locale={{
                                                locale: require('date-fns/locale/zh_tw'),
                                                headerFormat: 'MMMM DD dddd',
                                                weekdays: ["日","一","二","三","四","五","六"],
                                                blank: '选择日期',
                                                todayLabel: {
                                                long: '今天',
                                                }
                                                }}
                                        />
                                    </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button bsStyle="primary" onClick={this.confirmBeginTime.bind(this)}>确定</Button>
                                        <Button bsStyle="danger" onClick={this.closeTimePicker.bind(this)}>取消</Button>
                                    </Modal.Footer>
                                </Modal>

                                <DropdownButton
                                    bsStyle={'default'}
                                    title={this.state.beginTime}
                                    onSelect={this.changeTime.bind(this)}
                                    id={'time-tab'}>
                                    <MenuItem eventKey={0}>上午</MenuItem>
                                    <MenuItem eventKey={1}>中午</MenuItem>
                                    <MenuItem eventKey={2}>下午</MenuItem>
                                    <MenuItem eventKey={3}>傍晚</MenuItem>
                                    <MenuItem eventKey={4}>晚上</MenuItem>
                                </DropdownButton>
                            </div>


                            <div>
                                <a className='h4 right-space'>
                                    结束时间
                                </a>
                                <Button className='right-space' onClick={this.showTimePicker.bind(this,'end')}>{this.state.endDateForShow}</Button>

                                <Modal show={this.state.showEndTimePicker} onHide={this.closeTimePicker.bind(this)}>
                                    <Modal.Header>
                                        选择时间
                                    </Modal.Header>
                                    <Modal.Body>
                                    <div className="time-picker">
                                        <InfiniteCalendar
                                            width={300}
                                            height={400}
                                            minDate={today}
                                            onSelect={this.selecteEndDate.bind(this)}
                                            locale={{
                                                locale: require('date-fns/locale/zh_tw'),
                                                headerFormat: 'MMMM DD dddd',
                                                weekdays: ["日","一","二","三","四","五","六"],
                                                blank: '选择日期',
                                                todayLabel: {
                                                long: '今天',
                                                }
                                                }}
                                        />
                                    </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button bsStyle="primary" onClick={this.confirmEndTime.bind(this)}>确定</Button>
                                        <Button bsStyle="danger" onClick={this.closeTimePicker.bind(this)}>取消</Button>
                                    </Modal.Footer>
                                </Modal>
                                <DropdownButton
                                    bsStyle={'default'}
                                    title={this.state.endTime}
                                    onSelect={this.changeTime.bind(this)}
                                    id={'time-tab2'}>
                                    <MenuItem eventKey={5}>上午</MenuItem>
                                    <MenuItem eventKey={6}>中午</MenuItem>
                                    <MenuItem eventKey={7}>下午</MenuItem>
                                    <MenuItem eventKey={8}>傍晚</MenuItem>
                                    <MenuItem eventKey={9}>晚上</MenuItem>
                                </DropdownButton>
                            </div>
                        </Panel>
                    </FormGroup>
                    <div className="status-button">
                    <DropdownButton                               
                                bsStyle={this.state.statusStyle}
                                title={this.state.statusTitle}
                                onSelect={this.changeStatus.bind(this)}
                                id={'status'}>
                                <MenuItem eventKey={0}>进行中</MenuItem>
                                <MenuItem eventKey={1}>等待</MenuItem>
                                <MenuItem eventKey={2}>紧急</MenuItem>
                                <MenuItem eventKey={3}>将做</MenuItem>
                                <MenuItem eventKey={4}>完成</MenuItem>
                            </DropdownButton>
                    </div>
                    <Button disabled><Glyphicon glyph="plus-sign" />&nbsp;&nbsp;&nbsp;&nbsp;添加子任务</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.commitAdd.bind(this)}>确定</Button>
                    <Button bsStyle="danger" onClick={this.props.close}>取消</Button>
                </Modal.Footer>
            </Modal>

        );
    }
}

AddModal.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    commitAdd:PropTypes.func.isRequired,
    data:PropTypes.object.isRequired
};

export default AddModal;