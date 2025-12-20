if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const localstrategy = require("passport-local");
const User = require("./models/user.js");
const {isLoggedIn} = require("./middleware.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const Listing = require("./models/listing.js");
app.use(express.json());
app.use(methodOverride('_method'));

const dburl = process.env.ATLASDB_URL;

main().then(() => console.log("connection sucessful"))
    .catch((err) => console.log(err));
async function main() {
    await mongoose.connect(dburl);
}
app.set("view engine", "ejs");
app.engine("ejs" , ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

console.log(MongoStore);

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error" , ()=>{
    console.log("Error in Mongo Session Store", err)
});
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7 * 24*60*60*1000,
        httpOnly : true,
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/" , userRouter);

app.post("/Search" , async(req,res)=>{
let { destination } = req.body;
destination = destination.toUpperCase();
console.log(destination);
let all_listings = await Listing.find( {$or: [
        { location: destination },
        { country: destination }
    ]});
if(all_listings.length===0){
    req.flash("error" , "Destination you requested for is not available!");
    all_listings = await Listing.find({});
    return  res.render("./listings/index.ejs", { all_listings});
}
console.log(all_listings);
 res.render("./listings/index.ejs", { all_listings});
})


app.all("/" , (req,res,next) =>{
    next(new ExpressError(404, "Page not Found!"));
});


app.use((err,req,res,next) =>{
 let {statusCode = 500, message = "Something went wrong!"} = err;
 res.status(statusCode).render("./listings/error.ejs" , {message});
});


app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
})
