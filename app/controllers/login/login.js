const user = require(global.include.model.user);
const fb_user = require(global.include.model.facebook_user);

exports.authenticate_with_facebook = function(req, res){
	let params = req.query;
	if(!params.hasOwnProperty('access_token')){
		res.sendStatus(400);
	}

	let token = params.access_token;
	fb_user.get_facebook_user_by_token(token, function(err, fb_user){
		if(err) res.send(400);
		fb_user.get_user(function(err, user){ // should probably just be fb_user get_auth_token
			if(err) res.send(501);
			res.send(user.get_auth_token());
		});
	});
}

exports.authenticate_generic = function(req, res){
	
}
