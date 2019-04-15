require("dotenv").config();
let dataKeys = require("./keys.js");
let fs = require('fs'); //file system
let Spotify = require('node-spotify-api');
let request = require('request');
let inquirer = require('inquirer');
let blank = "\n" + "         ";
let header = "----------------------------------------------------------------";
let footer = "\n--------------------------------------------------------------";

function fetchSpotify(songTitle) {
    let spotify = new Spotify(dataKeys.spotify);
    if (!songTitle) {
        songTitle = "The Sign";
    }
    spotify.search({ type: 'track', query: songTitle }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            output =
                header +
                blank +  "Artist(s) Name: " + data.tracks.items[0].album.artists[0].name +
                blank + "Song Title: " + "'" + songTitle.toUpperCase() + "'" +
                blank + "Song Preview: " + data.tracks.items[0].album.external_urls.spotify +
                blank + "Album Name: " + data.tracks.items[0].album.name +
                footer;
            console.log(output);
        }
    });
}
let fetchBand = function(bandName) {
    if(!bandName) {
        bandName = "Rammstein"
    }
let URL = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp"

request(URL, function(err, res, body) {
    if (err) {
        console.log('Error occurred: ' + err);
        return;
    } else {
        let jsonDataBand = JSON.parse(body);
        
        output = blank + header +
            blank + 'Artist Name: ' + bandName +
            blank + 'Name of Venue: ' + jsonDataBand[0].venue.name +
            blank + 'Location of Venue: ' + jsonDataBand[0].venue.city +
            blank + 'Date of Concert: ' + jsonDataBand[0].datetime +
            "\n" + footer;

        console.log(output);
        // writeToLog(output);
        }

})}
let fetchMovie = function(movieName) {

    if (!movieName) {
        movieName = "Mr Nobody";
    }

    let URL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(URL, function(err, res, body) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            let jsonData = JSON.parse(body);
            output = blank + header +
                blank + 'Title: ' + jsonData.Title +
                blank + 'Year: ' + jsonData.Year +
                blank + 'IMDB Rating: ' + jsonData.imdbRating +
                blank + 'Tomato Rating: ' + jsonData.Ratings[1].Value +
                blank + 'Country: ' + jsonData.Country +
                blank + 'Language: ' + jsonData.Language +
                blank + 'Plot: ' + jsonData.Plot +
                blank + 'Actors: ' + jsonData.Actors +
                "\n" + footer;

            console.log(output);
            // writeToLog(output);
        }
    });
};

function youMustObey() {
    // Reads the random text file and passes it to the spotify function
    fs.readFile("random.txt", "utf8", function(error, data) {
        fetchSpotify(data);
    });
}
let questions = [{
        type: 'list',
        name: 'programs',
        message: 'What function do you want to run?',
        choices: ['Spotify Song Search By Title', 'Movie Name By Title', 'What Bands are in Town', 'Do what it says']
    },
    {
        type: 'input',
        name: 'movieChoice',
        message: 'What\'s the name of the movie you would like?',
        when: function(answers) {
            return answers.programs == 'Movie Name By Title';
        }
    },
    {
        type: 'input',
        name: 'songChoice',
        message: 'What\'s the name of the song you would like?',
        when: function(answers) {
            return answers.programs == 'Spotify Song Search By Title';
        }
    },
    {
        type: 'input',
        name: 'bandChoice',
        message: 'What\'s the name of the band you would like to search?',
        when: function(answers) {
            return answers.programs == 'What Bands are in Town';
        }
    },

];

inquirer
    .prompt(questions)
    .then(answers => {
        // Depending on which program the user chose to run it will do the function for that program
        switch (answers.programs) {
            case 'Spotify Song Search By Title':
                fetchSpotify(answers.songChoice);
                break;
            case 'Movie Name By Title':
                fetchMovie(answers.movieChoice);
                break;
            case 'Do what it says':
                youMustObey();
                break;
            case 'What Bands are in Town':
                fetchBand(answers.bandChoice);
                break;
            default:
                console.log('Please enter a valid Movie or Song title');
        }
    });