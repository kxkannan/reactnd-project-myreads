import React from 'react'
import * as BooksAPI from './BooksAPI'
import {Route} from 'react-router-dom'
import {Link} from 'react-router-dom'
import { Switch } from 'react-router-dom'
import './App.css'
import BookList from './BookList'
import SearchBooks from './SearchBooks'
import NoMatch from './NoMatch'

class BooksApp extends React.Component {
  state = {
    query: '',
    searchResults: [],
    books: []
  }

  /**
   * Load all the books from the server into the books state so the landing page can show the current state of the
   * books.
   */
  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
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
    let movedToShelf

    movedToShelf = event.target.value
    console.log(" movedToShelf " + movedToShelf + " from book_shelf " + book_shelf)

    if (book_shelf !== "none") {
      selectedBook = this.state.books.filter((book) => book.id === book_id)[0]

      this.setState((state, props) => {
        selectedBook = this.state.books.filter((book) => book.id === book_id)[0]
        selectedBook.shelf = movedToShelf
      })
    }
    else {  /* handle search results selection */

      selectedBook = this.state.searchResults.filter((book) => book.id === book_id)[0]
      selectedBook.shelf = event.target.value
      newBookList = this.state.books.slice()
      newBookList.push(selectedBook)

      let updatedSearchList
      updatedSearchList = this.state.searchResults.filter((book) => book.id !== selectedBook.id)

      this.setState((state, props) => ({books: newBookList}))
      this.setState((state, props) => ({searchResults: updatedSearchList}))

    }

    BooksAPI.update(selectedBook, event.target.value)
  }

  /*
   * determine the shelf based on the bookId. If it's not on any shelf return
   * "searchResults" as the shelf name
   */
  getShelf = bookId => {
    var book = this.state.books.filter( (book) => (book.id === bookId))[0]
    let shelfName
    if (book) {
      shelfName = book ? book.shelf : "none"
    }
    else {
      shelfName = "none"
    }
    console.log("bookId: " + bookId + " shelfName " + shelfName)
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
    this.setState({query: query})

    if (query.length > 0) {
      BooksAPI.search(query.trim(), 25).then((searchResults) => {

        if (searchResults && searchResults.length > 0) {
          this.setState((previousState) => ({

            searchResults: searchResults
                                  .map((resultBook) => (
                                     {
                                      id: resultBook.id,
                                      title: resultBook.title,
                                      author: (resultBook.authors && resultBook.authors.length > 0) ? resultBook.authors.join(", ") : "",
                                      shelf:  this.getShelf(resultBook.id),
                                      imageLinks: resultBook.imageLinks
                                    }
                                  )
                                  )
          }))
        }
      })
    } else {
      this.setState({searchResults: []})
    }

  }


  /*
   *   Render the main landing page with the book shelves and the search button at the bottom.
   *
   */
  render() {

    const wantToRead       = this.state.books.filter(book => book.shelf === 'wantToRead')
    const currentlyReading = this.state.books.filter(book => book.shelf === 'currentlyReading')
    const read             = this.state.books.filter(book => book.shelf === 'read')


    return (
        <div className="app">

          <Switch>
            <Route exact path="/" render={() => (
              (
                  <div className="list-books">
                    <div className="list-books-title">
                      <h1>MyReads</h1>
                    </div>
                    <div className="list-books-content">
                      <div>
                        <div className="bookshelf">
                          <h2 className="bookshelf-title">Currently Reading ({currentlyReading.length})</h2>
                          <BookList books={currentlyReading} onShelfChange={this.moveToList} shelf="currentlyReading"/>
                        </div>
                        <div className="bookshelf">
                          <h2 className="bookshelf-title">Want to Read ({wantToRead.length})</h2>
                          <BookList books={wantToRead} onShelfChange={this.moveToList} shelf="wantToRead"/>
                        </div>
                        <div className="bookshelf">
                          <h2 className="bookshelf-title">Read ({read.length})</h2>
                          <BookList books={read} onShelfChange={this.moveToList} shelf="read"/>
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
                           books={this.state.searchResults}/>
            )}/>

            <Route component={NoMatch}/>

          </Switch>
        </div>

    )
  }
}


export default BooksApp
