import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

class Fliter extends Component {

    constructor(props){
        super(props);
        this.state={
            active:"time"
        }
    }

    handleSelect(e){
        this.props.changeMode(e);
        this.setState({
            active:e
        })
    }

    render() {
        return (
            <div>
                <Nav stacked bsStyle="pills" activeKey={this.state.active} onSelect={this.handleSelect.bind(this)}>
                    <NavItem eventKey={"time"} >时间排序</NavItem>
                    <NavItem eventKey={"state"} >状态排序</NavItem>
                    <NavItem eventKey={"important"} >紧急排序</NavItem>
                </Nav>
            </div>
        );
    }
}

Fliter.propTypes = {
    changeMode:PropTypes.func.isRequired
};

export default Fliter;