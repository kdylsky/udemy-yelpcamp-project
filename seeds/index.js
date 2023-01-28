const mongoose = require('mongoose');
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp-project')
    .then(()=>{
        console.log("mongoDB CONNECT");
    })
    .catch((err)=>{
        console.log("OH mongoDB ERR")
        console.log(err)
    })

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async()=>{
    await Campground.deleteMany({});
    for (let i=0; i<10; i++){
        const random100 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp =  new Campground({
            author : '63d0ece26d407c27e170e492',
            location: `${cities[random100].city}, ${cities[random100].state} `,
            title : `${sample(descriptors)} ${sample(places)}`,
            description: "This is Test Web Site Page welcome my Yelp Camp Site",
            geometry: { 
                type : "Point", 
                coordinates : [ 129.0752365, 35.1799528 ] 
            },
            price : price,
            // images: "https://source.unsplash.com/collection/483251"
            images: [
                {
                  url: 'https://res.cloudinary.com/dsq1ga8v1/image/upload/v1674713648/YelpCamp/rlrf8ht8gaq2efn3if4d.jpg',
                  filename: 'YelpCamp/rlrf8ht8gaq2efn3if4d',
                },
                {
                  url: 'https://res.cloudinary.com/dsq1ga8v1/image/upload/v1674713649/YelpCamp/jpk2reri5lo8and60i8m.jpg',
                  filename: 'YelpCamp/jpk2reri5lo8and60i8m',
                }
              ],
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})