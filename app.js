const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ejsMate =require("ejs-mate");
const expressError = require("./utils/expressError.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter =require("./routes/user.js");

const session=require("express-session");
const flash =require("connect-flash");
const passport = require("passport");
const LocalStrategy= require("passport-local");
const user = require("./models/user.js");
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,'/public')));

const sessionOption ={
  secret:"mysupersecretcode",
  resave : false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};


app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  console.log(res.locals.success);
   res.locals.currUser=req.user;
  next();
});


// app.get("/demouser",async (req,res)=>{
//   let fakeUser =new user({
//     email:"student@gmail.com",
//     username:"stu-name",
//   });
//   let resgisterUser= await user.register(fakeUser,"hello world");
//   res.send(resgisterUser);
// });


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);

// this is old version

// app.all("*",(req,res,next)=>{
//  next(new expressError(404,"Page Not Found!"));
// });

// app.use((err, req, res, next) => {
//   let { statusCode , message} = err;
//   res.status(statusCode).send(message);
// });

// this is new
app.use((req, res, next) => {
  next(new expressError(404, "Page Not Found!"));
});

// error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs",{err});
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
