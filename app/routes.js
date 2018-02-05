var express = require('express')
var router = express.Router()

require('./routes/index')(router);
require('./routes/customer')(router);
require('./routes/team')(router);
require('./routes/handover')(router);
require('./routes/queue')(router);
require('./routes/allocation')(router);

module.exports = router;
