const Twitter = require('twitter');
const authAPI = require('./config/twitter.js');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Users = require('./db.js').Users;
const searchUsers = require('./searchUsers.js');
const port = process.env.PORT || 3001;

var app = express();

// Logging and parsing
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.get('/health', (req, res) => {
  res.writeHead(200);
  res.end('healthy');
})

app.get('/search/users/:text/:viewerId', async (req, res) => {
    try {
      let text = req.params.text;
      let viewerId = req.params.viewerId;
      let viewer = await Users.findOne({id: viewerId});
      let tokenKey = viewer.twitterTokenKey;
      let tokenSecret = viewer.twitterTokenSecret;
      let client = new Twitter({
        consumer_key: authAPI.TWITTER_CONSUMER_KEY,
        consumer_secret: authAPI.TWITTER_CONSUMER_SECRET,
        access_token_key: tokenKey,
        access_token_secret: tokenSecret
      });
      let users = await searchUsers(client, text);
      res.writeHead(200);
      res.end(users);
    } catch(err) {
      console.log('ERROR in /search/users/:text', err);
      res.writeHead(404);
      res.end(err);
    }
})

app.listen(port, () => {
	console.log(`listening on port ${port}`);
})
