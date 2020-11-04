import React, { Component, Fragment } from "react";
import { Grid, Image, Icon, Card, List, Button } from 'semantic-ui-react';
import logo from '../images/zoomrx.png';
import Service from "../scripts/Service";
import moment from 'moment';


class Cards extends Component {

  constructor(props) {
    super(props);

    this.state = {
      Service: new Service(),
    }
  }


  deleteCard(title, key, listKey) {
    this.state.Service.deleteCard(title, key, listKey);
    this.props.refresh();
  }

  editCard(title, key, listKey) {
    this.props.editCard(title, key, listKey);
  }

  onDrag(flag, cardKey) {
    this.props.onDrag(flag, cardKey)
  }


  render() {
    return (
      <Fragment>
        {
          this.props.data.length > 0 && this.props.data.map((cardData, key) => {

            return (
              <Card className='task-list-card' fluid draggable="true"  onDrag={(event) => this.onDrag(this.props.listKey, key)} >
                <Card.Content>
                  <Card.Header>{cardData.title}
                    <div className='task-action-bar'>
                      <Button title='Delete Card' className='float-right delete-task' circular icon='trash' onClick={() => this.deleteCard(cardData.title, key, this.props.listKey)} />
                      <Button title='Edit Card' className='float-right edit-task' circular icon='pencil' onClick={() => this.editCard(cardData.title, key, this.props.listKey)} />
                    </div>
                  </Card.Header>
                  <List as='ul'>
                    {cardData.comments.map((comments, key) => {
                      return (
                        <List.Item as='li'>
                          <div className='comments'>{comments.comments}</div>
                          <div className='comments-time'>
                            {moment(comments.dateTime).format('DD MMM YYYY h:ss A')}
                          </div>
                        </List.Item>
                      )
                    })
                    }
                  </List>
                </Card.Content>

              </Card>
            )

          })

        }

      </Fragment>

    )
  }

}

export default Cards;
