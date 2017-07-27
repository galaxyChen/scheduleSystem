import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Fliter from './Fliter';
import TaskList from './TaskList';

class MainView extends Component {
    render() {
        return (
            <div>
                <Grid fluid>
                    <Row>
                        <Col xsHidden sm={3} md={3}><Fliter /></Col>
                        <Col sm={5} md={5}><TaskList /></Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

MainView.propTypes = {

};

export default MainView;