function Database(configuration) {
	var connection = require('mysql');
	var host = configuration.host != undefined ? configuration.host : '127.0.0.1';
	var port = configuration.port != undefined ? configuration.port : '3306';
	var userName = configuration.userName;
	var password = configuration.password;
	var name = configuration.databaseName;
	

	this.insert = function(data, callback) {
		var con = connection.createPool({
			host: host,
			database: name,
			user: userName,
			password: password
		});
		
		var status = true;
		
		/*con.connect(function(err) {
			if (err) status = false;
		});
		if (!status) {
			return false;
		}*/
		var queryString = "insert into " + data.tableName + " (";
		var values = "values ("
		for (var i = 0; i < data.fields.length; i++) {
			queryString = queryString + data.fields[i] + ", ";
			values = values + (data.values[i] == 'now()' ?  data.values[i] + ", "  : "'" + data.values[i] + "', ");
		}
		queryString = queryString.trim().slice(0, -1) + ") " + values.trim().slice(0, -1) + ");";

		con.getConnection(function(err, connection) {
			connection.query( queryString, function(err, result) {
				connection.release();
				if (err) {
				}
				else {
					if (callback != undefined) {
						callback(result.insertId);
					}
				}
			});
		  });

		/*con.query(queryString, function(err, result) {
			if (err) {
			}
			else {
				if (callback != undefined) {
					callback(result.insertId);
				}
			}
		});*/
		/*con.end(function(err) {
			if(err) {
				console.log(err.message);
			}
		}); */
		
	};
	this.select = function(data, callback) {
		var con = connection.createPool({
			host: host,
			database: name,
			user: userName,
			password: password
		});
		
		var status = true;
		/*con.connect(function(err) {
			if (err != null) status = false;
			status = true;
		});
		if (!status) {
			return false;
		} */
		var select = "select "
		for (var i = 0; i < data.fields.length; i++) {
			select = select + data.fields[i] + ", ";
		}
		select = select.trim().slice(0, -1) + " from " + data.tableName;
		if (data.where != undefined) {
			select = select + " where " + data.where;
		}
		if (data.orderBy != undefined) {
			select = select + " order by " + data.orderBy; 
		}
		if (data.sequence != undefined) {
			select = select + " " + data.sequence;
		}
		if (data.limit != undefined) {
			select = select + " limit " + limit;
		}
		select = select + ";";

		con.getConnection(function(err, connection) {
			connection.query( select, function(err, res) {
				connection.release();
				if (err) console.log(err);
				else {
					callback(res);
				}
			});
		  });
		/*con.query(select, function(err, res) {
			if (err) console.log(err);
			else {
				callback(res);
			}
		});*/
		/*con.end(function(err) {
			if(err) {
				console.log(err.message);
			}
		});*/
		
	};
	this.update = function(data) {
		var con = connection.createPool({
			host: host,
			database: name,
			user: userName,
			password: password
		});
		
		var status = true;
		/*con.connect(function(err) {
			if (err != null) status = false;
			status = true;
		});
		if (!status) {
			return false;
		}*/
		var updateString = "update " + data.tableName + " set ";
		for (var i = 0; i < data.cols.length; i++) {
			updateString =  updateString + data.cols[i] + "='" + data.values[i] + "', ";
		}
		updateString = updateString.trim().slice(0, -1) + ' where ' + data.condition + ';';

		con.getConnection(function(err, connection) {
			connection.query( updateString, function(err, rows) {
				if (err) status = false;
			  	connection.release();
			});
		  });

		/*con.query(updateString, function(err, res) {
			if (err) status = false;
		});*/
		/*con.end(function(err) {
			if(err) {
				console.log(err.message);
			}
		});*/
		
		return status;
	};
	this.delete = function(query) {
		var con = connection.createPool({
			host: host,
			database: name,
			user: userName,
			password: password
		});
		
		var status = true;
		/*con.connect(function(err) {
			if (err != null) status = false;
			status = true;
		});
		if (!status) {
			return false;
		}*/
		con.getConnection(function(err, connection) {
			connection.query( query, function(err, rows) {
			  connection.release();
			});
		  });
		//con.query(query);
		/*con.end(function(err) {
			if(err) {
				console.log(err.message);
			}
		});*/
	};
}
module.exports = Database;