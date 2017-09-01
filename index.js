const express = require('express');
const Database = require('./database/database.js');
const User = require('./models/user');
const Wallet = require('./models/wallet');
const app = express();
const db = new Database(require('./database/conf.json'));
const escape = require('escape-html');
const generator = require('generate-password');
const passwordHash = require('password-hash');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var cookieParser = require('cookie-parser');
var ReactEngine = require('express-react-engine');
var bodyParser = require('body-parser')
var babel =  require('babel-core/register')({
    presets: ['es2015', 'react']
})


//download data in loop
var serverStatus = true;
var lastPrices;
setInterval(function() {
	console.log('[LOG] Updating prices at ' + new Date().toDateString());
	var req = new XMLHttpRequest();
	req.open("GET", 'http://webtask.future-processing.com:8068/stocks', true);
	req.setRequestHeader("Content-Type", "application/json");
	req.onreadystatechange = function(ans) {
		if (req.readyState == 4) {
			if (req.status == 200) {
				serverStatus = true;
				lastPrices  = JSON.parse(req.responseText);
				var pubDate = new Date(lastPrices.publicationDate);
				for (var i = 0; i <lastPrices.items.length; i++) {
					var month = pubDate.getMonth() + 1;
					month = (month < 10 ? '0' + month : month);
					var day = (pubDate.getDate() < 10 ? '0' + pubDate.getDate() : pubDate.getDate());
					db.insert({
						tableName: 'prices',
						fields: ['companyID', 'price', 'priceDate'],
						values: [i + 1, lastPrices.items[i].price, (pubDate.getFullYear() + '-' + month + '-' + day + ' ' + (pubDate.getHours() < 10 ? '0' + pubDate.getHours() : pubDate.getHours()) + ':' + (pubDate.getMinutes() < 10 ? '0' + pubDate.getMinutes() : pubDate.getMinutes()) + ':' + (pubDate.getSeconds() < 10 ? '0' + pubDate.getSeconds() : pubDate.getSeconds()))]
					});
					db.select({
						tableName: 'companies',
						fields: ['*'],
						where: 'id=' + (i + 1)
					}, function(res) {
						db.update({
							tableName: 'companies',
							cols: ['units'],
							values: [res[0].units + lastPrices.items[res[0].id - 1].unit],
							condition: 'id=' + res[0].id
						});
					})
				}
			} else {
				serverStatus = false;
			}
		}
	}
	req.send();
}, 3000);


app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', ReactEngine({wrapper: 'index.jsx'}));

