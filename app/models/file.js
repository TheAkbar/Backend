const db = require(global.include.db);
const async = require('asyncawait/async');
const await = require('asyncawait/await');

var file = function(sql_result){
    this.id = sql_result.id;
    this.server_user_id = sql_result.server_user_id;
    this.thumbnail_file_name = sql_result.thumbnail_file_name;
    this.file_name = sql_result.file_name;
    this.uploaded_at = sql_result.uploaded_at;
    this.file_size = sql_result.file_size;
    this.file_type = sql_result.file_type;
}

var get_by_id = function(id){
    return new Promise(function(resolve, reject){
	values = [id];
	db.get().query('SELECT * FROM files WHERE id=?', values, function(err, result){
	    if(err) return reject(err);
	    return resolve(file(result[0]));
	});
    });
}

var create_with_thumbnail = function(server_user_id, thumbnail_name, file_size, file_type){
    return new Promise(function(resolve, reject){
	values = [server_user_id, thumbnail_name, file_size, file_type];
	db.get().query('INSERT INTO files (server_user_id, thumbnail_file_name, file_size, file_type) VALUES (?,?,?,?)', values, function(err, result){
	    if(err) return reject(err);
	    return resolve(get_by_id(result.insertId));
	});
    });
}

module.exports = {
    get_by_id: get_by_id,
    create_with_thumbnail: create_with_thumbnail
}
