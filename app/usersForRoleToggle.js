const teamData = require('./data/teamData.json');

module.exports = function(){
    let users = teamData['users'];
    return users;
}
