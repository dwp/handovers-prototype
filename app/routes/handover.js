var handover = require("../controllers/handoverController.js");

module.exports = function(router) {

    // Handover page routes
    router.get('/handover/create', handover.createHandoverPage);
    router.post('/handover/create', handover.createHandoverPageAction);
}