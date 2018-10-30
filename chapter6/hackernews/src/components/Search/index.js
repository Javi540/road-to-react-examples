import React from 'react'


const Search = ({value, onChange, onSubmit, children}) => {
  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} /><label> </label>
      <button type="submit">{children}</button>
    </form>
  )
}

export {Search}