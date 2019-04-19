var mongoose = require("mongoose");

var restaurantSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    author: {
        id: {
            type:mongoose.SchemaTypes.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Restaurant", restaurantSchema);