var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");

// MIDDLEWARES
var middlewareObj = {};

middlewareObj.checkRestaurantOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
            Restaurant.findById(req.params.id, function(err, foundRestaurant){
                if(err){
                    req.flash("error", "Sorry for the inconvenience");
                    res.redirect("back");
                } else {
                    //does user own the restaurant(we use .equals cause one is string)
                    if(foundRestaurant.author.id.equals(req.user._id)){
                        next();
                    } else {
                    req.flash("error", "You don't have permission to do that");    
                    res.redirect("back");
                }
            }
        });      
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
    }  
}

middlewareObj.checkCommentOwnership =  function(req, res, next) {
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("back");
                } else {
                    //does user own the comment
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    } else {
                    req.flash("error", "You don't have permissions to do that");     
                    res.redirect("back");
                }
            }
        });      
        } else {
            req.flash("error", "You need to be logged in");
            res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
}

module.exports = middlewareObj;