const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp-project')
    .then(()=>{
        console.log("mongoDB CONNECT");
    })
    .catch((err)=>{
        console.log("OH mongoDB ERR")
        console.log(err)
    })

app.set("views",path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req,res)=>{
    res.render("home")
})

app.get("/makecampground", async(req,res)=>{
    const newcampground = await new Campground({title:"new", price:"asd", description:"good", location:"korea"})
    newcampground.save()
        .then(data=>{
            console.log(data)
        })
        .catch(err=>{
            console.log(err.message)
        })
    res.send("it work")
})

app.listen(3000, ()=>{
    console.log("SERVING 3000 PORT")  
})