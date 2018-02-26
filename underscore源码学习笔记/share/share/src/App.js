import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Cases} from './data'

import classNames from 'classnames';


const Reference = () =>       
  <div className="headWrapper">
    <div className="headNav">underscore源码学习</div>
    <ul className="headNav">
      <li><a href="http://underscorejs.org/" target="_blank">underscore API</a></li>
      <li><a href="https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js" target="_blank">underscore 源码</a></li>
      <li><a href="https://github.com/hanzichi/underscore-analysis" target="_blank">underscore 源码分析</a></li>
      <li><a href="https://codepen.io/ginnko/pen/zRZJZN" target="_blank">underscore 使用演示</a></li>
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
  
  contentClick(key){
    this.setState({clicked: key});
    this.props.transferFromChild(key);
  }
  render(){
    const {clicked} = this.state;
    return (
      <ul className="sideNav">
        <li onClick={() => this.contentClick(0)} className={classNames({'content-click': clicked == 0})} key="0">介绍</li>
        <li onClick={() => this.contentClick(1)} className={classNames({'content-click': clicked == 1})} key="1">类型判断</li>
        <li onClick={() => this.contentClick(2)} className={classNames({'content-click': clicked == 2})} key="2">内部函数</li>
        <li onClick={() => this.contentClick(3)} className={classNames({'content-click': clicked == 3})} key="3">函数构造</li>
        <li onClick={() => this.contentClick(4)} className={classNames({'content-click': clicked == 4})} key="4">算法</li>
        <li onClick={() => this.contentClick(5)} className={classNames({'content-click': clicked == 5})} key="5">技巧</li>
      </ul>
    );
  }
}

const Route = ({clicked}) => {
  if(clicked == 0){
    return <Card clicked={clicked}/>;
  }else if(clicked == 1){
    return <Card clicked={clicked}/>;
  }else if(clicked == 2){
    return <Card clicked={clicked}/>;
  }else if(clicked == 3){
    return <Card clicked={clicked}/>;
  }else if(clicked == 4){
    return <Card clicked={clicked}/>;
  }else{
    return <Card clicked={clicked}/>;
  }
}

const Card = ({clicked}) => {
  const showCase = Cases[clicked];
  showCase.map((item) => {
    console.log(item);
  });
  return(
    <div>
    {
     showCase.map((item, index) => {
      <div key={index + item['title']}>
        <p className="case-title">{item['title']}</p>
        <p className="case-content">{item['content']}</p>
      </div>
     })

     }
    }
    </div>
  );
}

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
          <div className="side"><Content transferFromChild={this.modifyClicked} /></div>
          <div className="content">< Route clicked={clicked} /></div>
        </div>
      </div>
    );
  }
}



export default App;


