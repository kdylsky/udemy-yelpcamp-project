const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");

// 스키마를 중첩해서 image를 만들자.
const ImageSchema = new mongoose.Schema({
    url:String,
    filename:String
})

//각각의 이미지에 대해서 속성을 사용할 수 있다.
//만약 따로 설정하지 않았다면 각각의 이미지에 대해서는 사용할 수 없었다.
ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload", "/upload/w_200");
})

const CampgroundSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    images:[ImageSchema],
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location: String,
    //GeoJson형태를 그대로 사용한다.
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
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
