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

app.get("/campgrounds" , async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
})

app.get("/campgrounds/:id", async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/detail", {campground});
})


app.listen(3000, ()=>{
    console.log("SERVING 3000 PORT")  
})