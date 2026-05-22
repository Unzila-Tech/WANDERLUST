const express = require("express");
const router= express.Router();
const user =require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {savedRedirectUrl}=require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let{username,email,password}=req.body;
    const newUser = new user({email,username});
    const registeredUser =await user.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
    req.flash("success" , "Welcome to Wanderlust!");
    res.redirect("/listings");
    });

    }
    catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
})   
);

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
});

router.post("/login",savedRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
async (req,res)=>{
    req.flash("success","Welcome Back to Wanderlust!")
    let redirectUrl=res.locals.redirectUrl
    res.redirect(redirectUrl);
}
);

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You Are Logged Out");
        res.redirect("/listings");
    });
});

module.exports = router;
