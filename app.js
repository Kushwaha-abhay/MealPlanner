const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

const planRouter = require("./Routers/plansRouter");
const userRouter = require("./Routers/usersRouter");
const viewsRouter = require("./Routers/ViewsRouter");
const bookingRouter = require("./Routers/bookingRouter");
/*------MiddleWares---------*/
//It tracks incoming requests and if there is data in request => feeds the data in req body
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "pug");
app.set("views", path.join(__dirname,"Views"));
app.use(express.static("public"));
//custom middleware
// app.use(function (req, res, next) {
//   // console.log("middleware 1");
//   next();
// });
app.use("/api/booking",bookingRouter);
app.use("/api/plans",planRouter);
app.use("/api/users",userRouter);
app.use("",viewsRouter);


let port = process.env.PORT;
//sever
app.listen(port, function () {
  console.log("server started at 3000");
});
