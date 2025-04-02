'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.set('port', (process.env.PORT || 8000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Home
app.get('/', function (req, res) {
	res.send('Hello world!');
});
// Start the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
});

app.get('/mybot', function (req, res) {
	if (req.query['hub.verify_token'] === 'THIS_IS_MY_VERIFICATION_TOKEN') {
		res.send(req.query['hub.challenge']);
	}
	res.send('Wrong token!');
});

const token = "<EAAJPrRuZAKwQBO3o5d7QrwuLp8X3r7tBH71sEj8YvIduqDR5W4DUM2kRCF9k3oW0cFNaB56ZAedeJsJFYG5ZBV2L2hOfAsz9irZCSiP8j3sxgv8WhASyrylmmMi64ZAZArVfbCkR5H2WqSH7ltJKOCsHj7OZC6guCJPY5hpM6nQqCCHnjAcLBjQMi3LIOZC0ZC8HwynIFMH6gzFOBqGs60wZDZD>";
app.post('/webhook/', function(req, res) {
    var messaging_events = req.body.entry[0].messaging;
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;
        if (event.message && event.message.text) {
            var text = event.message.text;
            sendTextMessage(sender, text + "!");
        }
    }
    res.sendStatus(200);
});
function sendTextMessage(sender, text) {
    var messageData = {
        text: text
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error:', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}