const db = require(global.include.db);
const timestamp = require(global.include.helper.timestamp);

var async = require('asyncawait/async');
var await = require('asyncawait/await');


var server_user = function(sql_result){
	//server class
	this.id = sql_result.id; //autoincrement
	this.server_id = sql_result.server_id;
	this.user_id = sql_result.user_id;
	this.role = sql_result.role;
	this.joined_at = timestamp.timestamp_to_date(sql_result.joined_at);

	return this;
}

var get_by_id = function(id){
	return new Promise(function(resolve,reject){
		values = [id];
		db.get().query('SELECT * FROM server_user WHERE id=?', values, function(err,result){
			if(err){
				return reject(err);
			}
			if(result.length === 0)	{
				return resolve(null);
			}
			return resolve(server_user(result[0]));
		});
	});
}

var get_server_user = function(server_id, user_id){
	//cannot have same server_id and user_id
	return new Promise(function(resolve, reject){
		values = [server_id, user_id];
		db.get().query('SELECT * FROM server_user WHERE server_id=? AND user_id=?', values, function(err, result){
			if(err){
				return reject(err);
			}
			if(result.length === 0)	{
				return resolve(null);
			}
			return resolve(server_user(result[0]));
		});
	});
}

var create = function(server_id, user_id, role){
	//cannot have same server_id and user_id
	return new Promise(function(resolve, reject){
		values = [server_id, user_id, role];
		db.get().query('INSERT INTO server_user (server_id, user_id, role) VALUES (?,?,?)', values, function(err, result){
			if(err) return reject(err);
			//send resulting id to get_by_id
			return resolve(get_by_id(result.insertId));
		});
	});
}

module.exports = {
	get_by_id : get_by_id,
	create : create,
	get_server_user : get_server_user
}