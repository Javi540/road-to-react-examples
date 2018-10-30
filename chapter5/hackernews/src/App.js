import React, { Component, Fragment } from 'react'
import logo from './logo.svg';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner,faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { sortBy } from "lodash"
import classNames from 'classnames'
import './App.css';
library.add(faSpinner)
library.add(faArrowUp)
library.add(faArrowDown)



const DEFAULT_QUERY = 'react';
const DEFAULT_HPP = '10';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list,'title'),
  AUTHOR: list => sortBy(list,'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()
};

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


const Button =({onClick, className,children}) => {

  return (
    <button onClick={onClick} className={className} type="button">{children}</button>
  );

}

const Search = ({value, onChange, onSubmit, children}) => {
  let input
  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} ref={el => input = el}/><label> </label>
      <button type="submit">{children}</button>
    </form>
  )
}

/*class Search extends Component {

  componentDidMount(){
    if (this.input) {
      this.input.focus();
    }
  }
  render() {
    const {
      value,
      onChange,
      onSubmit,
      children
    } = this.props

    return (
      <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange} ref={el => this.input = el}/>
        <button type="submit">{children}</button>
      </form>)
  }
}*/
const Sort =({sortKey, onSort, activeSortKey, children, isSortReverse }) => {

  const sortClass = classNames('button-inline',
    { 'button-active': sortKey === activeSortKey });

  const icn = isSortReverse
    ? "arrow-up"
    : "arrow-down"

  /*if (sortKey === activeSortKey){
    sortClass.push('button-active');
  }*/
  return (<Fragment><Button onClick={()=> onSort(sortKey)} className ={sortClass}><FontAwesomeIcon icon={icn} /> {children} </Button></Fragment>)
}

const Table =({list, sortKey, isSortReverse, onSort, onDismiss }) => {

  const  sortedList = SORTS[sortKey](list);
  const  reverseSortedList = isSortReverse
    ? sortedList.reverse()
    : sortedList;
  return (
    <div className="table">
      <div className="table-header">

        <span style={largeColumn}>
          <Sort sortKey={'TITLE'} onSort ={onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>
            Title
          </Sort>
        </span>

        <span style={midColumn}>
          <Sort sortKey={'AUTHOR'} onSort ={onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>
            Author
          </Sort>
        </span>

        <span style={smallColumn}>
          <Sort sortKey={'COMMENTS'} onSort ={onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>
            Comments
          </Sort>
        </span>

        <span style={smallColumn}>
          <Sort sortKey={'POINTS'} onSort ={onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>
            Points
          </Sort>
        </span>

        <span style={smallColumn}>
          Archive
        </span>
      </div>
      <br/>
      {reverseSortedList.map((item,key) =>
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

const Loading = () =>
  <div><FontAwesomeIcon icon="spinner" spin /></div>

//separamos las propiedades porque nuestro componente boton no necesita la propiedad isloading
const withLoading = (Component) => ({isLoading, ...rest}) =>
  isLoading
    ?<Loading/>
    :<Component{...rest}/>

const ButtonWithLoading = withLoading(Button);

const Error =() =>
  <div className="interactions"> Something went wrong</div>

const withErrors = (Component) => ({error, ...rest}) =>
  error
    ?<Error/>
    :<Component{...rest}/>

const TableWithErrorHandler = withErrors(Table);


class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      sortKey:'NONE',
      isSortReverse: false,
    };

  }

  onSort = sortKey =>{
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({sortKey, isSortReverse })
  }

  needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];



  setSearchTopStories = result =>{

    const {hits, page} = result;

    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [...oldHits,...hits];
    this.setState({results: {...results, [searchKey]:{hits:updatedHits,page}}, isLoading: false }); //accedemos al campo result del state y como tienen el mismo nombre no es necesario poner {result : result}

  }

  fetchSearchTopStories = (searchTerm,page = 0) =>{
    this.setState({isLoading: true });
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => this.setState({error}));
  }
  onSearchChange = event => {
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
    this.setState({searchKey: searchTerm})
    if (this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm)
    }
    event.preventDefault()

  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }


  render() {
    const { searchTerm, results, searchKey, error, isLoading, sortKey, isSortReverse} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0; //checkeamos si hay results, si existe results[searchKey] comoprobamos si tiene el atributo.page y nos quedamos
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="App">
        <header className="App-header">
          <div className="page">

            <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>Search</Search>
              <ButtonWithLoading isLoading={isLoading} onClick ={() => this.fetchSearchTopStories(searchKey, page +1)}> More</ButtonWithLoading>

            <TableWithErrorHandler error={error} list={list} sortKey={sortKey} isSortReverse={isSortReverse} onSort={this.onSort} onDismiss={this.onDismiss} />
          </div>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );
  }
}
export default App;

export {
  Button,
  Search,
  Table
};