var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var request = require('request');
var config = require('./configure.js')
const Translate = require('@google-cloud/translate');
var FCM = require('fcm-node'); 



const serverKey = config.SK;

var fcm = new FCM(serverKey);

const api_key = config.APIKEY;


app.use(express.static('public'));


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


require("./routes/routes.js")(app);

app.listen(config.PORT, function(){
	console.log("Listening on port ${config.PORT}");
});

console.log(translateText('Hello, World', 'ru'));

//Functions used by the routes.js file
function sendMessageToUser(user, message){
	request({
		url: 'https://fcm.googleapis.com/fcm/send',
		method: 'POST',
		headers: {
			'Content-Type' : 'applicatio/json',
			'Authorization' : 'key=' + serverKey
		},
		body : JSON.stringify(
			{"data":{
				"message" : message
			},
				"to" : user
			}
		)
	}, function(error, response, body){
		if(error){
			console.log(error, response, body);
		}else if(response.statusCode >= 400){
			console.error('HTTP Error: ' + response.statusCode+' -'+response.statusMessage+'\n'+body);
		}else{
			console.log('Done!');
		}
	});
}
exports.sendMessageToUser = sendMessageToUser;



function translateText(input, target_lang){
	if (!Array.isArray(input)) {
		input = [input];
	}
	var request = require('request');
	request.post({
		url: "https://www.googleapis.com/language/translate/v2?",
	    headers: {"X-HTTP-Method-Override": "GET"},
	    form: {
	    	key: api_key,
	    	target: target_lang,
	    	q: input
	    }
	}, function(error, response, data) {
	    if (!error && response.statusCode == 200) {
	    	console.log(data);
	    } else {
	    	console.log("something went wrong")
	    }
	});
}
exports.translateText = translateText;