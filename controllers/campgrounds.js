const Campground = require("../models/campground");
const {cloudinary} = require("../cloudinary/index");

module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}

module.exports.renderNewForm = (req,res)=>{
    res.render("campgrounds/new");
}

module.exports.createCampground = async(req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const {campground} = req.body;
    const newCampground = new Campground(campground);
    
    // req.files에 있는 데이터를 가지고 온다. 그리고 캠핑장객체에 저장한다.
    newCampground.images = req.files.map(f=>({url:f.path, filename:f.filename}))

    // 로그인 한 상태이기 때문에 세션에서 로그인한 회원정보를 가지고 올 수 있다.
    // const currentUser = req.user
    newCampground.author = req.user._id;
    await newCampground.save();
    // flash 설정하기 
    req.flash("success", "Successfully made a new campgrounds");
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        // reviews에서 참조하고 있는 author을 가지고 오기 위해서 중첩으로 populate를 해준다.
        path: "reviews",
        populate:{
            path:"author"
            }
        }).populate("author");
    if (!campground){
        req.flash("error", "Cannot find that campground!");
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/detail", {campground});
}

module.exports.renderEditForm = async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground){
        req.flash("error", "Cannot find that campground!");
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", {campground});
}

module.exports.updateCampground = async(req,res)=>{
    const { id } = req.params;
    // await Campground.findByIdAndUpdate(id, req.body.campground);
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new:true});
    console.log(req.body)
    // req.files에 있는 데이터를 가지고 온다. 그리고 캠핑장객체에 저장한다.
    const imgs = req.files.map(f=>({url:f.path, filename:f.filename}));
    // 기존 이미지에 push 해주기
    campground.images.push(...imgs);
    
    // 데이터베이스 이미지 삭제하기
    if(req.body.deleteImages){
        // cloudly 이미지 삭제하기
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}})
    }
    
    await campground.save();
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteCampground = async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
}