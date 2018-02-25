import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import classNames from 'classnames';


const Reference = () =>       
  <div className="headWrapper">
    <div className="headNav">underscore源码学习</div>
    <ul className="headNav">
      <li><a href="http://underscorejs.org/" target="_blank">underscore API</a></li>
      <li><a href="https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js" target="_blank">underscore 源码</a></li>
      <li><a href="https://github.com/hanzichi/underscore-analysis" target="_blank">underscore 源码分析</a></li>
    </ul>
  </div>;


class Content extends Component{
  constructor(props){
    super(props);
    this.state={
      clicked: 0,
    };
    this.contentClick = this.contentClick.bind(this);
  }
  
  contentClick(e){
    e.stopPropagation();
    console.log(e.target);
    const key = e.target.getAttribute('key');
    this.setState({clicked: key});
  }
  render(){
    const {clicked} = this.state;
    return (
      <ul className="sideNav">
        <li onClick={() => this.contentClick()} className={classNames({'content-click': clicked == 0})} key="0">介绍</li>
        <li onClick={() => this.contentClick()} className={classNames({'content-click': clicked == 1})} key="1">类型判断</li>
        <li onClick={() => this.contentClick()} className={classNames({'content-click': clicked == 2})} key="2">内部函数</li>
        <li onClick={() => this.contentClick()} className={classNames({'content-click': clicked == 3})} key="3">函数构造</li>
        <li onClick={() => this.contentClick()} className={classNames({'content-click': clicked == 4})} key="4">算法</li>
        <li onClick={() => this.contentClick()} className={classNames({'content-click': clicked == 5})} key="5">技巧</li>
      </ul>
    );
  }
}

class App extends Component {
  // constructor(props){
  //   super(props){
  //     this.state = {

  //     }
  //   };

  // }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Reference />
        </header>
        <div className="contentWrapper">
          <div className="side pull-left"><Content /></div>
          <div className="content pull-right"></div>
        </div>
      </div>
    );
  }
}

export default App;