app.use(express.static( __dirname + '/assets'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.post('/register', function(req, res) {
	if (req.body.password != req.body.passwordConfirm) {
		res.send(JSON.stringify({
			code: -1,
			password: false
		}));
	}
	User.createNewUser(res, req.body.firstName, req.body.lastName, req.body.username, req.body.password, req.body.email);
});
app.get('/', function (req, res) {
	if (req.cookies.sesid != undefined) {
		res.redirect('/account');
	} else {
		res.render('home.jsx', { isLoggedIn: false, mainClass: 'home' });
	}
});
app.get('/register', function (req, res) {
    res.render('register.jsx', { isLoggedIn: false, mainClass: 'subpage' });
});
app.get('/account', function (req, res) {
	if (req.cookies.sesid == undefined) {
		res.redirect('/');
	} else {
		db.select({
			tableName: 'sessions',
			fields: ['userID', 'expireDate'],
			where: 'token=\'' + req.cookies.sesid + '\''
		}, function(result) {
			if (result.length > 0) {
				var expire = new Date(result[0].expireDate);
				var now = new Date();
				if (now > expire) {
					db.delete("delete from sessions where token='" + req.cookies.sesid + "';");
					res.clearCookie('sesid').redirect('/');
				} else {
					db.select({
						tableName: 'users',
						fields: ['*'],
						where: 'id='+result[0].userID
					}, function(resp) {
						db.select({
							tableName: 'wallets',
							fields: ['*'],
							where: 'userID='+result[0].userID
						}, function(respon) {
							db.select({
								tableName: 'stocks',
								fields: ['*'],
								where: "walletID=" + respon[0].id
							}, function(respons) {
								var data = {
									isLoggedIn: true,
									mainClass: "subpage stock",
									name: resp[0].firstName + ' ' + resp[0].lastName,
									prices: lastPrices.items,
									canIBuy: serverStatus,
									wallet: respon[0],
									stocks: respons,
								};
								res.render('account.jsx', data);
							});
						});
					})
					
				}
			}
		});
		
	}
});
app.get('/profile', function (req, res) {
    res.render('profile.jsx', {isLoggedIn: true, mainClass: "subpage profile"})
});

app.post('/login', function(req, response) {
	db.select({
		tableName: 'users',
		fields: ['id','password'],
		where: 'userName=\'' + escape(req.body.username) + '\''
	}, function(res) {
		if (res.length > 0) {
			if (passwordHash.verify(req.body.password, res[0].password)) {
				var logID = res[0].id;
				var sesid = generator.generate({
					length: 120,
					numbers: true,
					uppercase: true,
					symbols: true
				});
				var endSession = new Date();
				endSession.setTime(endSession.getTime() + 30 * 60 * 1000);
				var year = endSession.getFullYear();
				var day = endSession.getDate();
				var month = endSession.getMonth() + 1;
				var hour = endSession.getHours();
				var minutes = endSession.getMinutes();
				var seconds = endSession.getSeconds();
				var timeString = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day :  day) + ' ' + (hour < 10 ? '0' + hour : hour) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
				db.insert({
					tableName: 'sessions',
					fields: ['userID', 'token', 'expireDate'],
					values: [logID, sesid, timeString]
				}, function(derp) {
					response.json({
					code: 1,
					sesID: sesid
				});
				});
				
				
			} else {
				response.json({
					code: -1
				});
			}
			
		} else {
			response.json({
				code: -1
			});
		}

	})
});
app.post('/money', function(req, res) {
	var cookie = req.cookies.sesid;
	db.select({
		tableName: 'sessions',
		fields: ['userID'],
		where: 'token=\'' + cookie + '\''
	}, function(result) {
		if (result.length > 0) {
			db.select({
				tableName: 'wallets',
				fields: ['cashAmount'],
				where: 'userID='+result[0].userID
			}, function(resul) {
				db.update({
					tableName: 'wallets',
					cols: ['cashAmount'],
					values: [req.body.amount +  resul[0].cashAmount],
					condition: 'userID=' + result[0].userID
				});
				res.json({
					code: 1
				})
			});
		} else {
			res.json({
				code: -1
			})
		}
	});
});
app.post('/buy', function(req, res) {
	var cookie = req.cookies.sesid;
	db.select({
		tableName: 'sessions',
		fields: ['userID'],
		where: 'token=\'' + cookie + '\''
	}, function(result) {
		if (result.length > 0) {
			db.select({
				tableName: 'wallets',
				fields: ['*'],
				where: 'userID='+result[0].userID
			}, function(resul) {
				db.select({
					tableName: 'companies',
					fields: ['*'],
					where: 'code=\'' + escape(req.body.companyCode) + '\''
				}, function(buyRes) {
					if (buyRes.length > 0) {
						if (resul[0].cashAmount > lastPrices.items[buyRes[0].id - 1].price && buyRes[0].units > 0) {
							db.update({
								tableName: 'companies',
								cols: ['units'],
								values: [buyRes[0].units - 1],
								condition: 'id=' + buyRes[0].id
							});
							db.update({
								tableName: 'wallets',
								cols: ['cashAmount'],
								values: [resul[0].cashAmount - lastPrices.items[buyRes[0].id - 1].price],
								condition: 'id=' + resul[0].id
							});
							db.select({
								tableName: 'stocks',
								fields: ['*'],
								where: 'companyID=' + buyRes[0].id + ' and walletID=' + resul[0].id
							}, function(exist) {
								if (exist.length > 0) {
									db.update({
										tableName: 'stocks',
										cols: ['amount'],
										values: [exist[0].amount + 1],
										condition: 'walletID=' + resul[0].id + ' and companyID=' + buyRes[0].id
									});
									res.json({
										code: 1
									})
								} else {
									db.insert({
										tableName: 'stocks',
										fields: ['walletID', 'companyID', 'amount'],
										values: [resul[0].id, buyRes[0].id, 1]
									});
									res.json({
										code: 1
									})
								}
							})
						} else {
							res.json({
								code: -2
							})
						}
					} else {
						res.json({
							code: -1
						});
					}
				})
			});
		} else {
			res.json({
				code: -1
			})
		}
	});
});
app.get('/logout', function(req, res) {
	var sesid = req.cookies.sesid;
	db.delete('delete from sessions where token=\'' + sesid + '\';');
	res.clearCookie('sesid').redirect('/');
});
app.post('/sell', function(req, res) {
	var companyID = escape(req.body.companyCode);
	var walletID = escape(req.body.walletCode);
	db.select({
		tableName: 'companies',
		fields: ['*'],
		where: 'id=' + companyID
	}, function(company) {
		if (company.length > 0) {
			db.select({
				tableName: 'wallets',
				fields: ['*'],
				where: 'id=' + walletID
			}, function(wallet) {
				if (wallet.length > 0) {
					db.select({
						tableName: 'stocks',
						fields: ['*'],
						where: 'companyID=' + companyID + ' and walletID=' + walletID
					}, function(stock) {
						if (stock.length > 0) {
							db.update({
								tableName: 'companies',
								cols: ['units'],
								values: [company[0].units + 1],
								condition: 'id=' + companyID
							});
							db.update({
								tableName: 'wallets',
								cols: ['cashAmount'],
								values: [wallet[0].cashAmount + lastPrices.items[companyID - 1].price],
								condition: 'id=' + walletID
							})
							if (stock[0].amount == 1) {
								db.delete('delete from stocks where walletID=' + walletID + ' and companyID=' + companyID);
							} else {
								db.update({
									tableName: 'stocks',
									cols: ['amount'],
									values: [stock[0].amount - 1],
									condition: 'walletID=' + walletID + ' and companyID=' + companyID
								})
							}
							res.json({
								code: 1
							})
						} else {
							res.json({
								code: -1
							})
						}
					});
				} else {
					res.json({
						code: -1
					});
				}
			})
		} else {
			res.json({
				code: -1
			})
		}
	})
});

app.listen('8080');