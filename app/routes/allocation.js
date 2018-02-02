/**
 * Created by jane.gleadall on 02/02/2018.
 */
const allocation = require("../controllers/allocationController.js");

module.exports = function(router) {

    router.get('/allocation/esa', allocation.officeESABeforePage);
    router.post('/allocation/esa', allocation.officeESABeforePageAction);

}