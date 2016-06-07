var liri = {

	// store the title for the movies and music functions to pass to those particular functions
	title: "",

	// store the fs npm
	fs: require("fs"),

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

	// function that loops over the arguments entered by the user after the argument entered for the command and adds the necessary characters (+ for omdb and an empty space for spotify)
	theLoop: function(char_to_add) {
		
		// loop over the arguments entered
		for (var i = 3; i < process.argv.length; i++) {

			// start adding pluses in between each word (or argument entered)
			this.title += process.argv[i] + char_to_add;

		} // end for loop

		// reset the title without the last +
		this.title = this.title.slice(0, -1);

	}, // end theLoop()

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

		} // end switch

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

			// store the movie details in an object
			var music_object = {

				Artist: data.tracks.items[0].artists[0].name,
				"Song Name": data.tracks.items[0].name,
				"Preview Link": data.tracks.items[0].preview_url,
				"Album": data.tracks.items[0].album.name

			} // end music_object

			// loop through the object and display details to console
			for (var key in music_object) {

				// console log each key and value
				console.log(key + ": " + music_object[key]);

			} // end for loop

			// call the logOutput function and pass the music object so that it saves to log.txt
			liri.logOutput(music_object);

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

			// store the movie details in an object
			var movie_object = {

				Title: body.Title,
				Year: body.Year,
				"IMDB Raging": body.imdbRating,
				Country: body.Country,
				Language: body.Language,
				Plot: body.Plot,
				Actors: body.Actors,
				"Rotten Tomato Rating": body.tomatoRating,
				"Rotten Tomato URL": body.tomatoURL 

			} // end movie_object

			// loop through the object and display details to console
			for (var key in movie_object) {

				// console log each key and value
				console.log(key + ": " + movie_object[key]);

			} // end for loop

			// call the logOutput function and pass the movie object so that it saves to log.txt
			liri.logOutput(movie_object);

		}); // end request()

	}, // end movies()

	// read the random.txt file and run what it says to
	doWhatItSays: function() {

		// us fs to read the random.txt file
		this.fs.readFile("random.txt", "utf8", function(err, data) {
			
			// if ther is an error...
			if (err) {

				// ...console log the error
				console.log("An error: " + err);

				// return so that nothing else proceeds
				return;

			} // end if

			// store the value of the end of the slice so that we get the text before the comma
			var end_slice = data.indexOf(",");

			// store the new string that has the command to use in the command variable
			var command = data.slice(0, end_slice);

			// set the beginning value of the next string so that it begins after the first "
			var start_slice = end_slice + 2;

			// store the title in random.txt that's in between the "" in the title key for liri so thatt the liriLogic function will have access to it
			liri.title = data.slice(start_slice, -1);

			// call the liriLogic function and pass in the command for it to use
			liri.liriLogic(command);

		}); // end fs.reaFile()
		
	}, // end doWhatItSays()

	logOutput: function(object_to_log) {

		this.fs.appendFile("log.txt", "\n" + JSON.stringify(object_to_log), function(err) {

			// if ther is an error...
			if (err) {

				// ...console log the error
				console.log("An error: " + err);

				// return so that nothing else proceeds
				return;

			} // end if

		});

	} // end logOutput()

}; // end liri

// concat the user entered arguments after the third argument, but pass the third argument as the concat methods are different for spotify and omdb
liri.liriConcat(process.argv[2]);

// call the liriLogic method of liri with the third argument being passed
liri.liriLogic(process.argv[2]);