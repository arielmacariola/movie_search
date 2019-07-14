import React, { Component } from 'react';
import './App.css';
import logo from './logo.jpg';
import MovieRow from './components/MovieRow'
import $ from 'jquery'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {searchTerm: "Most popular movies"}

    this.performSearch("");
  }

  performSearch = (searchTerm) => {
    console.log("Perform search");
    let urlString = "https://api.themoviedb.org/3/search/movie?api_key=9f0221959cbc2995854cc8311508b956&language=en-US&query=" + searchTerm

    // display popular movies if search term is blank
    if(searchTerm.length === 0) {
      urlString = "https://api.themoviedb.org/3/movie/popular?api_key=9f0221959cbc2995854cc8311508b956&language=en-US&page=1"
      this.setState({searchTerm: "Most popular movies"});
    } else {
      this.setState({searchTerm: "Search results for \"" + searchTerm + "\""});
    }
      
    $.ajax({
      url: urlString,
      success: (searchResults) => {
        console.log("Fetched data successfully");
        console.log(searchResults);
        const results = searchResults.results 
        
        //console.log(results);

        if(searchResults.total_results === 0) {
          this.setState({rows: <div className="no-result">There's no movie matched with the keyword "{searchTerm}". <br/> <em>Please try to search again.</em></div>})
        }
        else {
          let movieRows = [];
          results.forEach(movie => {
            movie.poster_src = "http://image.tmdb.org/t/p/w185/" + movie.poster_path
            const movieRow = <MovieRow movie={movie} />
            movieRows.push(movieRow)
          });

          this.setState({rows: movieRows});
        }
      },
      error: (xhr, status, err) => {
        console.error("Failed to fetch data");
      }
    })
  }

  searchChangedHandler = (event) => {
    const searchTerm = event.target.value
    this.performSearch(searchTerm)
  }

  render(){
  return (
    <div className="App">
      <header>
        <div className="logo"><img alt="MoviesDB Search" src={logo} /></div>
        <div className="appname">MoviesDB Search</div>
      </header>

      <input style={{
        fontSize: 24,
        display: 'block',
        width: '99%',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16
      }} onChange={this.searchChangedHandler} placeholder="Enter search term" />
      
      
      <div className="search-label">{this.state.searchTerm}</div>
      {this.state.rows}

    </div>
  );
  }
}

export default App;
