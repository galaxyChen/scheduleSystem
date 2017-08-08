import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'react-bootstrap/lib/ProgressBar'

class Process extends Component {
    render(){
        var pro = this.props.process||100;
        var spend = this.props.spend;
        var last = this.props.last;
        if (last<0)
            pro = 0;
        return <div>
        <h4>{this.props.name}</h4>
        <ProgressBar>
            <ProgressBar active now={pro} label={"已过"+spend+"天"} bsStyle={"info"} key={1}></ProgressBar>
            <ProgressBar active now={100-pro||0} label={"还剩"+(last)+"天"} bsStyle={last>spend?"warning":"danger"} key={2}></ProgressBar>
        </ProgressBar>
        </div>
    }
}

Process.propTypes = {
    process:PropTypes.number.isRequired,
    spend:PropTypes.number.isRequired,
    last:PropTypes.number.isRequired,
    name:PropTypes.string.isRequired
}


class ProcessView extends Component {
    constructor(props){
        super(props);
    }

    render() {
        var data = this.props.data.process||[];
        var processBarList = data.map((value,index)=>{
            let begin = new Date(value.begin-0);
            let end = new Date(value.end-0);
            let today = new Date();
            let totalTime = parseInt(Math.abs(end-begin)/(1000*60*60*24));
            let spend = parseInt(Math.abs(today-begin)/(1000*60*60*24));
            let last = totalTime - spend;
            let pro = parseInt(spend*100/totalTime);
            return <Process process = {pro} spend = {spend} last = {last} key={index} name={value.title}/>
        })
        return (
            <div>
                {processBarList}
            </div>
        );
    }
}

ProcessView.propTypes = {
    data:PropTypes.object.isRequired
};

export default ProcessView;