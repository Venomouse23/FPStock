const Database = require('../database/database.js');
const escape = require('escape-html');
const generator = require('generate-password');
const passwordHash = require('password-hash');
function User(username, email, id) {
	var name = username;
	var ID = id;
	var mail = email;
	var wallet = new Wallet(id);
	this.getName = function() {
		return name;
	};
}
User.createNewUser= function (app, firstName, lastName, username, password, email) {
	var db = new Database(require('../database/conf.json'));
	//validate first name
	//allow double first and last name
	var flnreg = new RegExp(/(([A-Z]{1})[a-z]{1,})/);
	if (!flnreg.test(firstName)) {
		return {
			code: -1,
			firstName: false
		}
	}
	if (!flnreg.test(lastName)) {
		return {
			code: -1,
			//we have arledy checked first name
			firstName: true,
			lastName: false
		}
	}
	var fetchInsertID = function(id) {
		if (id > 0) {
			var sesid = generator.generate({
				length: 120,
				numbers: true,
				uppercase: true,
				symbols: true
			});
			var date = new Date();
			var endSession = new Date(date);
			endSession.setTime(date.getTime() + 30 * 60 * 1000);
			var year = endSession.getFullYear();
			var day = endSession.getDate();
			var month = endSession.getMonth() + 1;
			var hour = endSession.getHours();
			var minutes = endSession.getMinutes();
			var seconds = endSession.getSeconds();
			var timeString = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day :  day) + ' ' + (hour < 10 ? '0' + hour : hour) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
			db.insert({
				tableName: 'sessions',
				fields: ['token', 'userID', 'expireDate'],
				values: [sesid, id, timeString]
			});
			db.insert({
				tableName: 'wallets',
				fields: ['userID'],
				values: [id]
			});
		}
		app.json({
			code: 1,
			sesID: sesid
		});
	};
	db.insert({
		tableName: 'users',
		fields: ['firstName', 'lastName', 'userName', 'email', 'password', 'created_at'],
		values: [escape(firstName), escape(lastName), escape(username), escape(email), passwordHash.generate(password), 'now()']
	},fetchInsertID);
	// console.log(id);
	// if (db.insert({
	// 	tableName: 'users',
	// 	fields: ['firstName', 'lastName', 'userName', 'email', 'password', 'created_at'],
	// 	values: [escape(firstName), escape(lastName), escape(username), escape(email), passwordHash.generate(password), 'now()']
	// })) {
	// 	var id = db.select({
	// 		tableName: 'users',
	// 		fields: ['id'],
	// 		where: 'userName=\'' + escape(username) + '\'' 
	// 	});
	// 	console.log(id);
	// }
}



module.exports = User;
