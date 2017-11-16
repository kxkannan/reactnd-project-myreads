import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import BookList from './BookList'

class SearchBooks extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    onShelfChange: PropTypes.func.isRequired,
    books: PropTypes.array.isRequired
  }


  render() {
    const {onQueryChange, onShelfChange} = this.props
    const { books, query } = this.props

    return (
      /* search input */
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">Close</Link>
          <div className="search-books-input-wrapper">
            <input type="text"
                   placeholder="Search by title or author"
                   value={query}
                   onChange={(event) => onQueryChange(event.target.value)}
            />
          </div>
          <div>{ (query.length > 0 ) ? "Your search matched " + books.length + " books" : ""}</div>
        </div>

        /* search results */
        <div className="search-books-results">
          <BookList books={books} onShelfChange={onShelfChange} shelf="none"/>
          <div>
            <Link to="/">Return to Book Shelf</Link>
          </div>
        </div>
      </div>

    )
  }
}

SearchBooks.propTypes = {
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  onShelfChange: PropTypes.func.isRequired,
  books: PropTypes.array.isRequired
}


export default SearchBooks
