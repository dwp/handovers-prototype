module.exports = function(router, users){
  router.get('/toggle_user_role', function(req, res, next){
    if(req.session.user){
      var indexOfUser = users.indexOf(users.find((user) => req.session.user.name === user.name));
      var newIndex = ((indexOfUser + 1) % (users.length));
      req.session.user = users[newIndex];
    } else {
      req.session.user = users[1];
    }
    res.redirect('/queue/view?agentId=' + req.session.user.id);
  });
}