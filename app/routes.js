var express = require('express')
var router = express.Router()

require('./routes/index')(router);
require('./routes/claimant')(router);
require('./routes/team')(router);
require('./routes/handover')(router);
require('./routes/queue')(router);

module.exports = router;
