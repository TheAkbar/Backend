const db = require(global.include.db);
const timestamp = require(global.include.helper.timestamp);

var async = require('asyncawait/async');
var await = require('asyncawait/await');


var server = function(sql_result){
	//server class
	this.id = sql_result.id; // auto increment
	this.name = sql_result.name;
	this.code = sql_result.code;
	if(sql_result.active === 1){
		this.active = true;
	}
	else {
		this.active = false;
	}
	//this.active = sql_result.active;
	this.created_at = timestamp.timestamp_to_date(sql_result.created_at);
	this.created_by = sql_result.created_by;

	return this;
}

var get_by_code = function(code){
	return new Promise(function(resolve,reject){
		values = [code];
		db.get().query('SELECT * FROM server WHERE code=?', values, function(err,result){
			
			if(err){
				return reject(err);
			}
			if(result.length === 0)	{
				return resolve(null);
			}
			//resolve with server
			return resolve(server(result[0]));
			
		});
	});
}

var verify_code = async function(code){
	var returned_server = await get_by_code(code);
	if(returned_server == null){
		throw 'No server with code found';
	}
	if(!returned_server.active){
		throw 'Server is inactive';
	}
	return returned_server;
}

var get_by_id = function(id){
	return new Promise(function(resolve,reject){
		values = [id];
		db.get().query('SELECT * FROM server WHERE id=?', values, function(err,result){
			if(err){
				return reject(err);
			}
			if(result.length === 0)	{
				return resolve(null);
			}
			return resolve(server(result[0]));
		});
	});
}

var create = function(name, code, created_by){
	return new Promise(function(resolve, reject){
		values = [name, code, true, created_by];
		db.get().query('INSERT INTO server (name, code, active, created_by) VALUES (?,?,?,?)', values, async function(err, result){
			//should check that code in unique, if not an err will be thrown
			if(err) return reject(err);
			//send resulting id to get_by_id
			return resolve(get_by_id(result.insertId));
		});
	});
}

module.exports = {
	get_by_id : get_by_id,
	create : create,
	get_by_code : get_by_code,
	verify_code : verify_code
}