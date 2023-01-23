const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    body: String,
    rating:Number,
    
});

module.export = mongoose.model("Review", reviewSchema);