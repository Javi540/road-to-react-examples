import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
  {
    title: 'Clean Code',
    url: 'https://www.investigatii.md/uploads/resurse/Clean_Code.pdf',
    author: 'Robert C. Martin',
    num_comments: 5,
    objectID: 2,
  }
];

const list2 = [
  {
    title: 'Clean Code',
    url: 'https://www.investigatii.md/uploads/resurse/Clean_Code.pdf',
    author: 'Robert C. Martin',
    num_comments: 5,
    objectID: 0,
  }
];


function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());


class Button extends Component {
  render(){
    const {
      onClick,
      className = '',
      children,
    } = this.props;

    return (
      <button onClick={onClick} className={className} type="button">{children}</button>
    );
  }
}

const Search = ({value, onChange, children}) => {
  return(
  <form>
    {children} <input type="text" value={value} onChange={onChange}/>
  </form>)
}

const largeColumn = {
  width: '40%',
};

const midColumn = {
  width: '30%',
};

const smallColumn = {
  width: '10%',
};


const Table =({list, pattern, onDismiss }) => {

    return (
      <div className="table">
        {list.filter(isSearched(pattern)).map((item,key) =>
          <div key={key} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
              <Button onClick={()=>onDismiss(item.objectID)} className="button-inline"> Dismiss</Button>
            </span>
          </div>
        )}
      </div>
    );
}



class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      list,
      searchTerm: '',
    }

  }
// para las funciones si queremos hacerlas funcion de clase usar function() con .bind(this) en el constructor o sino arrow functions
  onDismiss = (id) => {
    const updatedList = this.state.list.filter(item => item.objectID !== id)
    this.setState({list: updatedList})
  }


  /*componentDidMount(){
    this.setState({list : list2})
  }*/
  onSearchChange = event => {
    this.setState({searchTerm: event.target.value})

  }

  render() {
    const {searchTerm,list} = this.state;
    return (
      <div className="page">
        <header className="interactions">
          <Search value={searchTerm} onChange={this.onSearchChange}>Search</Search>
          <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />


          <Welcome name={"Sara"}/>

          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Hola Mundo
          </p>
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
