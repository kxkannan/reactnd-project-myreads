import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Book from './Book'

class BookList extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    shelf: PropTypes.string.isRequired,
    onShelfChange: PropTypes.func.isRequired
  }


  render() {
    const {books, onShelfChange} = this.props
    const {shelf} = this.props

    let booksOnShelf

    if (shelf && shelf !== "none") {
      booksOnShelf = books.filter((book) => book.shelf === shelf)
    } else {
      booksOnShelf = books
    }

    return (
      <div className="bookshelf-books">
        <ol className="books-grid">
          {booksOnShelf.map((book) => (
            <li key={book.id}>
              <Book book={book} onShelfChange={onShelfChange} />
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
