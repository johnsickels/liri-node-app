require("dotenv").config();

var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var nodeArgs = process.argv;
var command = process.argv[2];
var entry = "";
var fs = require('fs');

for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        entry = entry + "+" + nodeArgs[i];
    }
    else {
        entry += nodeArgs[i];
    }
};

liri();

function liri() {
    switch (command) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("Please enter a valid command.");
    }
    ;
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        };
        var dataArr = data.split(",");
        command = dataArr[0];
        entry = dataArr[1];
        liri(command, entry);
    });
}

function movieThis() {
    if (entry.length === 0) {
        entry = "Mr. Nobody";
    }
    ;
    axios.get("http://www.omdbapi.com/?t=" + entry + "&y=&plot=short&apikey=trilogy").then(function (response) {
        console.log("Title: " + response.data.Title);
        console.log("Release Year: " + response.data.Year);
        console.log("IMDB: " + response.data.imdbRating);
        console.log(response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
    })
    .catch(function (err) {
        console.log(err);
    });;
}

function spotifyThisSong() {
    spotify
        .search({ type: 'track', query: entry })
        .then(function (response) {
            console.log("Artist(s): " + response.tracks.items[0].artists[0].name);
            console.log("Track: " + response.tracks.items[0].name);
            console.log("Preview: " + response.tracks.items[0].preview_url);
            console.log("Album: " + response.tracks.items[0].album.name);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function concertThis() {
    axios.get("https://rest.bandsintown.com/artists/" + entry + "/events?app_id=codingbootcamp").then(function (response) {
        console.log(response.data[0].venue.name);
        console.log(response.data[0].venue.city + ", " + response.data[0].venue.region + ", " + response.data[0].venue.country);
        console.log(moment(response.data[0].datetime, "YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY"));
    });
}
