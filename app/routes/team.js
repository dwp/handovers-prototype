/**
 * Created by janegleadall on 24/08/2017.
 */
var team = require("../controllers/teamController.js");

module.exports = function(router) {

    // Teams page routes
    //router.get('/team/view', team.teamViewPage);
    //router.get('/team/edit', team.teamEditPage);
    //router.post('/team/edit', team.teamEditPageAction);
    router.get('/team/user/add', team.teamUserAddPage);
    router.post('/team/user/add', team.teamUserAddPageAction);
    router.get('/team/queue/add', team.teamQueueAddPage);
    router.post('/team/queue/add', team.teamQueueAddPageAction);
}
