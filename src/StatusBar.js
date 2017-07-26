import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './css.css';

class StatusBar extends Component {

    getTime(){
        var date = new Date();
        return date.getFullYear()+"年"+date.getMonth()+"月"+date.getDay()+"日";
    }

    render() {
        return (
            <div className="header">
                <a className="brand">{this.props.userName}</a>
                <a className="brand">{this.getTime.bind(this)()}</a>
            </div>
        );
    }
}

StatusBar.propTypes = {
    userName:PropTypes.string.isRequired
};

export default StatusBar;