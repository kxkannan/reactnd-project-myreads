import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class BookList extends Component {
  static PropTypes = {
    books: PropTypes.array.isRequired,
    shelf: PropTypes.string.isRequired,
    onShelfChange: PropTypes.func.isRequired
  }

  state = {
    query: '',
    newShelf: ''
  }

  render() {
    const {books, onShelfChange} = this.props
    const {shelf} = this.props
    const {query} = this.state

    let booksOnShelf
    if (shelf && shelf != "searchResults") {
      booksOnShelf = books.filter((book) => book.shelf == shelf)
    } else {
      booksOnShelf = books
    }

    return (
        <div className="bookshelf-books">


          <ol className="books-grid">
            {booksOnShelf.map((book) => (
                <li key={book.id}>
                  <div className="book">
                    <div className="book-top">
                      <div className="book-cover" style={{
                        width: 128,
                        height: 193,
                        backgroundImage: "url(" + book.backgroundImage + ")"
                      }}></div>
                      <div className="book-shelf-changer">
                        <select onChange={(e) => onShelfChange(book.id, book.shelf, e)} value={shelf}>
                          <option value="none" disabled>Move to...</option>
                          <option value="currentlyReading">Currently Reading</option>
                          <option value="wantToRead">Want to Read</option>
                          <option value="read">Read</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                    </div>
                    <div className="book-title">{book.title}</div>
                    <div className="book-authors">{book.author}</div>
                  </div>
                </li>
            ))}
          </ol>
        </div>
    )
  }
}

BookList.propTypes = {
  onShelfChange: PropTypes.func.isRequired,
  books: PropTypes.array.isRequired,
  shelf: PropTypes.string.isRequired
}

export default BookList
