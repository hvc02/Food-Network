var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Item  = require("./models/item"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");

// REQUIRING ROUTES
var commentRoutes     = require("./routes/comments"),
    itemRoutes  = require("./routes/items"),
    indexRoutes        = require("./routes/index")   
 
//mongoose.connect("mongodb://localhost/yelpfood"); 
mongoose.connect("mongodb+srv://admin-hvc:Test123@cluster0-xhyav.mongodb.net/yelpfood");    

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // SEED THE DATABASE    

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
})); 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/items", itemRoutes);
app.use("/items/:id/comments", commentRoutes);

app.listen(3000,function(){
    console.log("The YelpFood Server Has Started!");    
});