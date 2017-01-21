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
		var name = connection.escape(req.body.Name)
		var age = connection.escape(req.body.Age)

		console.log(name)
		console.log(age)

		var sql = "INSERT INTO test SET Name = "  + name + ", Age = " + age;
		sql = "INSERT INTO test SET `Name` = 'Brad', `Age` = '177'"

		connection.connect();
		var query = connection.query(sql, function(err, result) {
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