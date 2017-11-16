import React, {Component} from 'react'
import PropTypes from 'prop-types'

class Book extends Component {

  static propTypes = {
    book: PropTypes.object.isRequired,
    onShelfChange: PropTypes.func.isRequired
  }


  render() {
    const { book } = this.props
    const { onShelfChange } = this.props

    let defaultCover = "http://via.placeholder.com/128x193?text=No%20Cover"

    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{
            width: 128,
            height: 193,
            backgroundImage: "url(" + (book.imageLinks ? book.imageLinks.thumbnail : defaultCover) + ")"
          }}>
        </div>
        <div className="book-shelf-changer">
          <select onChange={(e) => onShelfChange(book.id, book.shelf, e)} value={book.shelf}>
            <option value="moveTo" disabled>Move to...</option>
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
   )
}

}

export default Book
