const async = require('asyncawait/async');
const await = require('asyncawait/await');
const Busboy = require('busboy');

const AWS = require('aws-sdk');
AWS.config.loadFromPath(global.include.storage_config);

exports.upload_file = function(req, res){
    let busboy = new Busboy({headers: req.headers});
    let file_metadata = new Object();
    
    try{
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
	    var s3 = new AWS.S3({
		params: {Bucket: 'phare-development', Key: filename, Body: file},
		options: {partsize: 5 * 1024 * 1024, queueSize: 10}
	    });

	    s3.upload().send(function (err, data) {
		if(err) throw(err);
		console.log(err, data);
	    });
	});

	busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
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
