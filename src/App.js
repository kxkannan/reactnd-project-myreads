import React from 'react'
import * as BooksAPI from './BooksAPI'
import {Route} from 'react-router-dom'
import {Link} from 'react-router-dom'
import './App.css'
import BookList from './BookList'
import SearchBooks from './SearchBooks'

class BooksApp extends React.Component {
  state = {
    query: '',
    newShelf: '',
    searchResults: [],
    searchResultBooks: [],
    books: []
  }

  /**
   * Load all the books from the server into the books state so the landing page can show the current state of the
   * books.
   */
  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({
        books: books.map((resultBook) => (
                {
                  id: resultBook.id,
                  title: resultBook.title,
                  author: (resultBook.authors && resultBook.authors.length > 0) ? resultBook.authors.join(", ") : "",
                  shelf: resultBook.shelf,
                  backgroundImage: resultBook.imageLinks.thumbnail
                }
            )
        )
      })
    })
  }


  /*
   *   Move the selected book to the selected bookshelf.
   *
   *   Moving from search results page will remove it from the search results and add it to the selected bookshelf
   *
   *   Update the server with the selected book and shelf.
   */
  moveToList = (book_id, book_shelf, event) => {

    let selectedBook
    let newBookList

    this.setState( { newShelf: event.target.value } )

    if (book_shelf != "searchResults") {
      selectedBook = this.state.books.filter((book) => book.id == book_id)[0]

      this.setState((state, props) => {
        selectedBook = this.state.books.filter((book) => book.id == book_id)[0]
        selectedBook.shelf = state.newShelf
      })
    }
    else {  /* handle search results selection */

      selectedBook = this.state.searchResultBooks.filter((book) => book.id == book_id)[0]
      selectedBook.shelf = event.target.value
      newBookList = this.state.books.slice()
      newBookList.push(selectedBook)

      let updatedSearchList
      updatedSearchList = this.state.searchResultBooks.filter((book) => book.id != selectedBook.id)

      this.setState((state, props) => ({books: newBookList}))
      this.setState((state, props) => ({searchResultBooks: updatedSearchList}))

    }

    BooksAPI.update(selectedBook, event.target.value)
  }

  /*
   * determine the shelf based on the bookId. If it's not on any shelf return
   * "searchResults" as the shelf name
   */
  getShelf = bookId => {
    var result = this.state.books.filter( (book) => (book.id == bookId))[0]
    var shelfName = result ? result.shelf : "searchResults"
    return shelfName
  }

  /*
   *   Query the server for the books based on the query term - title or author.
   *
   *   Map the server search result book to the book object used in this project and also set the shelf to
   *   searchResults
   *
   *   Filter the search results and show only the books that are already not on the shelf
   *
   *   It is limited to showing only 25 results.
   *
   */
  queryBooks = (query) => {
    this.setState({query: query.trim()})

    if (this.state.query.length > 0) {
      BooksAPI.search(query.trim(), 25).then((searchResults) => {
        this.setState({searchResults})

        if (this.state.searchResults.length > 0) {
          this.setState((previousState) => ({

            searchResultBooks: this.state.searchResults.
                                  map((resultBook) => (
                                    {
                                      id: resultBook.id,
                                      title: resultBook.title,
                                      author: (resultBook.authors && resultBook.authors.length > 0) ? resultBook.authors.join(", ") : "",
                                      shelf:  this.getShelf(resultBook.id),
                                      backgroundImage: resultBook.imageLinks.thumbnail
                                    }
                                   )
                                  )
          }))
        }
      })
    }
  }


  /*
   *   Render the main landing page with the book shelves and the search button at the bottom.
   *
   */
  render() {
    return (
        <div className="app">

          <Route exact path="/" render={() => (
              (
                  <div className="list-books">
                    <div className="list-books-title">
                      <h1>MyReads</h1>
                    </div>
                    <div className="list-books-content">
                      <div>
                        <div className="bookshelf">
                          <h2 className="bookshelf-title">Currently Reading</h2>
                          <BookList books={this.state.books} onShelfChange={this.moveToList}
                                    shelf="currentlyReading"/>
                        </div>
                        <div className="bookshelf">
                          <h2 className="bookshelf-title">Want to Read</h2>
                          <BookList books={this.state.books} onShelfChange={this.moveToList}
                                    shelf="wantToRead"/>
                        </div>
                        <div className="bookshelf">
                          <h2 className="bookshelf-title">Read</h2>
                          <BookList books={this.state.books} onShelfChange={this.moveToList}
                                    shelf="read"/>
                        </div>
                      </div>
                    </div>
                    <div className="open-search">
                      <Link to="/search">Add a book</Link>
                    </div>
                  </div>
              )
          )}/>

          <Route path="/search" render={() => (
              <SearchBooks onQueryChange={this.queryBooks} query={this.state.query} onShelfChange={this.moveToList}
                           books={this.state.searchResultBooks}/>
          )}/>
        </div>

    )
  }
}


export default BooksApp
