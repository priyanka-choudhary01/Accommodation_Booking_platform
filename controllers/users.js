const User = require("../models/user");

module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success" , "Welcome back to wonderlust!");
    const redirectUrl = res.locals.redirectUrl;
    delete req.session.redirectUrl;
    console.log(redirectUrl);
    if(redirectUrl == undefined){
        return res.redirect("/listings");
    }
   res.redirect(redirectUrl);
};

module.exports.signup = async(req,res) =>{
    try{
    let {username , email, password} = req.body;
    const newUser = new User({email , username});
     const registeredUser = await User.register(newUser,password);
     console.log(registeredUser);
     req.login(registeredUser ,(err) =>{
        if(err){
            return next(err);
        }
     req.flash("success" , "Welcome to Wanderlust!");
     res.redirect("/listings");
     });
    }catch(err){
        console.log(err);
        req.flash("error",err.message );
        res.redirect("/signup");
    }
};

module.exports.renderSignup = (req,res) =>{
  res.render("users/signup.ejs");
};

module.exports.logout = (req,res,next)=>{
    req.logout((err) =>{
        if(err){
          return  next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};