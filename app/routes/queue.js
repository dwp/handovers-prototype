/**
 * Created by jane.gleadall on 27/11/2017.
 */
const queue = require("../controllers/queueController.js");

module.exports = function(router) {

    // Queue page routes
    router.get('/queue/view', queue.viewQueuePage);
    router.post('/queue/getNextQueueItem', queue.getNextQueueItem);
    router.get('/queue/agent', queue.agentQueuePage);
    router.post('/queue/agent', queue.agentQueuePageAction);

}