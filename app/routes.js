var express = require('express')
var router = express.Router()
var usersForRoleToggle = require('./usersForRoleToggle');

require('./routes/init')(router, usersForRoleToggle);
require('./routes/index')(router);
require('./routes/toggle-user-role')(router, usersForRoleToggle);
require('./routes/customer')(router);
require('./routes/team')(router);
require('./routes/handover')(router);
require('./routes/queue')(router);

module.exports = router;
