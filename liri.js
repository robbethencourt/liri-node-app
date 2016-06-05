var keys = require("./keys.js");
var request = require('request');

var liri = {

	liriLogic: function(user_request, title) {
		
		// pass the user's first argument from their command line input to determine what info will need to be displayed
		switch(user_request) {

			// twitter
			case "my-tweets":

				console.log(user_request);
				break;

			// spotify
			case "spotify-this-song":

				console.log(user_request);
				break;

			// online movie database
			case "movie-this":

				this.movies(title);
				break;

			// run what's in the random.txt file
			case "do-what-it-says":

				console.log(user_request);
				break;

			default:

				console.log("Woops! I'm looking for these possible arguments first, 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'.")

		};

	},

	movies: function(title_to_pass) {

		var movie_name = title_to_pass;

		var omdb_url = 'http://www.omdbapi.com/?t=' + movie_name +'&y=&plot=short&r=json';

		request(omdb_url, function(err, response, body) {
			
			body = JSON.parse(body);
			console.log(body.Title);

		});

	}

};

liri.liriLogic(process.argv[2], process.argv[3]);