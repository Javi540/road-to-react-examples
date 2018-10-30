import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'react';
const DEFAULT_HPP = '10';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const largeColumn = {
  width: '40%',
  paddingLeft: '15px',
};
const midColumn = {
  width: '30%',
  paddingLeft: '15px',
};
const smallColumn = {
  width: '10%',
  paddingLeft: '15px',
};
//const url =`${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`


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

const Search = ({value, onChange, onSubmit, children}) => {
  return(
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange}/>
      <button type="submit">{children}</button>
    </form>)
}


const Table =({list, onDismiss }) => {
console.log(list)
  return (
    <div className="table">
      {list.map((item,key) =>
        <div key={key} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title} </a>
            </span>
          <span style={midColumn}>{item.author}</span>
          <span style={smallColumn}>{item.num_comments}</span><span/>
          <span style={smallColumn}>{item.points}</span><span/>
          <span style={smallColumn}><span/>
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
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    };

  }

  needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];



  setSearchTopStories = result =>{

    const {hits, page} = result;

    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [...oldHits,...hits];
    this.setState({results: {...results, [searchKey]:{hits:updatedHits,page}}}); //accedemos al campo result del state y como tienen el mismo nombre no es necesario poner {result : result}

  }

  fetchSearchTopStories = (searchTerm,page = 0) =>{
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => this.setState({error}));
  }
  onSearchChange = event => {
    console.log(event.target.value)
    this.setState({searchTerm: event.target.value})

  }
  onDismiss = id => {

    const { searchKey, results } = this.state;
    const {hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;

    const updatedHits = hits.filter(isNotId);

    this.setState({results: {...results, [searchKey]: {hits: updatedHits, page}}});//para hacer un merge conservando propiedades
  }

  onSearchSubmit = (event) =>{
    const {searchTerm} = this.state
    console.log(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    this.setState({searchKey: searchTerm})
    if (this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm)
    }
    event.preventDefault()

  }

  componentDidMount() {
    const {searchTerm} = this.state;
    console.log(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }




  render() {
    const { searchTerm, results, searchKey, error } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0; //checkeamos si hay results, si existe results[searchKey] comoprobamos si tiene el atributo.page y nos quedamos
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="App">
        <header className="App-header">
          <div className="page">

            <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>Search</Search>
            <Button onClick ={() => this.fetchSearchTopStories(searchKey, page +1)}> MOAR</Button>

          </div>
          {error ? <div className="interactions"> Something went wrong</div>:
          <Table list={list} onDismiss={this.onDismiss} />}
          <img src={logo} className="App-logo" alt="logo" />

        </header>
      </div>
    );
  }
}

export default App;
