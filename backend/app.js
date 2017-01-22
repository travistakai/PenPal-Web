var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var request = require('request');
var config = require('./configure.js')
const Translate = require('@google-cloud/translate');
var FCM = require('fcm-node'); 
var crypto = require('crypto');



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


//Functions used by the routes.js file
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