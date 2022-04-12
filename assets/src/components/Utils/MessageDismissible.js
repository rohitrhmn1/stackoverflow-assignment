import React, { Component } from "react";
import { Alert } from "react-bootstrap";

export default class MessageDismissible extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <Alert
          className="text-center"
          variant={this.props.variant}
          onClose={this.props.onClose}
          dismissible
        >
          {this.props.children}
        </Alert>
      );
    }
  }
  
