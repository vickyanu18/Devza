import React, { Component, Fragment } from "react";
import { Grid, Image, Icon } from 'semantic-ui-react';
import axios from "axios";


var serviceURL = 'https://devza.com/tests/tasks';
var authToken = '49TmonqicPZ6kocsftiDrVa0U48cXvhM';


class Service extends Component {

  Post(url, data) {
    return axios({
      url: `${serviceURL}/${url}`,
      method: 'post',
      data: data,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'AuthToken': authToken
      },
    }).then(res => {
    }).catch(error => {
    });

  }

  Get(url) {
    return axios({
      url: `${serviceURL}/${url}`,
      method: 'get',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'AuthToken': authToken
      },
    }).then(function (res) {
      return res.data;
    }).catch(function(res){
    });

  }

}

export default Service;