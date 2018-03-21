import React, { Component } from 'react';
import classNames from 'classnames';
import './Catalog.css';
import PropTypes from 'prop-types';




class Catalog extends Component{
  constructor(props){
    super(props);
    this.state={
      clicked: 0,
    };
    this.catalogClick = this.catalogClick.bind(this);
  }
  
  catalogClick(key){
    this.setState({clicked: key});
    this.props.transferFromChild(key);
  }
  render(){
    const {clicked} = this.state,
      names = ['介绍','整体结构','类型判断','函数构建','代码技巧','有用的技术'];
    return (
      <ul className="sideNav">
        {
            names.map((name, index)=>{
              return <li onClick={() => this.catalogClick(index)} className={classNames({'catalog-click': clicked == index})} key={index}>{name}</li>;
          })
        }
      </ul>
    );
  }
}

Catalog.PropTypes ={
  transferFromChild: PropTypes.func.isRequired
};

export { Catalog };