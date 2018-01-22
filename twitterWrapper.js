// var params = {
//     screen_name: 'nodejs'
// };
// client.get('statuses/user_timeline', params, function(error, tweets, response) {
//     if (!error) {
//         console.log(tweets);
//     }
// });

function TwitterWrapper (consumer_key, consumer_secret, access_token_key, access_token_secret, numberOfResultsPerHashtag) {
    var Twitter = require('twitter');
    this.endpoint = new Twitter({
        consumer_key: consumer_key,
        consumer_secret: consumer_secret,
        access_token_key: access_token_key,
        access_token_secret: access_token_secret
    });
    if(numberOfResultsPerHashtag < 1 || numberOfResultsPerHashtag > 100) {
        throw new Error("Die Twitter-API erlaubt nur zwischen 1 und 100 Tweets als Rückgabewert.");
    }
    this.NumberOfResultsPerHashtag = numberOfResultsPerHashtag;
};

TwitterWrapper.prototype.GetTweetsByHashtag = function(hashtag, since_id, OnSuccess, OnError) {
    this.endpoint.get('search/tweets.json', {
        q: '%23' + hashtag,
        since_id: since_id || 0,
        count: this.NumberOfResultsPerHashtag,
        include_entities: true
    }, function(error, tweets, response) {
        if(error) {
            if(OnError) {
                OnError(error);
            }
        }
        else {
            if(OnSuccess) {
                OnSuccess(tweets.statuses);
            }
        }
    });
};

TwitterWrapper.prototype.FavoriteTweet = function(tweetId, OnSuccess, OnError) {
    this.endpoint.post('favorites/create.json', {
        id: tweetId
    }, function(error, tweets, response) {
        if(error) {
            if(OnError) {
                OnError(error);
            }
        }
        else {
            if(OnSuccess) {
                OnSuccess(tweets.statuses);
            }
        }
    });
};

module.exports = TwitterWrapper;