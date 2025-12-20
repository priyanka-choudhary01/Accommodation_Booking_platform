const { Query } = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { listingSchema } = require("../schema.js");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});


module.exports.index = async (req, res) => {
    const all_listings = await Listing.find({});
    res.render("./listings/index.ejs", { all_listings });
}
module.exports.Trending = async(req,res)=>{
  const all_listings = await Listing.find({category:"Trending"});
  console.log(all_listings);
  res.render("./listings/index.ejs" , {all_listings});
}
module.exports.Rooms = async(req,res)=>{
  const all_listings = await Listing.find({category:"Rooms"});
  console.log(all_listings);
  res.render("./listings/index.ejs" , {all_listings});
}
module.exports.Iconic = async(req,res)=>{
  const all_listings = await Listing.find({category:"Iconic-city"});
  console.log(all_listings);
  res.render("./listings/index.ejs" , {all_listings});
}
module.exports.Mountains = async(req,res)=>{
  const all_listings = await Listing.find({category:"Mountains"});
  console.log(all_listings);
  res.render("./listings/index.ejs" , {all_listings});
}
module.exports.Castles = async(req,res)=>{
  const all_listings = await Listing.find({category:"Castles"});
  console.log(all_listings);
  res.render("./listings/index.ejs" , {all_listings});
}
module.exports.Camping = async(req,res)=>{
  const all_listings = await Listing.find({category:"Camping"});
  console.log(all_listings);
  res.render("./listings/index.ejs" , {all_listings});
}
module.exports.Amazing = async(req,res)=>{
  const all_listings = await Listing.find({category:"Amazing-pools"});
  console.log(all_listings);
  res.render("./listings/index.ejs" , {all_listings});
}
module.exports.Farms = async(req,res)=>{
  const all_listings = await Listing.find({category:"Farms"});
  console.log(all_listings);
  res.render("./listings/index.ejs" , {all_listings});
}
module.exports.Arctic = async(req,res)=>{
  const all_listings = await Listing.find({category:"Arctic"});
  console.log(all_listings);
  res.render("./listings/index.ejs" , {all_listings});
}
module.exports.Dome = async(req,res)=>{
  const all_listings = await Listing.find({category:"Dome"});
  console.log(all_listings);
  res.render("./listings/index.ejs" , {all_listings});
}
module.exports.Boats = async(req,res)=>{
  const all_listings = await Listing.find({category:"Boats"});
  console.log(all_listings);
  res.render("./listings/index.ejs" , {all_listings});
}

module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
     console.log(newListing);
    let response = await geocodingClient
    .forwardGeocode({
      query: newListing.location,
      limit:1,  
    }) 
    .send();
      let  url = req.file.path;
       let filename = req.file.filename;
   

  newListing.owner = req.user._id;
  newListing.image = {url , filename};
  newListing.geometry = response.body.features[0].geometry; 
  newListing.location = newListing.location.toUpperCase();
  let savedlisting = await newListing.save();
  console.log(savedlisting);
   req.flash("success" , "New Listing Created!");
  res.redirect("/listings");
};


module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate : {
            path : "author"
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error" , "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
};



module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    listing.location = listing.location.toUpperCase();
     if(!listing){
        req.flash("error" , "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl =  originalImageUrl.replace("/upload" , "/upload/h_300,w_250");
    res.render("./listings/edit.ejs", { listing ,originalImageUrl})
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body});

    if(typeof req.file != "undefined"){
    let  url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!" )
    res.redirect("/listings");
};
