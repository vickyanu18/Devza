import React, { Component, Fragment } from "react";
import { Grid, Image, Icon, Segment, Header, Card, Popup, Label, Button, Input, Modal } from 'semantic-ui-react';
import Service from "../scripts/Service";
import _, { isObject } from 'lodash';
import moment from 'moment';
import LoadingMask from "./LoadingMask";


class TaskList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      Service: new Service(),

      taskList: [],
      taskListData: [],
      openModal: false,
      currentDateTime: moment().format('DD MMM YYYY'),
      loadingMask: false
    }
  }



  componentDidMount() {
    this.getTaskList();
  }

  componentDidUpdate(prevProps) {
    console.log('------------', prevProps.refresh, this.props.refresh)
    if (prevProps.refresh !== this.props.refresh) {
      this.getTaskList();
    }
  }

  getTaskList() {
    this.setState({
      loadingMask: true
    })
    var data = this.state.Service.Get('list');
    data.then(function (res) {
      this.setState({
        taskListData: res.tasks,
        loadingMask: false
      })
      this.groupTaskList(res.tasks);
      this.props.reset();
    }.bind(this));

    data.catch(function () {
    }.bind(this));
  }


  groupTaskList(data) {
    var grouped = _.groupBy(data, 'priority');

    this.setState({
      taskList: grouped
    });
  }


  onDrag(ev, data, flag) {
    this.setState({
      task_id: data,
      dropPriority: flag
    });
  }

  onDragOver(ev) {
    ev.preventDefault();
  }

  onDrop(ev, flag, data) {
    ev.preventDefault();
    this.onDropTask(flag, data);
  }

  onDropTask(flag, formValues) {
    var priorityid;
    switch (flag) {
      case 'high':
        priorityid = 3;
        break;
      case 'medium':
        priorityid = 2;
        break;
      case 'low':
        priorityid = 1;
        break;
    }


    var formData = new FormData();
    formData.append('priority', priorityid);
    formData.append('taskid', this.state.task_id);


    if (this.state.dropPriority !== flag) {
      this.setState({
        loadingMask: true
      });

      var data = this.state.Service.Post('update', formData);

      data.then(function (res) {
        this.getTaskList();
      }.bind(this));

      data.catch(function (res) {

      });
    }
  }

  editTask(data) {
    this.props.editTask(true, data);
  }

  deleteTask(id) {
    this.setState({
      loader: true,
      disabledBtn: true
    })
    var deleteObj = new FormData();
    deleteObj.append('taskid', this.state.deleteTaskID)

    var data = this.state.Service.Post('delete', deleteObj);
    data.then(function (res) {
      this.getTaskList();
      this.setState({
        openModal: false,
        loader: false,
        disabledBtn: false
      });
    }.bind(this));

    data.catch(function () {
    }.bind(this));
  }



  getAssignedUser(id, name) {
    let getUser = _.filter(this.props.userList, function (user) {
      return user.id === id;
    });

    if (getUser.length > 0) {
      return (
        <div>
          <Image avatar src={getUser[0].picture} /> <span>{name}</span>
        </div>
      )
    }
  }


  searchTask(e) {
    var results = _.filter(this.state.taskListData, function (elem) {
      return _.lowerCase(elem.message).indexOf(_.lowerCase(e.target.value)) > -1;
    });
    this.setState({
      searchValue: e.target.value
    });

    this.groupTaskList(results);
  }

  clearSearch() {
    this.setState({
      searchValue: ''
    });

    this.groupTaskList(this.state.taskListData);

  }

  render() {
    return (
      <Fragment>
        <LoadingMask show={this.state.loadingMask} />
        <Grid>
          <Grid.Column width={16} textAlign='left'>
            <Input className='task-search' value={this.state.searchValue} onChange={(e) => this.searchTask(e)} icon='search' placeholder='Search by Task Name...' />
            {this.state.searchValue && <span onClick={() => this.clearSearch()} className='clear-btn'>clear</span>}
            <Label size='large' className='float-right today-date' color='teal'>{this.state.currentDateTime}</Label>
          </Grid.Column>
        </Grid>
        {_.size(this.state.taskList) > 0 ?
          <Fragment>
            <Grid className='task-list' columns='equal'>
              <Grid.Column>
                <Header as='h3'>High ({_.size(this.state.taskList[3])})</Header>
                <Segment secondary onDrop={event => this.onDrop(event, 'high')} onDragOver={(event => this.onDragOver(event))}>
                  {_.size(this.state.taskList[3]) > 0 && this.state.taskList[3].map((data, key) => {
                    return (
                      <Card className='task-list-card' fluid draggable="true" onDrag={(event) => this.onDrag(event, data.id, 'high')} >
                        <Card.Content>
                          <Label color='red' circular></Label><span>{data.message}</span>
                          <div>
                            <div title='Due Date' className='task-due-date'>{moment(data.due_date).format('DD MMM YYYY')}</div>
                            <div className='task-assigned'>{this.getAssignedUser(data.assigned_to, data.assigned_name)}</div>
                          </div>
                        </Card.Content>
                        <div className='task-action-bar'>
                          <Button title='Delete Task' className='float-right delete-task' circular icon='trash' onClick={() => this.setState({ openModal: true, deleteTaskID: data.id })} />
                          <Button title='Edit Task' className='float-right edit-task' circular icon='pencil' onClick={() => this.editTask(data)} />
                        </div>
                      </Card>
                    )
                  })
                  }
                </Segment>
              </Grid.Column>

              <Grid.Column>
                <Header as='h3'>Medium ({_.size(this.state.taskList[2])})</Header>

                <Segment secondary onDrop={event => this.onDrop(event, 'medium')} onDragOver={(event => this.onDragOver(event))}>
                  {_.size(this.state.taskList[2]) > 0 && this.state.taskList[2].map((data, key) => {
                    return (
                      <Card className='task-list-card' fluid draggable="true" onDrag={(event) => this.onDrag(event, data.id, 'medium')} >
                        <Card.Content>
                          <Label color='orange' circular></Label><span>{data.message}</span>
                          <div>
                            <div title='Due Date' className='task-due-date'>{moment(data.due_date).format('DD MMM YYYY')}</div>
                            <div className='task-assigned'>{this.getAssignedUser(data.assigned_to, data.assigned_name)}</div>
                          </div>
                        </Card.Content>
                        <div className='task-action-bar'>
                          <Button title='Delete Task' className='float-right delete-task' circular icon='trash' onClick={() => this.setState({ openModal: true, deleteTaskID: data.id })} />
                          <Button title='Edit Task' className='float-right edit-task' circular icon='pencil' onClick={() => this.editTask(data)} />
                        </div>
                      </Card>
                    )
                  })
                  }
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Header as='h3'>Low ({_.size(this.state.taskList[1])})</Header>

                <Segment secondary onDrop={event => this.onDrop(event, 'low')} onDragOver={(event => this.onDragOver(event))}>
                  {_.size(this.state.taskList[1]) > 0 && this.state.taskList[1].map((data, key) => {
                    return (
                      <Card className='task-list-card' fluid draggable="true" onDrag={(event) => this.onDrag(event, data.id, 'low')} >
                        <Card.Content>
                          <Label color='blue' circular></Label><span>{data.message}</span>
                          <div>
                            <div title='Due Date' className='task-due-date'>{moment(data.due_date).format('DD MMM YYYY')}</div>
                            <div className='task-assigned'>{this.getAssignedUser(data.assigned_to, data.assigned_name)}</div>
                          </div>
                        </Card.Content>
                        <div className='task-action-bar'>
                          <Button title='Delete Task' className='float-right delete-task' circular icon='trash' onClick={() => this.setState({ openModal: true, deleteTaskID: data.id })} />
                          <Button title='Edit Task' className='float-right edit-task' circular icon='pencil' onClick={() => this.editTask(data)} />
                        </div>
                      </Card>
                    )
                  })
                  }
                </Segment>
              </Grid.Column>
            </Grid>

            <Modal
              dimmer='blurring'
              open={this.state.openModal}
              className='create-modal'
            >
              <Modal.Header>Delete Task</Modal.Header>
              <Modal.Content>
                Are you sure want to delete this task?
              </Modal.Content>
              <Modal.Actions>
                <Button type='button' onClick={() => { this.setState({ openModal: false }) }}>
                  Close
                </Button>
                <Button className='btn-agree' type='button' onClick={() => this.deleteTask()} loading={this.state.loader} disabled={this.state.disabledBtn}>
                  Delete Task
                </Button>
              </Modal.Actions>
            </Modal>


          </Fragment>
          : <Header as='h3' icon textAlign='center'>
            <Header.Content>No Task Found!
              <div>Click "+" icon on bottom right corner of your screen, To create new task</div>
            </Header.Content>
          </Header>
        }
      </Fragment>
    )
  }

}

export default TaskList;
