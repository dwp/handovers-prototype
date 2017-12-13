/**
 * Created by jane.gleadall on 27/11/2017.
 */
var queue = require("../controllers/queueController.js");

module.exports = function(router) {

    // Queue page routes
    router.get('/queue/view', queue.viewQueuePage);
    router.post('/queue/getNextQueueItem', queue.getNextQueueItem);

}