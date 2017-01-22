var appMain = require('../app.js')
var config = require('../configure.js')
var multer  = require('multer')
var upload = multer()
var mysql = require('mysql');
var crypto = require('crypto');

var connection = mysql.createConnection({
	host     : config.HOST,
	user     : config.USER,
	password : config.PASSWORD,
	database : config.DB
});

module.exports = function (app) {
    // set up the routes themselves
    app.get('/', function(req, res){
		res.status(200).send("This is the landing page");
	});

	app.get('/messaging', function(req, res){
		res.status(200).send("Thus is me sending a message");
		appMain.sendMessageToUser("travis", "test test test");
	});

	//Need more routes:
	//	Matching users
	//	GetMessage/Translate/SendMessage
	//	

	app.post('/login', upload.array(), function(req, res){
		var sql = "SELECT * FROM users WHERE Email = ? AND Password = ?"

		var params = [
			req.body.Email,
			appMain.hash(req.body.Password, config.SALT).passwordHash
		]

		// console.log(params)
		var query = connection.query(sql, params, function(err, rows) {
			console.log(rows)
			if(!err) {
				res.status(200).send("Successfully logged in!")
			} else {
				res.status(403).send("Incorrect password, try again:")
				// console.log(query)
			}
		});
	})

	app.post('/signup', upload.array(), function(req, res){

		var sql = "INSERT INTO users SET Name = ?, Email = ?, Password = ?, \
					Country = ?, CountryCode = ?, DesiredCountry = ?, \
					DesiredCountryCode = ?, Interest = ?, Token = ?"

		var params = [
			req.body.Name,
			req.body.Email,
			appMain.hash(req.body.Password, config.SALT).passwordHash,
			req.body.Country,
			req.body.CountryCode,
			req.body.DesiredCountry,
			req.body.DesiredCountryCode,
			req.body.Interest,
			req.body.Token
		]

		console.log(params)
		var query = connection.query(sql, params, function(err, result) {
			if (!err) {
				console.log('User signed up')
			} else{
				console.log('Error inserting into table: ', query.sql)
			}
		});

		res.status(200).send("Successfully signed up!")
	});
};

