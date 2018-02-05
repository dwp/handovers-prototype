/**
 * Created by jane.gleadall on 02/02/2018.
 */
const allocation = require("../controllers/allocationController.js");

module.exports = function(router) {

    router.get('/allocation/esa', allocation.officeESAPage);
    router.post('/allocation/esa', allocation.officeESAPageAction);
    router.get('/allocation/user', allocation.userQueuePage);
    router.post('/allocation/user', allocation.userQueuePageAction);

}