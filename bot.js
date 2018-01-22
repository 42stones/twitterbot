/*
    Input ist ein Array a hashtags
    Er soll "Humanlike" zufällig Sachen mit diesen Hashtags liken
    Nur neue Tweets (seid der letzten Abfrage)
    Dort über Random auswählen, ob der Tweet geliked wird. 
    Höhere Wahrscheinlichkeit bei Tweets, die bereits mehr Likes haben.
*/

/*------------------------------------------------------
  ---                   PARAMETERS                   ---
  ------------------------------------------------------*/
var parameters = {
    twitterAccess: {
        consumer_key: 'SoQ4THVA2JnQFB6ADmd3xaU7v',
        consumer_secret: 'j9EHiwERberDxVsOyiS25yWB6FiAosB1xOpxEDpzdMW7vZrvmY',
        access_token_key: '864900198-GdJF6QTBWh2a0l3AnUTF2iqZ0sH2XSl3dt5BVSq0',
        access_token_secret: '4c0y7O1Z1EXl946TuRyJIIwlf4qlVdNijDKfqk0dIjyX8'
    },
    hashtags: [
        'coding',
        'hacking'
    ],
    interval: 3, //Interval in hours
};


/*------------------------------------------------------
  ---                 THE ACTUAL CODE                ---
  ---                                                ---
  ---     DO NOT CHANGE ANYTHING BELOW THIS LINE     ---
  ---   IF YOU DONT KNOW EXACTLY WHAT YOU ARE DOING  ---
  ------------------------------------------------------*/

var fs = require('fs');

var persistentStorage = {
    since_id: 0
};

if(fs.existsSync("persistentStorage")) {
    var content = fs.readFileSync("persistentStorage");
    if (content && content.length > 0) {
        persistentStorage = JSON.parse(content);
    }
}

var tweetsToBeLiked = [];

var twitterWrapper;
function InitTwitterWrapper() {
    var TwitterWrapper = require("./twitterWrapper");
    twitterWrapper = new TwitterWrapper(
        parameters.twitterAccess.consumer_key,
        parameters.twitterAccess.consumer_secret,
        parameters.twitterAccess.access_token_key,
        parameters.twitterAccess.access_token_secret,
    );
};

var mainLoopFunction = function() {
    try {
        InitTwitterWrapper();
        var currentSinceId = persistentStorage.currentSinceId;

        for(var i = 0; i < parameters.hashtags.length; i++) {
            console.log("Trying to find posts for #" + parameters.hashtags[i]);
            twitterWrapper.GetTweetsByHashtag(parameters.hashtags[i], currentSinceId, function (tweets) {
                for(var t = 0; t < tweets.length; t++) {
                    var favThreshold = 0.3;
                    if(tweets[t].favorite_count > 3 && tweets[3] < 30) {
                        favThreshold = 0.7;
                    }

                    if(Math.random() < favThreshold) {
                        console.log("Tweet [" + tweets[t].id_str + "] will be liked");
                        tweetsToBeLiked.push(tweets[t]);
                    }
                    else {
                        console.log("Tweet [" + tweets[t].id_str + "] has lost to the randomness");
                    }
                }

                if(tweets[tweets.length - 1].id > persistentStorage.since_id) {
                    persistentStorage.since_id = tweets[tweets.length - 1].id;
                }
            }, function(error) {
                console.log("ERROR");
                console.log(error);
            });
            likeLoopFunction();
        }
    }
    catch(ex) {
        console.log("WE GOT AN EXCEPTION");
        console.log(ex);
    }
};
var mainLoop = setInterval(mainLoopFunction, parameters.interval * 3600 * 1000);

var likeLoop;
var likeLoopFunction = function() {
    if(likeLoop) {
        return;
    }

    likeLoop = setTimeout(function() {
        var tweet = tweetsToBeLiked.pop();
        console.log("Tweet [" + tweet.id_str + "] is about to be loved");
        twitterWrapper.FavoriteTweet(tweet.id_str, function(tweet) {
            // do nothin on success
        }, function(error) {
            console.log("There was an error while we wanted to give this tweet some love.");
            console.log(error);
        });

        if(tweetsToBeLiked.length > 0) {
            likeLoopFunction();
        }
        else {
            likeLoop = null;
        }
    }, (Math.random() * 8 + 2) * 1000);
}

mainLoopFunction();


// do the cleanup on exiting
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    fs.writeFile("persistentStorage", JSON.stringify(persistentStorage), function(err) {
        if(err) {
            console.log("We could not save your persistent storage. Dobby will have to iron his hands for this.")
            console.log(err);
            return;
        }
    }); 

    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));