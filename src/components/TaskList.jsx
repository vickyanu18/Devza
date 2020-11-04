import React, { Component, Fragment } from "react";
import { Grid, Image, Icon, Segment, Header, Card, Popup, Label, Button, Input, Modal, Table } from 'semantic-ui-react';
import Service from "../scripts/Service";
import _, { isObject } from 'lodash';
import moment from 'moment';
import LoadingMask from "./LoadingMask";
import { Form } from 'formsy-semantic-ui-react';
import Cards from './Cards'



class recordList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      Service: new Service(),

      listArr: [],
      openModal: false,
      currentDateTime: moment().format('DD MMM YYYY'),
      loadingMask: false,
      commentsArr: []
    }
  }

  componentDidMount() {
    this.getRecordList();
  }

  editTask(data) {
    this.props.editTask(true, data);
  }

  getRecordList() {
    this.setState({
      listArr: JSON.parse(this.state.Service.Get())
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.refresh !== this.props.refresh) {
      this.getRecordList();
      this.props.reset();
    }
  }


  onValidSubmit = (formValue) => {
    this.state.Service.createCard(formValue, this.state.cardKey);
    this.getRecordList();
    this.setState({
      openModal: false
    })
  }


  addList(key) {
    this.setState({
      openModal: true,
      cardKey: key,
      isEdit: false
    })
  }

  closeModal() {
    this.setState({
      openModal: false
    })
  }

  resetForm() {
    this.setState({
      comments: '',
      title: ''
    })
  }

  editCard(title, key, listKey) {
    this.setState({ openModal: true, cardKey: listKey, isEdit: true, title: this.state.listArr[listKey][key].title, commentsArr: this.state.listArr[listKey][key].comments })
  }

  onDragOver(ev) {
    ev.preventDefault();
  }

  onDrop(ev, key) {
    ev.preventDefault();
    console.log('drop', key)

    this.onDropCard(key);
  }

  onDropCard(dropKey) {
    this.state.Service.dragDrop(this.state.dragKey, dropKey, this.state.dragCardKey);
    this.getRecordList();
  }

  cardDrag(key, cardKey) {
    this.setState({
      dragKey: key,
      dragCardKey: cardKey
    });
  }

  deleteList(key) {
    this.state.Service.deleteList(key);
    this.getRecordList();
  }


  render() {
    const errorLabel = <Label color="red" pointing />

    return (
      <Fragment>
        <LoadingMask show={this.state.loadingMask} />
        {_.size(this.state.listArr) > 0 ?
          <Fragment>
            <Grid className='task-list' columns='equal'>

              {this.state.listArr.map((data, key) => {
                return (
                  <Grid.Column>
                    <Header as='h3'>List {key + 1}</Header>
                    <Segment secondary onDrop={event => this.onDrop(event, key)} onDragOver={(event => this.onDragOver(event))}>
                      {this.state.listArr[key].length > 0 &&
                        <Cards listKey={key} data={this.state.listArr[key]} onDrag={(key, cardKey) => this.cardDrag(key, cardKey)} refresh={() => this.getRecordList()} editCard={(title, key, listKey) => this.editCard(title, key, listKey)} />
                      }
                      <Button className='add-card-btn' onClick={() => this.addList(key)}>Add Card</Button>
                      <Button className='delete-card-btn' onClick={() => this.deleteList(key)}>Delete List {key + 1}</Button>

                    </Segment>

                  </Grid.Column>
                )
              })
              }
            </Grid>
          </Fragment>
          : <Header as='h3' icon textAlign='center'>
            <Header.Content>No List Found!
              <div>Click "+" icon on bottom right corner of your screen, To create new list</div>
            </Header.Content>
          </Header>
        }

        <Modal
          dimmer='blurring'
          open={this.state.openModal}
          onClose={() => this.closeModal()}
          className='create-modal'
        >
          <Modal.Header>Add Card</Modal.Header>
          <Modal.Content>
            <Form
              ref={(ref) => (this.form = ref)}
              onValidSubmit={this.onValidSubmit}
            >
              <Form.Group widths='equal'>

                <Form.Input
                  name="title"
                  label="Card Title"
                  required
                  disabled={this.state.isEdit}
                  value={this.state.title}
                  validationErrors={{ isDefaultRequiredValue: 'Required Field' }}
                  errorLabel={errorLabel}
                />

              </Form.Group>

              <Form.Group widths='equal'>
                <Form.TextArea
                  name="comments"
                  label="Comments"
                  required
                  value={this.state.comments}
                  validationErrors={{ isDefaultRequiredValue: 'Required Field' }}
                  errorLabel={errorLabel}
                />
              </Form.Group>
              {this.state.isEdit && this.state.commentsArr &&
                <Fragment>
                  {this.state.commentsArr.map((data, key) => {
                    return (
                      <Grid>
                        <Grid.Column width={16}>
                          <Header as='h4' color='grey'>{data.comments}</Header>
                        </Grid.Column>

                        <Grid.Column width={16} className='noPaddingTop noPaddingBottom'>
                          <Header as='h5' color='black' className='edit-timer'> {moment(data.dateTime).format('DD MMM YYYY h:ss A')}</Header>
                        </Grid.Column>
                      </Grid>
                    )
                  })

                  }
                </Fragment>
              }

              <Modal.Actions>
                <Button type='button' onClick={() => { this.form.reset(); this.resetForm(); this.closeModal() }}>
                  Close
                </Button>
                <Button className='btn-agree' loading={this.state.loader} disabled={this.state.disabledBtn}>
                  Create Card
                </Button>
              </Modal.Actions>
            </Form>

          </Modal.Content>

        </Modal>
      </Fragment >
    )
  }

}

export default recordList;
