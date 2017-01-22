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

	app.post('/getConnection', upload.array(), function(req, res) {
		var sql = "SELECT * FROM users WHERE id = ?"
		var params = [
			req.body.FromId
		]

		var query = connection.query(sql, params, function(err, result) {
			if (!err) {
				params = [
					result[0]['DesiredCountry'],
					result[0]['id'],
					result[0]['Interest']
				]

				sql = "SELECT Name, Country, Interest, Token FROM users WHERE Country = ? AND id NOT IN ?\
						 AND Interest = ? ORDER BY RAND() LIMIT 1"

				query = connection.query(sql, params, function(err, result) {
					if (!err) {
						res.status(200).send(result[0])
					} else {
						params.pop()

						sql = "SELECT Name, Country, Interest, Token FROM users WHERE Country = ?\
								 AND id NOT IN (?) ORDER BY RAND() LIMIT 1"
						
						query = connection.query(sql, params, function(err, result) {
							if (!err && typeof result[0] != 'undefined') {
								res.status(200).send(result[0])
							} else {
								console.log('Error retrieving from table: ', query.sql)
								res.status(501).send("No matches found")
							}
						});
					}
				});
			} else {
				res.status(501).send("No matches found")
			}
		});
	})


	app.post('/messagepost', function(req, res){
		// console.log(res.body); // json
		// should be the form 
			/*body {
				to_id : (int) user table
				from_id : (int) user_table
				content : string/plain_text
				date_time_sent : date
		*/
		//--------------------------------------------------------------------------------------------
		var jsoncontent = JSON.parse(response.body);

		var jsoncontent = {
			to_id : "7",
			from_id : "1",
			content : "Bonjour",
			date_time_sent : "10/10/10"
		};

		connection.query('SELECT * FROM users WHERE id=' + connection.escape(jsoncontent.to_id), function(err, rows){
			// connection.query('SELECT * FROM users WHERE id=1', function(err, rows){
			if(err){
				console.log("Error slected from DB: line 98");
			}else{
				native_lang = rows[0].CountryCode;
				translated_message = appMain.translateText(jsoncontent.content);
				var data = {};
				var key = 'Message'
				data[key] = [];
				var vals = {
					to_id : jsoncontent.to_id,
					from_id : jsoncontent.from_id,
					content : translated_message,
					date_time_sent : jsoncontent.date_time_sent
				};
				data[key].push(vals);
				appMain.sendMessageToUser(rows[0].Token, JSON.stringify(data));
			}
		});
	});
};

