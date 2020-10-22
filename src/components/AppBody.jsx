import React, { Component, Fragment } from "react";
import { Grid, Image, Icon, Input, Button } from 'semantic-ui-react';
import CreateTask from "./CreateTask";
import TaskList from "./TaskList";

class AppBody extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editTask: false,
      editData: '',
      userData: [],
      refresh: false
    }
  }

  editTask(flag, data) {
    this.setState({
      editTask: flag,
      editData: data
    })
  }

  userList(data) {
    this.setState({
      userData: data
    })
  }

  reset() {
    this.editTask(false);
    this.setState({
      refresh: false
    })
  }

  refresh(flag) {
    this.setState({
      refresh: true
    });
    this.editTask(false);
  }

  render() {
    return (
      <Grid className='app-body'>
        <Grid.Column width='16'>
          <Grid>
            <Grid.Column width={16} >
              <TaskList editTask={this.editTask.bind(this)} userList={this.state.userData} refresh={this.state.refresh} reset={this.reset.bind(this)} />
            </Grid.Column>

            <CreateTask refresh={this.refresh.bind(this)} userData={this.userList.bind(this)} editTask={this.state.editTask} editData={this.state.editData} reset={this.reset.bind(this)} />

          </Grid>
        </Grid.Column>
      </Grid>
    )
  }

}

export default AppBody;
