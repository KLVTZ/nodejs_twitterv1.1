var twitter = require('ntwitter');

// oAuth for twitter API v1.1
var twit = new twitter({
	consumer_key: 'o0hR3pB8t7fAHoZqbzLMA',
	consumer_secret: 'qzcpZIyFnXZqMVRdUfTaujdPyvLZi5SZoNY5L3E6zI',
	access_token_key: '61608342-ogqdWGY7FNvp5RPRvpyvbJizSopOYKV2gs6oVfDFd',
	access_token_secret: 'AD5TsMew9ZUohqCHB4YA6RRxwPNk8bGS9rKDgusG15VOi'
});

// database inclusion
var mongo = require("mongodb");
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db("nodejs-introduction", new mongo.Server(host, port, {}), {safe: true});
var tweetCollection;
db.open(function(error){
	console.log("We are connected! " + host + ":" + port);
	
	db.collection("tweet", function(error, collection){
		tweetCollection = collection;
	});

});

// each stream of JSON tweet is inserted into mongo DB -
// twitter API v1.1 is JSON default -no need to parse
twit.stream('statuses/filter', {track: 'bieber'}, function(stream) {
	  stream.on('data', function(tweet) {
	  tweetCollection.insert(tweet, function(error) {
	  	if(error) {
	  		console.log("Error: ", error.message);
	  	} else {
	  		console.log("Inserted into database");
	  	}
	  });
	  setTimeout(stream.destroy, 4000);
	});
});