/**
 * Created by jane.gleadall on 02/02/2018.
 */
function officeESABeforePage(req, res) {

    res.render('allocationFlow/officeESAMaintQBefore.html');
}

function officeESABeforePageAction(req, res) {

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
module.exports.officeESABeforePage = officeESABeforePage;
module.exports.officeESABeforePageAction = officeESABeforePageAction;

