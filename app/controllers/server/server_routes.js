var router = require('express').Router();
var server_controller = require(global.include.controller.server.controller);

router.post('/create_server', server_controller.create_server);
router.post('/join_server', server_controller.join_server);

module.exports  = router;