import React, { Component } from 'react';

// IMPORT CSS FILE
import 'semantic-ui-css/semantic.min.css'
import './styles/App.scss';
import './styles/Header.scss';
import './styles/AppBody.scss';
import './styles/TaskList.scss';

// IMPORT COMPONENTS
import Header from './components/Header';
import AppBody from './components/AppBody';



class App extends Component {
  render() {
    return (<div className="App">
      <Header />
      <AppBody />
    </div>)
  }
}

export default App;
