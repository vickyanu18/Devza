import React, { Component, Fragment } from "react";
import { Grid, Image, Icon } from 'semantic-ui-react';
import _, { isObject } from 'lodash';


class Service extends Component {

  Post(data) {

    localStorage.setItem('lists', JSON.stringify(data))
  }

  Get() {
    return localStorage.getItem('lists');
  }

  newCard(tempArr, data) {
    var listData = {};
    listData.title = data.title;
    listData.comments = [];
    listData.comments.push({ comments: data.comments, dateTime: new Date() })
    tempArr.push(listData);
    return tempArr;
  }

  checkRecord(tempArr, data) {
    return tempArr.some(ele => ele.title === data.title);
  }

  createCard(data, key) {
    var getCardList = JSON.parse(this.Get());
    if (getCardList[key].length == 0) {
      getCardList[key] = this.newCard(getCardList[key], data);
    } else {
      let found = this.checkRecord(getCardList[key], data);

      if (found) {
        getCardList[key].map((cardData, index) => {
          if (cardData.title === data.title) {
            cardData.comments.push({ comments: data.comments, dateTime: new Date() })
          }
        })
      } else {
        this.newCard(getCardList[key], data);
      }
    }

    this.Post(getCardList);

  }


  deleteCard(title, cardKey, listKey) {
    var getCardList = JSON.parse(this.Get());
    getCardList[listKey].map((data, key) => {
      if (cardKey == key) {
        console.log(data)
        getCardList[listKey].splice(key, 1);
      }
    });

    this.Post(getCardList);
  }

  deleteList(key) {
    var getCardList = JSON.parse(this.Get());
    getCardList.splice(key, 1);
    this.Post(getCardList);
  }

  dragDrop(dragKey, dropKey, cardKey) {
    console.log(dragKey, dropKey)
    let getCardList = JSON.parse(this.Get());
    console.log(getCardList[dragKey][cardKey]);
    // if (dragKey && dropKey) {
      getCardList[dropKey].push(getCardList[dragKey][cardKey]);
      getCardList[dragKey].splice(cardKey, 1);
    // }

    this.Post(getCardList);


  }

}

export default Service;