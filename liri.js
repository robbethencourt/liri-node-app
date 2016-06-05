var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");

var liri = {

	// store the title for the movies and music functions to pass to those particular functions
	title: "",

	// concatinate the argumens after the third the user enters
	liriConcat: function(user_request) {

		// if the user wants to seach a...
		switch(user_request) {

			// ...song we use spotify
			case "spotify-this-song":

				// create a variable for an empty string
				var empty_space = " ";

				// call the theLoop function and pass it the empty string
				this.theLoop(empty_space);
				break;

			// ...movie we use omdb
			case "movie-this":

				// create a variable for the + character
				var plus_sign = "+";

				// call the theLoop function and pass it the + character
				this.theLoop(plus_sign);
				break;

			// we want the default to do nothing as there will be other user inputs in the thrid argument that we don't want the liriConcat function doing anything with
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

				// call the music function and pass the concatinated movie title
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
		
		// spotify search method we are passing a track hard coded and the title will be taken from the user's input which is concatinated in the liriConcat function
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

		// checking to see if the user entered anything for the movie title
		if (title_to_pass === "") {

			// if they didn't, then use Mr. Nobody as the movie title to pass
			title_to_pass = "mr+nobody";

		} // end if

		// store teh omdb url into a variable and pass the concatinated title to the omdb url. The title is being concatinated in the liriConcat function.
		var omdb_url = 'http://www.omdbapi.com/?t=' + title_to_pass +'&y=&plot=short&r=json&tomatoes=true';

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

// concat the user entered arguments after the third argument, but pass the third argument as the concat methods are different for spotify and omdb
liri.liriConcat(process.argv[2]);

// call the liriLogic method of liri with the third argument being passed
liri.liriLogic(process.argv[2]);