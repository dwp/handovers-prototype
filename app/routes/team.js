/**
 * Created by janegleadall on 24/08/2017.
 */
var team = require("../controllers/teamController.js");

module.exports = function(router) {

    router.get('/team/user/add', team.teamUserAddPage);
    router.post('/team/user/add', team.teamUserAddPageAction);
    router.get('/team/queue/add', team.teamQueueAddPage);
    router.post('/team/queue/add', team.teamQueueAddPageAction);
}
