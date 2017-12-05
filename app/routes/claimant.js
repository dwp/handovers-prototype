/**
 * Created by janegleadall on 24/08/2017.
 */
var claimant = require("../controllers/claimantController.js");

module.exports = function(router) {

    // Claimants page routes
    router.get('/claimant/find', claimant.claimantFindPage);
    router.get('/claimant/view', claimant.claimantViewPage);
    router.get('/claimant/find', claimant.claimantFindPage);
    router.post('/claimant/find', claimant.claimantFindPageAction);
    router.get('/claimant/create', claimant.claimantCreatePage);
    router.post('/claimant/create', claimant.claimantCreatePageAction);
    router.get('/claimant/edit', claimant.claimantEditPage);
    router.post('/claimant/edit', claimant.claimantEditPageAction);
}