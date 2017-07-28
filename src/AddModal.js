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

        this.state = {
            title: '添加日程',
            date:'',
            beginTime:"",
            endTime:"",
            timeSelect:true,
            showBeginTimePicker:false,
            showEndTimePicker:false
        }
    }

    

    componentWillMount() {
        var date = new Date();
        var dateDefault = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay();
        var beginTime = '上午';
        var endTime = '下午';
        this.setState({
            date:dateDefault,
            beginTime:beginTime,
            endTime:endTime
        })
    }
    

    changeTimeSelect(e) {
        //to set future option
        this.setState({
            timeSelect:!e.target.checked
        })
    }

    changeTime(e){
        //use for change the time (AM,PM) 
        //0-4 begin, 5-9 end
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
        console.log(type,e.target.value);
    }

    showTimePicker(type){
        if (type=='begin'){
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
    

    confirmBeginTime(){
        var date=this.state.beginDate;
        var dateDefault = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay();
        this.setState({
            date:dateDefault,
            showBeginTimePicker:false
        })
    }

    confirmEndTime(){
        var date=this.state.endDate;
        var dateDefault = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay();
        this.setState({
            date:dateDefault,
            showEndTimePicker:false
        })
    }

    render() {
        var today = new Date();
        return (

            <Modal show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                 <FormGroup controlId="formBasicText"
                    >
                    <ControlLabel>标题</ControlLabel>
                    <FormControl
                        type="text"
                        placeholder="任务标题"
                        onChange={this.changeText.bind(this,'title')}
                    />
                </FormGroup>


                    <FormGroup controlId="formControlsTextarea">
                        <ControlLabel>描述</ControlLabel>
                        <FormControl
                            componentClass="textarea"
                            placeholder="描述"
                            onChange={this.changeText.bind(this,'description')}/>


                        <Checkbox onChange={this.changeTimeSelect.bind(this)}>
                            将来
                        </Checkbox>

                        <Panel collapsible expanded={this.state.timeSelect}>
                            <div className="time-select">
                                <a className='h4 right-space'>
                                    开始时间
                                </a>
                                <Button className='right-space' onClick={this.showTimePicker.bind(this,'begin')}>{this.state.date}</Button>
                                
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
                                <Button className='right-space' onClick={this.showTimePicker.bind(this,'end')}>{this.state.date}</Button>

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


                    <Button disabled><Glyphicon glyph="plus-sign" />&nbsp;&nbsp;&nbsp;&nbsp;添加子任务</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary">确定</Button>
                    <Button bsStyle="danger">取消</Button>
                </Modal.Footer>
            </Modal>

        );
    }
}

AddModal.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
};

export default AddModal;