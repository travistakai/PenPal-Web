var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');




app.use(express.static('public'));

var config = require('./configure.js')

// var bodyParser = require('body-parser');
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// var config = require('./configure.js') // For sql database (cloud)

app.get('/', function(req, res){
	res.status(200).send("This is the landing page");
});


app.listen(config.PORT, function(){
	console.log("Listening on port 8080");
});