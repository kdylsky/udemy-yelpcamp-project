const mongoose = require("mongoose");

const CampgroundSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    images:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    // 캠핑장에서 리뷰를 불러올 수 있다.
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
});

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
