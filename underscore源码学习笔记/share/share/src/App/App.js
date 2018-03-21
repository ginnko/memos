import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './App.css';
import { Reference } from '../Reference';
import { Catalog } from '../Catalog';
import { Card } from '../Card'


class App extends Component {
  constructor(props){
  super(props);
  this.state = {
    clicked: 0,
  };
  this.modifyClicked = this.modifyClicked.bind(this);
  }

  modifyClicked(clicked){
    this.setState({clicked});
  }

  render() {
    const {clicked} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <Reference />
        </header>
        <div className="contentWrapper">
          <div className="side"><Catalog transferFromChild={this.modifyClicked} /></div>
          <div className="content"><Card clicked={clicked}/></div>
        </div>
      </div>
    );
  }
}



export default App;


