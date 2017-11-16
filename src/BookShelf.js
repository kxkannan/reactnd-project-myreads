import React from 'react'
import PropTypes from 'prop-types'
import BookList from './BookList'

class BookShelf extends React.Component {

  static propTypes = {
    books:          PropTypes.array.isRequired,
    onShelfChange:  PropTypes.func.isRequired,
    shelf:          PropTypes.string.isRequired,
    title:          PropTypes.string.isRequired
  }

  render() {

    const { title, books, onShelfChange, shelf } = this.props

    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{title} ({books.length})</h2>
        <BookList books={books} onShelfChange={onShelfChange} shelf={shelf} />
      </div>
    )

  }

}

export default BookShelf