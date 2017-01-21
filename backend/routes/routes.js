var appMain = require('../app.js')
var config = require('../configure.js')
var multer  = require('multer')
var upload = multer()
var mysql = require('mysql');

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

	app.post('/signup', upload.array(), function(req, res){
		// create table users(
		// id INT AUTO_INCREMENT,
		// Name VARCHAR(40),
		// Email VARCHAR(40),
		// Password VARCHAR(100),
		// Country VARCHAR(40),
		// CountryCode VARCHAR(10),
		// DesiredCountry VARCHAR(40),
		// DesiredCountryCode VARCHAR(10),
		// Interest VARCHAR(40),
		// Token VARCHAR(60),
		// PRIMARY KEY (id));

		console.log(name)
		console.log(age)

		var sql = "INSERT INTO test SET Name = ?, Email = ?, Password = ?, \
					Country = ?, CountryCode = ?, DesiredCountry = ?, \
					DesiredCountryCode = ?, Interest = ?, Token = ?";

		var params = [
			req.body.Name,
			req.body.Email,
			req.body.Password, //need to hash/salt
			req.body.Country,
			req.body.CountryCode,
			req.body.DesiredCountry,
			req.body.DesiredCountryCode,
			req.body.Interest,
			req.body.Token
		]

		connection.connect();
		var query = connection.query(sql, params, function(err, result) {
			if (!err) {
				console.log('User signed up')
			} else{
				console.log('Error inserting into table: ', query.sql)
			}
		});
		connection.end();

		res.status(200).send("Successfully signed up!")
	});
};