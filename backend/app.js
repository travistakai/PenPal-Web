var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var request = require('request');
var config = require('./configure.js')




var FCM = require('fcm-node'); 

var serverKey = config.SK;
var fcm = new FCM(serverKey);






app.use(express.static('public'));


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// var config = require('./configure.js') // For sql database (cloud)



require("./routes/routes.js")(app);


app.listen(config.PORT, function(){
	console.log("Listening on port 8081");
});



exports.sendMessageToUser = function(user, message){
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

exports.translateMyAss = function(input, target) {
  // The text to translate, e.g.:
  // input = 'Hello, world';
  // The target language, e.g.:
  // target = 'ru';

  if (!Array.isArray(input)) {
    input = [input];
  }

  // Instantiates a client
  const translate = Translate();

  // Translates the text into the target language. "input" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  return translate.translate(input, target)
    .then((results) => {
      let translations = results[0];
      translations = Array.isArray(translations) ? translations : [translations];

      console.log('Translations:');
      translations.forEach((translation, i) => {
        console.log(`${input[i]} => (${target}) ${translation}`);
      });

      return translations;
    });
}