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
var responseArr = [];
var cleanResponse = "";

for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        entry = entry + "+" + nodeArgs[i];
    }
    else {
        entry += nodeArgs[i];
    }
};

function concertThis() {
    axios.get("https://rest.bandsintown.com/artists/" + entry + "/events?app_id=codingbootcamp").then(function (response) {

        for (var i = 0; i < 5; i++) {
            cleanResponse =
                "\nVenue: " + response.data[i].venue.name +
                "\nLocation: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country +
                "\nDate: " + moment(response.data[i].datetime, "YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY");

            console.log(cleanResponse);
            logResults(cleanResponse);
        };
    });
}

function spotifyThisSong() {
    spotify
        .search({ type: 'track', query: entry })
        .then(function (response) {
            for (var i = 0; i < 5; i++) {
            cleanResponse = 
                "\nArtist(s): " + response.tracks.items[i].artists[0].name +
                "\nTrack: " + response.tracks.items[i].name +
                "\nPreview: " + response.tracks.items[i].preview_url +
                "\nAlbum: " + response.tracks.items[i].album.name;
            console.log(cleanResponse);
            logResults(cleanResponse);
        }
        })
        .catch(function () {
            console.log("Spotify cannot find this song... ");
        });
}

function movieThis() {
    if (entry.length === 0) {
        entry = "Mr. Nobody";
    }
    ;
    axios.get("http://www.omdbapi.com/?t=" + entry + "&y=&plot=short&apikey=trilogy").then(function (response) {
        cleanResponse = "\nEntry: " + entry +
            "\nTitle: " + response.data.Title +
            "\nRelease Year: " + response.data.Year +
            "\nIMDB: " + response.data.imdbRating +
            "\n" + response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value +
            "\nCountry: " + response.data.Country +
            "\nLanguage: " + response.data.Language +
            "\nPlot: " + response.data.Plot +
            "\nActors: " + response.data.Actors;
        console.log(cleanResponse);
        logResults(cleanResponse);
    })
        .catch(function (err) {
            console.log(err);
        });;
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

function logResults(cleanResponse) {
    fs.appendFile("log.txt", "\n------------------------------\n" + cleanResponse, function (err) {
        // If an error was experienced we will log it.
        if (err) {
            console.log(err);
        }
        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
            console.log("Content Added!");
        }
    });
}

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
    };
}

liri();