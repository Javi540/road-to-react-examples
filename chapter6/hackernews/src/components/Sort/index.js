import classNames from 'classnames'
import { Fragment } from 'react'
import { Button } from '../Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const Sort =({sortKey, onSort, activeSortKey, children, isSortReverse }) => {

  const equalSortKey = sortKey === activeSortKey
  const sortClass = classNames('button-inline',
    { 'button-active': equalSortKey }) // Esto lo que hace es asocia a button-inline, button-active en caso de que se cumpla la condicion despues de los :

  const icn = (isSortReverse && equalSortKey)
    ? "arrow-up"
    : "arrow-down"

  return (<Fragment><Button onClick={()=> onSort(sortKey)} className ={sortClass}><FontAwesomeIcon icon={icn} /> {children} </Button></Fragment>)
}
export {Sort}