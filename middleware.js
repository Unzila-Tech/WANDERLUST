module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
    req.flash("success","You Must Be Logged In To Create Listing");
    return res.redirect("/login");
  }
  next();
}

module.exports.savedRedirectUrl =(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

