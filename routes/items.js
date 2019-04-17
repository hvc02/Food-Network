var express = require("express");
var router = express.Router();
var Item = require("../models/item");
var middleware = require("../middleware");

//INDEX - show all the items
router.get("/",function(req,res){
    //Get all items from DB
    Item.find({}, function(err, allItems){
        if(err){
            console.log(err);
        } else {
            res.render("items/index",{items:allItems, page: "items"});
        }
    });
});

//CREATE - creates a new item to DB
router.post("/", middleware.isLoggedIn , function(req,res){
    //get data from form and add to item array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newItem = {name: name, image: image, description: description, price: price, author: author}
    //Create a new item and save to DB
    Item.create(newItem, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
             //redirect back to items page
            res.redirect("/items");
        }
    })
});

//NEW - show form to create items
router.get("/new", middleware.isLoggedIn , function(req,res){
    res.render("items/new")
})

//SHOW - displays information about specific item
router.get("/:id", function(req, res){
    //find the item with provided ID
    Item.findById(req.params.id).populate("comments").exec(function(err, foundItem){
        if(err){
            console.log(err);
        } else {
            console.log(foundItem);
            
             //render show template with that item
            res.render("items/show", {item: foundItem}); 
        } 
    });
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkItemOwnership, function(req, res){
    Item.findById(req.params.id, function(err, foundItem){
        res.render("items/edit", {item: foundItem});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkItemOwnership, function(req, res){
    //find and update the correct item
    Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, updatedItem){
        if(err){
            res.redirect("/items");
        } else {
            //redirect to show page
            res.redirect("/items/" + req.params.id)
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkItemOwnership, function(req, res){
    Item.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/items");
        } else {
            res.redirect("/items");
        }
    });
});

module.exports = router;