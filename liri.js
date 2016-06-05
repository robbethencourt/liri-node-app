var keys = require("./keys.js");

var liri = {

	liriLogic: function(user_request) {
		
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

				console.log(user_request);
				break;

			// run what's in the random.txt file
			case "do-what-it-says":

				console.log(user_request);
				break;

			default:

				console.log("Woops! I'm looking for these possible arguments first, 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'.")

		};

	},

	movies: function(argument) {
		// body...
	}

};

liri.liriLogic(process.argv[2]);