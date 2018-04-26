var express = require('express')
var router = express.Router()
var usersForRoleToggle = require('./usersForRoleToggle')();

require('./routes/init')(router, usersForRoleToggle);
require('./routes/index')(router);
require('./routes/toggle-user-role')(router, usersForRoleToggle);
require('./routes/customer')(router);
require('./routes/team')(router);
require('./routes/handover')(router);
require('./routes/queue')(router);
require('./routes/allocation')(router);



router.post('./agent/queue', function (req, res) {
    res.redirect('./agent/edit')
})  

router.post('./agent/create', function (req, res) {
        res.redirect('./agent/customer')
    })



 // add your routes here
router.post('/v2/queue',function (req, res) {
    
      var scenario = req.session.data['scenario']
    
      if(scenario == "allocatorEdit"){
        res.redirect('/v2/allocator-queue')
      }
    
      else {
        res.redirect('/v2/queue')
      }
    
    })  

    router.post('/v3/queue',function (req, res) {
      
        var scenariopicker = req.session.data['scenario']
      
        if("queue"  == "agentEditEscalate"){
          res.redirect('/v3/find')
        }

        if(scenariopicker   == "allocatorEdit"){
          res.redirect('/v3/allocator-queue')
        }
     
        else {
          res.redirect('/v3/queue')
        }
      
      }) 
      
      router.post('/v3/find',function (req, res) {
        
          var scenariopicker = req.session.data['scenario']
        
          if(scenariopicker  == "agentEditEscalate"){
            res.redirect('/v3/find')
          }
       
          else {
            res.redirect('/v3/find')
          }
        
        })  
      
      router.post('/v3/find', function (req, res) {
        res.redirect('/v3/customer')
    })  
    
    router.post('/v4/queue',function (req, res) {
      
        var scenariopicker = req.session.data['scenario']
      
        if("queue"  == "agentEditEscalate"){
          res.redirect('/v4/find')
        }


        if(scenariopicker   == "allocatorEdit"){
          res.redirect('/v4/allocator-queue')
        }
     
        else {
          res.redirect('/v4/queue')
        }
      
      }) 


      router.post('/v3/customer', function (req, res) {
        res.redirect('/v3/customer')
    })  

    

module.exports = router;
