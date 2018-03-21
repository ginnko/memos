import React from 'react';
import {Cases} from '../data';
import './Card.css';
import PropTypes from 'prop-types';


const MakeTitle = ({title, index}) =>{
  console.log("title:8888", title);
  return <p className="case-title"><span>{index >= 0 ? index+1 : ''}</span>{title ? '.' + title : ''}</p>;
}
const MakeContent = ({content}) =>
  <pre className="case-content">{content ? content : ''}</pre>;

const MakeCode = ({code}) =>
  <pre className="case-code">{code ? code : ''}</pre>;

const MakeLink = ({link, linkName}) =>
  <p className="case-link"><a href={link}>{linkName ? linkName : ''}</a></p>

const selectEle = (piece, index) => {
  let wrapper = [];
  for(let item in piece){
    switch(String(item)){
      case 'title':
        wrapper.push(<MakeTitle title={piece.title} index={index} />);
        break;
      case 'content':
        wrapper.push(<MakeContent content={piece.content}/>);
        break;
      case 'code':
        wrapper.push(<MakeCode code={piece.code}/>);
        break;
      case 'linkName':
         wrapper.push(<MakeLink link={piece.link} linkName={piece.linkName}/>);
        break;
      default:
        break;
    }
  }
  return wrapper;
};

const Card = ({clicked}) => {
  const showCase = Cases[clicked];
  if(!showCase){
    return '';
  }
  return(
    <div className="piece">
    {
     showCase.map((item, index) => 
      <div key={index + item['title']}>
        {
          selectEle(item, index)
        }
      </div>
     )
    }
    </div>
  );
}

Card.PropTypes = {
  clicked: PropTypes.number.isRequired
};

MakeTitle.PropTypes = {
  title: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
};

MakeContent.PropTypes = {
  content: PropTypes.string.isRequired
};

MakeCode.PropTypes = {
  code: PropTypes.string.isRequired
};

MakeLink.PropTypes = {
  link: PropTypes.string.isRequired,
  linkName: PropTypes.string.isRequired
};

export { Card };