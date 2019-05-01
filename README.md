# LIRI Bot

### Overview

- In this assignment, I will make LIRI. LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

### Here's how the app works:

- LIRI accepts commands and requests on the command line such as:

   * `concert-this`

   * `spotify-this-song`

   * `movie-this`

   * `do-what-it-says`

- To retrieve the data that will power this app, I needed to send requests using the `axios` package to the Bands in Town, Spotify and OMDB APIs. These Node packages are crucial for the project.

### App design notes:

- Feature instructions if one of the four commands are not used properly.
- Display random results if search criteria is left empty.
- Handle errors and undefined object properties in an entertaining fashion.

### Technologies used:

   * [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)

   * [Axios](https://www.npmjs.com/package/axios)

     * I used Axios to grab data from the [OMDB API](http://www.omdbapi.com) and the [Bands In Town API](http://www.artists.bandsintown.com/bandsintown-api)

   * [Moment](https://www.npmjs.com/package/moment)

   * [DotEnv](https://www.npmjs.com/package/dotenv)
   
### LIRI Bot Links:

 - Coming Soon...
