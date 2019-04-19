var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");

//INDEX - show all the restaurants
router.get("/",function(req,res){
    //Get all restaurants from DB
    Restaurant.find({}, function(err, allRestaurants){
        if(err){
            console.log(err);
        } else {
            res.render("restaurants/index",{restaurants:allRestaurants, page: "restaurants"});
        }
    });
});

//CREATE - creates a new restaurant to DB
router.post("/", middleware.isLoggedIn , function(req,res){
    //get data from form and add to restaurant array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newRestaurant = {name: name, image: image, description: description, price: price, author: author}
    //Create a new restaurant and save to DB
    Restaurant.create(newRestaurant, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
             //redirect back to restaurants page
            res.redirect("/restaurants");
        }
    })
});

//NEW - show form to create restaurants
router.get("/new", middleware.isLoggedIn , function(req,res){
    res.render("restaurants/new")
})

//SHOW - displays information about specific restaurant
router.get("/:id", function(req, res){
    //find the restaurant with provided ID
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
        if(err){
            console.log(err);
        } else {
            console.log(foundRestaurant);
            
             //render show template with that restaurant
            res.render("restaurants/show", {restaurant: foundRestaurant}); 
        } 
    });
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkRestaurantOwnership, function(req, res){
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
        res.render("restaurants/edit", {restaurant: foundRestaurant});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkRestaurantOwnership, function(req, res){
    //find and update the correct restaurant
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
        if(err){
            res.redirect("/restaurants");
        } else {
            //redirect to show page
            res.redirect("/restaurants/" + req.params.id)
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkRestaurantOwnership, function(req, res){
    Restaurant.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants");
        }
    });
});

module.exports = router;