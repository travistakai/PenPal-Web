var appMain = require('../app.js')
var multer  = require('multer')
var upload = multer()
// var bodyParser = require("body-parser");

module.exports = function (app) {
    // set up the routes themselves
    app.get('/', function(req, res){
		res.status(200).send("This is the landing page");
	});


	app.get('/messaging', function(req, res){
		res.status(200).send("Thus is me sending a message");

		appMain.sendMessageToUser("travis", "test test test");

	});

	app.post('/signup', function(req, res){
		console.log(req.body)
		res.status(200).send("Successfully signed up!")
	})

	//Example POST request with dd of data
	// app.post('/profile', upload.array(), function (req, res, next) {
	// // req.body contains the text fields
	// 	console.log(req.body)
	// 	res.status(200).send("Successfully signed up!")
	// })
};