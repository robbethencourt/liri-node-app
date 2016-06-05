var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");

var liri = {

	// store the title for the movies and music functions to pass to those particular functions
	title: "",

	// concatinate the argumens after the third the user enters
	liriConcat: function(user_request) {

		switch(user_request) {

			case "spotify-this-song":

				var empty_space = " ";
				this.theLoop(empty_space);
				break;

			case "movie-this":

				var plus_sign = "+";
				this.theLoop(plus_sign);
				break;

			default:

				break;

		} // end switch

	}, // end liriConcat()

	theLoop: function(char_to_add) {
		
		// loop over the arguments entered
		for (var i = 3; i < process.argv.length; i++) {

			// start adding pluses in between each word (or argument entered)
			this.title += process.argv[i] + char_to_add;

		} // end for loop

		// reset the title without the last +
		this.title = this.title.slice(0, -1);

	},

	liriLogic: function(user_request) {
		
		// pass the user's first argument from their command line input to determine what info will need to be displayed
		switch(user_request) {

			// twitter
			case "my-tweets":

				console.log(user_request);
				break;

			// spotify
			case "spotify-this-song":

				this.music(this.title);
				break;

			// online movie database
			case "movie-this":

				// call the movies function and pass the concatinated movie title
				this.movies(this.title);
				break;

			// run what's in the random.txt file
			case "do-what-it-says":

				console.log(user_request);
				break;

			// default will tell user instructions on how to use the app
			default:

				console.log("Woops! I'm looking for these possible arguments first, 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'.")

		}

	}, // end liriLogic()

	// spotify music function
	music: function(title_to_pass) {

		console.log(title_to_pass);

		//spotify_string = title_to_pass.replace(/+/g, " ");

		//console.log(spotify_string);
		
		spotify.search({ type: 'track', query: title_to_pass }, function(err, data) {
			
			// if ther is an error...
			if (err) {

				// ...console log the error
				console.log("An error: " + err);

				// return so that nothing else proceeds
				return;

			} // end if

			console.log(data);

		}); // end spotify()

	}, // end music()

	// omdb movie function
	movies: function(title_to_pass) {

		console.log(title_to_pass);

		// store the title being searched into a variable
		var movie_name = title_to_pass;

		// checking to see if the user entered anything for the movie title
		if (movie_name === "") {

			// if they didn't, then use Mr. Nobody as the movie title to pass
			movie_name = "mr+nobody";

		} // end if

		// store teh omdb url into a variable
		var omdb_url = 'http://www.omdbapi.com/?t=' + movie_name +'&y=&plot=short&r=json&tomatoes=true';

		// use the request node module to look up the movie in omdb
		request(omdb_url, function(err, response, body) {

			// if ther is an error...
			if (err) {

				// ...console log the error
				console.log("An error: " + err);

				// return so that nothing else proceeds
				return;

			} // end if
			
			// parse the returned string into a json object
			body = JSON.parse(body);

			// console log the details of the movie on each line
			console.log(body.Title + "\n" + body.Year + "\n" + body.imdbRating + "\n" + body.Country + "\n" + body.Language + "\n" + body.Plot + "\n" + body.Actors + "\n" + body.tomatoRating + "\n" + body.tomatoURL);

		}); // end request()

	} // end movies()

}; // end liri

// concat the user entered arguments after the third argument
liri.liriConcat(process.argv[2]);

// call the liriLogic method of liri with the third argument being passed
liri.liriLogic(process.argv[2]);