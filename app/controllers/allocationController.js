/**
 * Created by jane.gleadall on 02/02/2018.
 */
function officeESAPage(req, res) {

    res.render('allocationFlow/officeESAMaintQBefore.html');
}

function officeESAPageAction(req, res) {

    let user1 = req.body['user-allocation-1'];
    let user2 = req.body['user-allocation-2'];
    let user3 = req.body['user-allocation-3'];
    let user4 = req.body['user-allocation-4'];
    let users = {
        user1 : user1,
        user2 : user2,
        user3 : user3,
        user4 : user4
    };
    res.render('allocationFlow/officeESAMaintQAfter.html', users);

}

function userQueuePage(req, res) {

    res.render('allocationFLow/userQBefore.html');

}

function userQueuePageAction(req, res) {

    res.render('allocationFlow/userQAfter.html');

}

module.exports.officeESAPage = officeESAPage;
module.exports.officeESAPageAction = officeESAPageAction;
module.exports.userQueuePage = userQueuePage;
module.exports.userQueuePageAction = userQueuePageAction;


