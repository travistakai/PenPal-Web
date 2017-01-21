var appMain = require('../app.js')

module.exports = function (app) {
    // set up the routes themselves
    app.get('/', function(req, res){
		res.status(200).send("This is the landing page");
	});


	app.get('/messaging', function(req, res){
		res.status(200).send("Thus is me sending a message");

		appMain.sendMessageToUser("travis", "test test test");

	});
};