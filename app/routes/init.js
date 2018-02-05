module.exports = function(router, usersForRoleToggle){
  router.use(function(req, res, next){

    req.session.user = req.session.user || usersForRoleToggle[0];
    res.locals.data.user = req.session.user;
    
    next();
  });
}