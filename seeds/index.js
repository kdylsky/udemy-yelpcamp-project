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
    for (let i=0; i<20; i++){
        const random100 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp =  new Campground({
            // author : '63bd2388e1655b94ecd1a34c',
            location: `${cities[random100].city}, ${cities[random100].state} `,
            title : `${sample(descriptors)} ${sample(places)}`,
            description: "This is Test Web Site Page welcome my Yelp Camp Site",
            price : price,
            // images: [
            //     {
            //       url: 'https://res.cloudinary.com/dsq1ga8v1/image/upload/v1673369173/YelpCamp/xxn9ybypcjhuqt1fajv0.jpg',
            //       filename: 'YelpCamp/xxn9ybypcjhuqt1fajv0',
            //     },
            //     {
            //       url: 'https://res.cloudinary.com/dsq1ga8v1/image/upload/v1673369174/YelpCamp/isb3p5es3pij4gymyrih.jpg',
            //       filename: 'YelpCamp/isb3p5es3pij4gymyrih',
            //     }
            //   ],
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})