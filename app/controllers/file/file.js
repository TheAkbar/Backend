const async = require('asyncawait/async');
const await = require('asyncawait/await');
const path = require('path');
const uuid4 = require('uuid/v4');
const Busboy = require('busboy');
const AWS = require('aws-sdk');

AWS.config.loadFromPath(global.include.storage_config);

exports.upload_metadata = function(req, res){
    try{
	let busboy = new Busboy({headers: req.headers});
	let file_metadata = new Object();
	
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
	    let new_filename = 'thmb-' + uuid4() + path.extname(filename);
	    file_metadata['filename'] = new_filename;
	    var s3 = new AWS.S3({
		params: {Bucket: 'phare-development', Key: new_filename, Body: file},
		options: {partsize: 5 * 1024 * 1024, queueSize: 10}
	    });

	    s3.upload().send(function (err, data) {
		if(err) throw(err);
	    });
	});

	busboy.on('field', function(fieldname, val, fieldnameTrunc, valTrunc, encoding, mimetype) {
	    file_metadata[fieldname] = val;
	});

	busboy.on('finish', function(){
	    console.log(file_metadata);
	    res.sendStatus(200);
	})
	req.pipe(busboy);
    } catch (err) {
	console.log(err);
	res.sendStatus(500);
    }
}

exports.upload_file = async function(req, res){
    try{
	let busboy = new Busboy({headers: req.headers});
	// let uploaded_file = await 
	
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
	    let new_filename = uuid4() + path.extname(filename);
	    var s3 = new AWS.S3({
		params: {Bucket: 'phare-development', Key: new_filename, Body: file},
		options: {partsize: 5 * 1024 * 1024, queueSize: 10}
	    });

	    s3.upload().send(function (err, data) {
		if(err) throw(err);
	    });
	});

	busboy.on('finish', function(){
	    res.sendStatus(200);
	})
	req.pipe(busboy);
    } catch (err) {
	console.log(err);
	res.sendStatus(500);
    }
}
