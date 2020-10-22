import React, { Component, Fragment } from "react";
import {Grid, Image, Icon} from 'semantic-ui-react';

class Header extends Component {

  render(){
    return (
      <Grid className='app-header'>
        <Grid.Column width='16'>
              <Image size='tiny' centered src='https://devza.com/images/devza_logo.png' />
              <Icon name='user' floated='right' />
        </Grid.Column>

      </Grid>
    )
  }

}

export default Header;
