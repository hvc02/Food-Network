var express = require("express");
var router = express.Router();
var passport = require("passport")
var User = require("../models/user")

// ROOT ROUTE
router.get("/",function(req,res){
    res.render("landing");    
});

// SHOW REGISTER FORM
router.get("/register", function(req, res){
    res.render("register", {page: "register"});
});

// HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            if(err){
                console.log(err);
                return res.render("register", {error: err.message});
            }
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpFood " + req.body.username);
            res.redirect("/restaurants");
        });
    });
});

// SHOW LOGIN FORM
router.get("/login", function(req, res){
    res.render("login", {page: "login"});
});

// HANDLING LOGIN LOGIC
router.post("/login", passport.authenticate("local",
 {  
    successRedirect: "/restaurants", 
    failureRedirect: "/login"
}), 

 function(req, res){
    req.flash("success", "welcome to YelpFood " + req.body.username);
    req.flash("error", err.message);
});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "Logged you out");
    res.redirect("/restaurants");
});

module.exports = router;
