const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const { isLoggedIn ,isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
const path = require("path");


// index route
router.get("/", wrapAsync(listingController.index));
router.get("/Trending", wrapAsync(listingController.Trending));
router.get("/Rooms", wrapAsync(listingController.Rooms));
router.get("/Iconic", wrapAsync(listingController.Iconic));
router.get("/Mountains", wrapAsync(listingController.Mountains));
router.get("/Castles", wrapAsync(listingController.Castles));
router.get("/Amazing-pools", wrapAsync(listingController.Amazing));
router.get("/Camping", wrapAsync(listingController.Camping));
router.get("/Farms", wrapAsync(listingController.Farms));
router.get("/Arctic", wrapAsync(listingController.Arctic));
router.get("/Dome", wrapAsync(listingController.Dome));
router.get("/Boats", wrapAsync(listingController.Boats));

// new route
router.get("/new",isLoggedIn, (req, res) => {
    res.render("./listings/new.ejs");
});


// create route
router.post("/",isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createListing));

// update route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.updateListing));

// show route
router.get("/:id", wrapAsync(listingController.showListing));

// delete route
router.delete("/:id", isLoggedIn ,isOwner,wrapAsync(listingController.destroyListing));

// Edit route
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingController.editListing));

module.exports = router;