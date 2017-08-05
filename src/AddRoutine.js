import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Panel from 'react-bootstrap/lib/Panel';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import Checkbox from 'react-bootstrap/lib/Checkbox';

class AddRoutine extends Component {
    constructor(props) {
        super(props);

        var isEdit = true;
        if (props.isAdd)
            isEdit=false;

        var modalTitle = '添加每日任务';
        if (isEdit)
            modalTitle = "修改每日任务";

        var beginDate = new Date();
        var beginTime = '上午';
        var endDate = new Date();
        var endTime = '上午';
        if (isEdit){
            beginDate = new Date(props.data.begin-0);
            beginTime = this.getTimeHelper(beginDate);
            if (props.endTime)
                endDate = new Date(props.data.end-0);
            endTime = this.getTimeHelper(endDate);
        }
        var beginDateForSHow = beginDate.getFullYear()+"-"+(beginDate.getMonth()+1)+"-"+beginDate.getDate();
        var endDateForShow = endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate();
        var endTimeSelect = false;
        if (props.endTime)
            endTimeSelect = true;

        var everyTitle = "每1天";
        var every=1;
        if (isEdit){
            everyTitle="每"+props.data.every+"天";;
            every=props.data.every;
        }

        var status="doing";
        var statusStyle="primary";
        var statusTitle="进行中";
        if (isEdit){
            status = props.data.status;
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
            statusStyle = stateList[status];
            statusTitle = stateTitle[status];
        }
        var every = 1;
        if (isEdit)
            every = props.data.every;
        this.state = {
            modalTitle: modalTitle,
            beginDate:beginDate,
            endDate:endDate,
            beginDateForShow:beginDateForSHow,
            endDateForShow:endDateForShow,
            beginTime:beginTime,
            endTime:endTime,
            showBeginTimePicker:false,
            showEndTimePicker:false,
            endTimeSelect:endTimeSelect,
            everyTitle:everyTitle,
            every:every,
            status:status,
            isEdit:isEdit,
            statusStyle:statusStyle,
            statusTitle:statusTitle
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
    
    changeTime(e){
        //use for change the time (AM,PM) 
        //0-4 begin, 5-9 end
        if (this.state.isEdit){
            var changeList = this.state.changeList||{};
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
            var changeList = this.state.changeList||{};
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
        if (this.state.changeList['begin']){
            data['begin']=this.generateTime('begin');
        }
        if (this.state.changeList['end']){
            data['end']=this.generateTime('end');          
        }
        if ((!this.state.endTimeSelect)&&(this.state.changeList['end'])){
            data['end']=null;
        }
        if (this.state.changeList['every']){
            data['every']=this.state.every;   
        }
        if (this.state.changeList['status']){
            data['status']=this.state.status;
        }
        this.setState({
            changeList:{}
        })
        this.props.commitAdd(data);
    }


    commitAdd(){
        if ((this.state.endTimeSelect)&&(this.state.beginDate>this.state.endDate)){
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
        data['begin']=this.generateTime('begin');
        if (this.state.endTimeSelect)
            data['end']=this.generateTime('end');
        else data['end']=null;
        data['status']=this.state.status;
        data['every']=this.state.every;
        this.props.commitAdd(data);
    }
    

    confirmBeginTime(){
        var date=this.state.beginDate;
        var dateDefault = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        this.setState({
            beginDateForShow:dateDefault,
            showBeginTimePicker:false
        })
    }

    confirmEndTime(){
        var date=this.state.endDate;
        var dateDefault = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        this.setState({
            endDateForShow:dateDefault,
            showEndTimePicker:false
        })
    }

    changeEndTimeSelect(){
        if (this.state.isEdit){
            var changeList = this.state.changeList||{};
            changeList['end']=true;
            this.setState({
                changeList:changeList
            })
        }
        this.setState({
            endTimeSelect:!this.state.endTimeSelect
        })
    }

    changeEvery(e){
        if (this.state.isEdit){
            var changeList = this.state.changeList||{};
            changeList['every']=true;
            this.setState({
                changeList:changeList
            })
        }
        this.setState({
            every:e,
            everyTitle:"每"+e+"天"
        })
    }

    changeStatus(e){
        if (this.state.isEdit){
            var changeList = this.state.changeList||{};
            changeList['status']=true;
            this.setState({
                changeList:changeList
            })
        }
        var stateList = ['doing', 'todo', 'finish'];
        var newState = stateList[e];
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
        this.setState({
            status:newState,
            statusStyle:stateList[newState],
            statusTitle:stateTitle[newState]
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
                            
                    <Panel className="begin-time">
                        <div>
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
                        </Panel>
                        <Checkbox onChange={this.changeEndTimeSelect.bind(this)} checked={this.state.endTimeSelect}>
                            定期结束
                        </Checkbox>
                        <Panel collapsible expanded={this.state.endTimeSelect}>
                            
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
                    <div>
                        <h4>重复：</h4>
                        <DropdownButton
                                    bsStyle={'default'}
                                    title={this.state.everyTitle}
                                    onSelect={this.changeEvery.bind(this)}
                                    id={'end-time-tab'}>
                                    <MenuItem eventKey={1}>每1天</MenuItem>
                                    <MenuItem eventKey={2}>每2天</MenuItem>
                                    <MenuItem eventKey={3}>每3天</MenuItem>
                                    <MenuItem eventKey={4}>每4天</MenuItem>
                                    <MenuItem eventKey={5}>每5天</MenuItem>
                                    <MenuItem eventKey={6}>每6天</MenuItem>
                                    <MenuItem eventKey={7}>每7天</MenuItem>
                                </DropdownButton>
                    </div>
                    <DropdownButton
                                bsStyle={this.state.statusStyle}
                                title={this.state.statusTitle}
                                onSelect={this.changeStatus.bind(this)}
                                id={this.props.data.routine_id||1}
                                className="status-button-routine"
                                >
                                <MenuItem eventKey={0}>进行中</MenuItem>
                                <MenuItem eventKey={1}>将做</MenuItem>
                                <MenuItem eventKey={2}>完成</MenuItem>
                            </DropdownButton>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.commitAdd.bind(this)}>确定</Button>
                    <Button bsStyle="danger" onClick={this.props.close}>取消</Button>
                </Modal.Footer>
            </Modal>

        );
    }
}

AddRoutine.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    commitAdd:PropTypes.func.isRequired,
    data:PropTypes.object.isRequired,
    isAdd:PropTypes.bool.isRequired
};

export default AddRoutine;