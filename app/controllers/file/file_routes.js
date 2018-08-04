var router = require('express').Router();
var files = require(global.include.controller.file.controller);

router.post('/upload_data', files.upload_metadata);
//router.post('/upload_file', files.upload_file);

module.exports = router;
