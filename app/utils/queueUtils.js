function getListOfAvailableQueues(team, fullQueueList) {

    var availableQueues = [];
    var allQueues = fullQueueList;

    for (var i=0; i < allQueues.length; i++) {
        if (checkIfQueueAlreadyInTeam(allQueues[i], team) === false) {
            var availableQueue = allQueues[i];
            availableQueues.push(availableQueue);
        }
    }
    return availableQueues;
}

function checkIfQueueAlreadyInTeam(queue, team) {
    var result = false;
    var inputTeamQueues = team.queueList;

    for (var j=0; j < inputTeamQueues.length; j++) {

        if (queue.id === inputTeamQueues[j].id) {
            result = true;
        }
    }

    return result;
}

module.exports.getListOfAvailableQueues = getListOfAvailableQueues;