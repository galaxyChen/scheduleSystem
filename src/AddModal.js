import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button'

class AddModal extends Component {
    constructor(props){
        super(props);
        this.state={
            title:'添加日程'
        }
    }

    render() {
        return (
            
                <Modal show={this.props.show} onHide={this.props.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" >确定</Button>
                        <Button bsStyle="danger" >取消</Button>
                    </Modal.Footer>
                </Modal>
            
        );
    }
}

AddModal.propTypes = {
    show:PropTypes.bool.isRequired,
    close:PropTypes.func.isRequired
};

export default AddModal;