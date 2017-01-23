var express = require('express');
var app = express();

var path = require('path');
var fs = require('fs');
var request = require('request');
var bodyParser = require('body-parser');

// Translate var for our real time translation
const Translate = require('@google-cloud/translate');

// Firebase cloud message service
var FCM = require('fcm-node'); 
var fcm = new FCM(config.SK);

var crypto = require('crypto');

var config = require('./configure.js')

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// external routes folder
require("./routes/routes.js")(app);

// Listen on port specified
app.listen(config.PORT, function(){
	console.log("Listening on port " + config.PORT);
});


//Functions used to pass a json message to our client, denoted by a token 
// json format:
/*		{
			data: {
				to_id : int
				from_id : int
				content : string
				date : date
			}
		}
*/
function sendMessageToUser(user, message){
	request({
		url: 'https://fcm.googleapis.com/fcm/send',
		method: 'POST',
		headers: {
			'Content-Type' : 'application/json',
			'Authorization' : 'key=' + config.SK
		},
		body : message
	}, function(error, response, body){
		if(error){
			console.log(error, response, body);
		}else if(response.statusCode >= 400){
			console.error('HTTP Error: ' + response.statusCode+' -'+response.statusMessage+'\n'+body);
		}else{
			console.log('Message Sent');
		}
	});
}
exports.sendMessageToUser = sendMessageToUser;


// Google API function to translate messages in real time
function translateText(input, target_lang){
	if (!Array.isArray(input)) {
		input = [input];
	}
	var request = require('request');
	request.post({
		url: "https://www.googleapis.com/language/translate/v2?",
	    headers: {"X-HTTP-Method-Override": "GET"},
	    form: {
	    	key: config.APIKEY,
	    	target: target_lang,
	    	q: input
	    }
	}, function(error, response, results) {
	    if (!error && response.statusCode == 200) {
	    	var jsoncontent = JSON.parse(results);
	    	var content = jsoncontent.data.translations[0].translatedText;
	    	console.log(content)
	    	return content;
	    } else {
	    	console.log(error);
	    	console.log("something went wrong")
	    	return null;
	    }
	});
}
exports.translateText = translateText;


function genRandomString(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

function hash(password, salt){
	var res = crypto.createHmac('sha512', salt);
	res.update(password);
	var value = res.digest('hex');
	return {
		salt : salt,
		passwordHash: value
	}
}

exports.hash = hash;

function saltHash(userpassword){
	var salt = genRandomString(16);
	var passwordData = hash(userpassword, salt);
}

exports.saltHash = saltHash;