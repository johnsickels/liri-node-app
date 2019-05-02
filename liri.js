require("dotenv").config();
var inquirer = require("inquirer");

var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var nodeArgs = process.argv;
var command = process.argv[2];
var entry = "";
var fs = require('fs');
var logResponse = [];
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
            logResponse.push(cleanResponse);
            
        };
        promptLog();
    });
}

function promptLog() {
    console.log("Got this far...");
    
    inquirer
        .prompt({
            name: "log",
            type: "confirm",
            message: "Would you like to log these results?"
        })
        .then(function (answer) {
            if (answer.log) {
                logResults(logResponse);
            }
            else {
                return;
            }
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
                logResponse.push(cleanResponse);
            };
            promptLog();
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
        cleanResponse = 
            "\nTitle: " + response.data.Title +
            "\nRelease Year: " + response.data.Year +
            "\nIMDB: " + response.data.imdbRating +
            "\n" + response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value +
            "\nCountry: " + response.data.Country +
            "\nLanguage: " + response.data.Language +
            "\nPlot: " + response.data.Plot +
            "\nActors: " + response.data.Actors;
        console.log(cleanResponse);
        logResponse.push(cleanResponse);
        promptLog();
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
        if (err) {
            console.log(err);
        } else {
            console.log("Results logged!");
            
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
            console.log("Please enter a valid command: " +
                "\nnode liri.js concert-this tom jones" +
                "\nnode liri.js spotify-this-song fluffhead" +
                "\nmovie-this jaws" +
                "\ndo-what-it-says");
    };
}

liri();