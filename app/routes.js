var express = require('express')
var router = express.Router()
var users = require('./users')();

require('./routes/init')(router, users);
require('./routes/index')(router);
require('./routes/toggle-user-role')(router, users);
require('./routes/customer')(router);
require('./routes/team')(router);
require('./routes/handover')(router);
require('./routes/queue')(router);

module.exports = router;
