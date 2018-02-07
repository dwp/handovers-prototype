const handover = require("../controllers/handoverController.js");

module.exports = function(router) {

    // Handover page routes
    router.get('/handover/view', handover.viewHandoverPage);
    router.post('/handover/view', handover.viewHandoverPageAction);
    router.get('/handover/edit', handover.editHandoverPage);
    router.post('/handover/edit', handover.editHandoverPageAction);
    router.get('/handover/create', handover.createHandoverPage);
    router.post('/handover/create', handover.createHandoverPageAction);
}