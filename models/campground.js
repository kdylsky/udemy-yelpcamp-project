const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");

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
    }],
    // 한명의 유저는 여러개의 캠핑장을 소유할 수 있다.
    // 1대다이다.
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

CampgroundSchema.post("findOneAndDelete",async function(doc){
    console.log(doc)
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})


const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
