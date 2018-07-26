const server = require(global.include.model.server);
const server_user = require(global.include.model.server_user);
const auth_token = require(global.include.model.auth_token);
const db = require(global.include.db);

var async = require('asyncawait/async');
var await = require('asyncawait/await');

var join_server = async function(req, res){
	let params = req.query;
	if(!params.hasOwnProperty('code') || !params.hasOwnProperty('auth_token')){
		res.sendStatus(400);
	}

	let req_code = params.code;
	let req_token  = params.auth_token;

	try{
		//use auth token to verify and get user
		var curr_user = await auth_token.verify_token(req_token);
		//user verified and returned
		var returned_server = await server.verify_code(req_code);

		//now we need to use token to create server_user
		var returned_server_user = await server_user.get_server_user(returned_server.id, returned_server.user_id);
		if(returned_server_user == null){
			var new_server_user = await server_user.create(returned_server.id, curr_user.user_id, 'user');

			res.send(200);
		}
		else {
			console.log('Cant join server youre already in');
			res.sendStatus(400);
		}
		
	}
	catch(err){
		console.log(err);
		res.sendStatus(400);
	}
}

var create_server = async function(req, res){

	//post request must have auth token, name

	let params = req.query;
	if(!params.hasOwnProperty('name') || !params.hasOwnProperty('auth_token') || !params.hasOwnProperty('code')){
		res.sendStatus(400);
	}

	let req_name = params.name;
	let req_code = params.code;
	let req_token  = params.auth_token;

	try{
		//use auth token to verify and get user
		var curr_user = await auth_token.verify_token(req_token);
		//user verified and returned

		//create a server
		var new_server = await server.create(req_name, req_code, curr_user.user_id);

		//now we need to use token to create server_user
		var new_server_user = await server_user.create(new_server.id, curr_user.user_id, 'god');

		res.send(200);
	}
	catch(err){
		console.log(err);
		res.sendStatus(400);
	}
}

module.exports = {
	join_server : join_server,
	create_server : create_server
}