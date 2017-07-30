import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

class NavList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: "today"
        }
    }

    handleChangeTab(e) {
        this.setState({active: e})
    }

    getBrand() {
        var date = new Date();
        return this.props.userName+"    " + date.getFullYear() + "年" + (date.getMonth()+1) + "月" + date.getDate() + "日";
    }

    render() {
        return (
            <Navbar fluid inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">{this.getBrand.bind(this)()}</a>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav
                        pullRight
                        bsStyle="tabs"
                        stacked
                        activeKey={this.state.active}
                        onSelect={this
                        .handleChangeTab
                        .bind(this)}>
                        <NavItem eventKey={"today"}>今日待办</NavItem>
                        <NavItem eventKey={"tomorrow"}>明日待办</NavItem>
                        <NavItem eventKey={"schedule"}>日程</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

NavList.propTypes = {
    userName: PropTypes.string.isRequired
};

export default NavList;