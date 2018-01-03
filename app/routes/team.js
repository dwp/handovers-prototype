/**
 * Created by janegleadall on 24/08/2017.
 */
var team = require("../controllers/teamController.js");

module.exports = function(router) {

    router.get('/team/user/add', team.teamUserAddPage);
    router.post('/team/user/add', team.teamUserAddPageAction);
    router.get('/team/skillset/add', team.teamSkillsetAddPage);
    router.post('/team/skillset/add', team.teamSkillsetAddPageAction);
}
