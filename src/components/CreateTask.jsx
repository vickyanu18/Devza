import React, { Component, Fragment } from "react";
import { Grid, Image, Icon, Button, Modal, Label } from 'semantic-ui-react';
import { Form } from 'formsy-semantic-ui-react';
import Service from '../scripts/Service';
import moment from 'moment';

class CreateTask extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Service: new Service(),
    }
  }

  createList() {
    if (localStorage.getItem("lists") === null) {
      var dataArr = [];
      dataArr.push([]);
    }
    else {
      var dataArr = JSON.parse(localStorage.getItem("lists"));
      dataArr.push([]);
    }

    this.state.Service.Post(dataArr);
    this.props.refresh(true);

  }


  render() {
    return (
      <div>
        <Button className='floating-btn' onClick={() => this.createList()}>
          <Icon name='plus' />
        </Button>
      </div>
    )
  }

}

export default CreateTask;
