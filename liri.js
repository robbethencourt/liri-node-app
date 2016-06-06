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

				// call the tweets function
				this.tweets();
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

				// call the doWhatItSays function
				this.doWhatItSays();
				break;

			// default will tell user instructions on how to use the app
			default:

				console.log("Woops! I'm looking for these possible arguments first, 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'.")

		}

	}, // end liriLogic()

	// twitter function
	tweets: function() {

		// keys to use
		var keys = require("./keys.js");

		// npm twitter
		var twitter = require("twitter");
		
		// client var to hold twitter keys stored in a file hidden by github thorugh .gitignore
		var client = new twitter(keys.twitterKeys);

		// object with the twitter username and number of tweets
		var params = {
			screen_name: 'rob_bethencourt',
			count: 20
		};

		// twitter get method to capture the last 20 tweets and console log them
		client.get('statuses/user_timeline', params, function(error, tweets, response){

			// if there's an error..
			if (error) {

				// ...console log the error
				console.log("An error: " + error);

			} // end if

			// console log the beginning of the twitter section
			console.log("\nMy Tweets");
			console.log("------------\n");

			// store teh number of tweets in a variable so this only checks once and not each time through the loop;
			var num_tweets = tweets.length;

			// declaring the i variable here as I've read it's considered good parctice
			var i;

			// loop through the tweets
			for (i = 0; i < num_tweets; i++) {

				// variable to show which tweet number I'm displaying to the console
				var tweet_num = i + 1;

				// console log the 20 tweets
				console.log("Tweet " + tweet_num);
				console.log("Created at: " + tweets[i].created_at);
				console.log(tweets[i].text);
				console.log("");

			} // end for loop

		}); // end client.get()

	}, // end tweets()

	// spotify music function
	music: function(title_to_pass) {

		// checking to see if the user entered anything for the music title
		if (title_to_pass === "") {

			// if they didn't, then use what's my age again by Blink 182 as the title to pass
			title_to_pass = "what's my age again";

		} // end if

		// npm Spotify
		var spotify = require("spotify");
		
		// spotify search method we are passing a track hard coded and the title will be taken from the user's input which is concatinated in the liriConcat function
		spotify.search({ type: 'track', query: title_to_pass }, function(err, data) {
			
			// if ther is an error...
			if (err) {

				// ...console log the error
				console.log("An error: " + err);

				// return so that nothing else proceeds
				return;

			} // end if

			// console log the details of the movie on each line
			console.log("\nMusic");
			console.log("------------\n")
			console.log("Artist: " + data.tracks.items[0].artists[0].name);
			console.log("Song Name: " + data.tracks.items[0].name);
			console.log("Preview Link: " + data.tracks.items[0].preview_url);
			console.log("Album: " + data.tracks.items[0].album.name);

		}); // end spotify.search()

	}, // end music()

	// omdb movie function
	movies: function(title_to_pass) {

		// checking to see if the user entered anything for the movie title
		if (title_to_pass === "") {

			// if they didn't, then use Mr. Nobody as the movie title to pass
			title_to_pass = "mr+nobody";

		} // end if

		// npm request
		var request = require("request");

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
			console.log("\nMovie");
			console.log("------------\n")
			console.log("Title: " + body.Title);
			console.log("Year: " + body.Year);
			console.log("IMDB Rating: " + body.imdbRating);
			console.log("Country: " + body.Country);
			console.log("Language: " + body.Language);
			console.log("Plot: " + body.Plot);
			console.log("Actors: " + body.Actors);
			console.log("Rotten Tomato Rating: " + body.tomatoRating);
			console.log("Rotten Tomato URL: " + body.tomatoURL);

		}); // end request()

	}, // end movies()

	// read the random.txt file and run what it says to
	doWhatItSays: function() {

		// store the fs npm in a variable to use below
		var fs = require("fs");

		// us fs to read the random.txt file
		fs.readFile("random.txt", "utf8", function(err, data) {
			
			// if ther is an error...
			if (err) {

				// ...console log the error
				console.log("An error: " + err);

				// return so that nothing else proceeds
				return;

			} // end if

			console.log(data);

			var end_slice = data.indexOf(",");

			var command = data.slice(0, end_slice);

			console.log(command);

			var start_slice = end_slice + 2;

			var stored_title = data.slice(start_slice, -1);

			console.log(stored_title);

		}); // end fs.reaFile()
		
	} // end doWhatItSays()

}; // end liri

// concat the user entered arguments after the third argument, but pass the third argument as the concat methods are different for spotify and omdb
liri.liriConcat(process.argv[2]);

// call the liriLogic method of liri with the third argument being passed
liri.liriLogic(process.argv[2]);