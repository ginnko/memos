import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Reference extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="headWrapper">
        <div className="headNav">underscore源码学习</div>
        <ul className="headNav">
          <li><a href="http://underscorejs.org/" target="_blank">underscore API</a></li>
          <li><a href="https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js" target="_blank">underscore 源码</a></li>
          <li><a href="https://github.com/hanzichi/underscore-analysis" target="_blank">underscore 源码分析</a></li>
        </ul>
      </div>
    );
  }
}

class Content extends Component{
  render(){
    return (
        <ul className="sideNav">
          <li><a href="javascript: void 0">介绍</a></li>
          <li><a href="javascript: void 0">类型判断</a></li>
          <li><a href="javascript: void 0">内部函数</a></li>
          <li><a href="javascript: void 0">函数构造</a></li>
          <li><a href="javascript: void 0">算法</a></li>
          <li><a href="javascript: void 0">技巧</a></li>
        </ul>
    )
  }
}

class App extends Component {
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
