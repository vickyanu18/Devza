import React, { Component, Fragment } from "react";
import { Grid, Image, Icon, Button, Modal, Label } from 'semantic-ui-react';
import { Form } from 'formsy-semantic-ui-react';
import Service from '../scripts/Service';
import moment from 'moment';

class CreateTask extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      Service: new Service(),
      editTask: false,
      userData: []
    }
  }

  componentDidMount() {
    var data = this.state.Service.Get('listusers');

    data.then(function (res) {
      this.setState({
        userData: res.users
      });
      this.props.userData(res.users);
    }.bind(this));

    data.catch(function (res) {

    });
  }

  onValidSubmit = (formValues) => {

    this.setState({
      loader: true,
      disabledBtn: true
    });

    var formData = new FormData();
    formData.append('message', formValues.message);
    formData.append('due_date', moment(formValues.due_date).format('YYYY-MM-DD h:mm:ss'));
    formData.append('priority', formValues.priority);
    formData.append('assigned_to', formValues.assigned_to);
    if (this.state.editTask)
      formData.append('taskid', this.state.task_id);


    if (!this.state.editTask)
      var data = this.state.Service.Post('create', formData);
    else
      var data = this.state.Service.Post('update', formData);

    data.then(function (res) {
      this.setState({
        loader: false,
        disabledBtn: false,
        openModal: false
      });

      this.props.refresh(true);
      this.resetForm();
    }.bind(this));

    data.catch(function (res) {

    });
  }

  resetForm() {
    this.setState({
      message: '',
      assigned_to: '',
      priority: '',
      due_date: ''
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.editTask != this.props.editTask) {
      this.setState({
        openModal: this.props.editTask,
        editTask: this.props.editTask
      });
      if (this.props.editTask)
        this.editData(this.props.editData);
    }
  }

  editData(data) {
    this.setState({
      message: data.message,
      due_date: moment(data.due_date).format('YYYY-MM-DD'),
      assigned_to: data.assigned_to,
      priority: data.priority,
      task_id: data.id
    });
  }

  closeModal() {
    this.setState({
      openModal: false
    }, () => this.props.reset())
  }

  render() {
    const errorLabel = <Label color="red" pointing />

    const priorityOptions = [
      { key: 'low', value: '1', text: 'Low', label: { color: 'blue', empty: true, circular: true }, },
      { key: 'medium', value: '2', text: 'Medium', label: { color: 'orange', empty: true, circular: true }, },
      { key: 'High', value: '3', text: 'High', label: { color: 'red', empty: true, circular: true }, },
    ]

    this.state.assignedOptions = [];

    this.state.userData.map(function (data, key) {
      this.state.assignedOptions.push({
        key: data.id,
        value: data.id,
        text: data.name,
        image: { avatar: true, src: data.picture },
      })
    }.bind(this))


    return (
      <div>
        <Button className='floating-btn' onClick={() => this.setState({ openModal: true })}>
          <Icon name='plus' />
        </Button>

        <Modal
          dimmer='blurring'
          open={this.state.openModal}
          onClose={() => this.closeModal()}
          className='create-modal'
        >
          <Modal.Header>Create Task</Modal.Header>
          <Modal.Content>
            <Form
              ref={(ref) => (this.form = ref)}
              onValidSubmit={this.onValidSubmit}
            >
              <Form.Group widths='equal'>

                <Form.Input
                  name="message"
                  label="Task Name"
                  required
                  value={this.state.message}
                  validationErrors={{ isDefaultRequiredValue: 'Required Field' }}
                  errorLabel={errorLabel}
                />

                <Form.Input
                  type='date'
                  name="due_date"
                  label="Due Date"
                  required
                  value={this.state.due_date}
                  validationErrors={{ isDefaultRequiredValue: 'Required Field' }}
                  errorLabel={errorLabel}
                />
              </Form.Group>

              <Form.Group widths='equal'>
                <Form.Select
                  name="assigned_to"
                  label="Assigned To"
                  options={this.state.assignedOptions}
                  required
                  value={this.state.assigned_to}
                  validationErrors={{ isDefaultRequiredValue: 'Required Field' }}
                  errorLabel={errorLabel}
                />

                <Form.Select
                  name="priority"
                  label="Priority"
                  options={priorityOptions}
                  required
                  value={this.state.priority}
                  validationErrors={{ isDefaultRequiredValue: 'Required Field' }}
                  errorLabel={errorLabel}
                />

              </Form.Group>

              <Modal.Actions>
                <Button type='button' onClick={() => { this.form.reset(); this.resetForm(); this.closeModal() }}>
                  Close
                </Button>
                <Button className='btn-agree' loading={this.state.loader} disabled={this.state.disabledBtn}>
                  Create Task
                </Button>
              </Modal.Actions>
            </Form>

          </Modal.Content>

        </Modal>
      </div>
    )
  }

}

export default CreateTask;
