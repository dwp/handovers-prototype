module.exports = function(router, usersForRoleToggle){
  router.get('/toggle_user_role', function(req, res, next){
    let fromIndexPage = !req.header('Referer').endsWith('/');
    if(req.session.user){
      let indexOfUser = usersForRoleToggle.indexOf(usersForRoleToggle.find((user) => req.session.user.name === user.name));
      let newIndex = ((indexOfUser + 1) % (usersForRoleToggle.length));
      req.session.user = usersForRoleToggle[newIndex];
    } else {
      req.session.user = usersForRoleToggle[1];
    }
    if (fromIndexPage) {
      res.redirect('/queue/view');
    } else {
      res.redirect('/queue/view?agentId=' + req.session.user.id);
    }
  });
}
