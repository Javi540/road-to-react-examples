import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Clock from './Clock'



const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];


class App extends Component {
  render() {
    const helloWorld = {
      text: 'Change'
    };
    helloWorld.text='Welcome to the Road to learn React'

    function formatName(user) {
      return `Bienvenido ${user.name} ${user.surname} `;
    }


    const user = {name:'Javier', surname:'Gutierrez'};

    return (
      <div className="App">
         <header className="App-header">
           <h3>{helloWorld.text}</h3>
           <p>{formatName(user)}</p>
           {list.map(item =>
             <div key={item.objectID}>
             <span>
             <a href={item.url}>{item.title}</a>
             </span>
             <span>{item.author}</span>
             <span>{item.num_comments}</span>
             <span>{item.points}</span>
             </div>)}

           <img src={logo} className="App-logo" alt="logo" draggable="false" />
           <Clock></Clock>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );

  }
}

export default App;
