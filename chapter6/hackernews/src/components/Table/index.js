import { Component } from 'react'
import * as constants from '../../constants'
import { Sort } from '../Sort'
import { Button } from '../Button'
import React from 'react'

class Table extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sortKey : 'NONE',
      isSortReverse: false,
    }
  }
  onSort = sortKey =>{
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({sortKey, isSortReverse })
  }

  render (){

    const {list, onDismiss} = this.props
    const {sortKey, isSortReverse} = this.state

    const  sortedList = constants.SORTS[sortKey](list)
    const  reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;

    return (
      <div className="table">
        <div className="table-header">

        <span style={constants.largeColumn}>
          <Sort sortKey={'TITLE'} onSort ={this.onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>
            Title
          </Sort>
        </span>

          <span style={constants.midColumn}>
          <Sort sortKey={'AUTHOR'} onSort ={this.onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>
            Author
          </Sort>
        </span>

          <span style={constants.smallColumn}>
          <Sort sortKey={'COMMENTS'} onSort ={this.onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>
            Comments
          </Sort>
        </span>

          <span style={constants.smallColumn}>
          <Sort sortKey={'POINTS'} onSort ={this.onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>
            Points
          </Sort>
        </span>

        </div>
        <br/>
        {reverseSortedList.map((item,key) =>
          <div key={key} className="table-row">
            <span style={constants.largeColumn}>
              <a href={item.url}>{item.title} </a>
            </span>
            <span style={constants.midColumn}>{item.author}</span>
            <span style={constants.smallColumn}>{item.num_comments}</span><span/>
            <span style={constants.smallColumn}>{item.points}</span><span/>
            <span style={constants.smallColumn}><span/>
              <Button onClick={()=>onDismiss(item.objectID)} className="button-inline"> Dismiss</Button>
            </span>
          </div>
        )}
      </div>
    );
  }
}
export {Table}