import React, { Component} from 'react'
import logo from '../../logo.svg';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner,faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import * as constants from '../../constants/index.js'
import './index.css'
import {Button} from '../Button'
import {Search} from '../Search'
import {Table} from '../Table'
import {Loading} from '../Loading'
import {Error} from '../Error'

library.add(faSpinner)
library.add(faArrowUp)
library.add(faArrowDown)





//separamos las propiedades porque nuestro componente boton no necesita la propiedad isloading
const withLoading = (Component) => ({isLoading, ...rest}) =>
  isLoading
    ?<Loading/>
    :<Component{...rest}/>

const ButtonWithLoading = withLoading(Button);


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
      searchTerm: constants.DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };

  }

  needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];


  setSearchTopStories = result => {
    const { hits, page } = result;
    this.setState(this.updateSearchTopStoriesState(hits,page)) // si necesitamos actualizar el valor del state usando el valor previo tenemos que usar una llamada a funcion, porque sin podemos tener problemas de consistencia
  }

  updateSearchTopStoriesState = (hits,page) => prevState => {
    const {searchKey, results} = prevState
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [] // condicion if si se cumple lo de antes del ? devuelve resutls[searchKey].hits, sino se cumple devolvemos lo de despues del :
    const updatedHits = [...oldHits, ...hits]
    return {
      results: {...results, [searchKey]: {hits: updatedHits, page}}, isLoading: false
    }

  }

  fetchSearchTopStories = (searchTerm,page = 0) =>{
    this.setState({isLoading: true });
    fetch(`${constants.PATH_BASE}${constants.PATH_SEARCH}?${constants.PARAM_SEARCH}${searchTerm}&${constants.PARAM_PAGE}${page}&${constants.PARAM_HPP}${constants.DEFAULT_HPP}`)
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
    event.preventDefault() // para evitar un refreshh de la pagina cuando hacemos click en el boton submit

  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }


  render() {
    const { searchTerm, results, searchKey, error, isLoading} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0; //checkeamos si hay results, si existe results[searchKey] comoprobamos si tiene el atributo.page y nos quedamos
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="App">
        <header className="App-header">
          <div className="page">

            <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>Search</Search>
            <ButtonWithLoading isLoading={isLoading} onClick ={() => this.fetchSearchTopStories(searchKey, page +1)}> More</ButtonWithLoading>

            <TableWithErrorHandler error={error} list={list}  onDismiss={this.onDismiss} />
          </div>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );
  }
}
export {App};
