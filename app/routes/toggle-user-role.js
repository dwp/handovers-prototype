module.exports = function(router, usersForRoleToggle) {
  router.get('/toggle_user_role', function(req, res, next) {

    let fromIndexPage = req.header('referer').endsWith('/');
    if(req.session.user) {
      let userName = (req.session.user.firstName + ' ' + req.session.user.lastName);
      let indexOfUser = usersForRoleToggle.indexOf(usersForRoleToggle.find((user) => (userName === (user.firstName + ' ' + user.lastName))));
      let newIndex = ((indexOfUser + 1) % (usersForRoleToggle.length));
      req.session.user = usersForRoleToggle[newIndex];
    } else {
      req.session.user = usersForRoleToggle[1];
    }
    if (fromIndexPage) {
      res.redirect('/queue/view?queueType=office');
    } else {
      res.redirect('/queue/view?agentId=' + req.session.user.staffId);
    }
  });
}
