var router = require('express').Router();
var files = require(global.include.controller.file.controller);

router.post('/upload', files.upload_file);

module.exports = router;
