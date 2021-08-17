const userModel = require("../Models/usersModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
// const { SECRET_KEY,GMAIL_ID,GMAIL_PASSWORD } = require("../config/secrets");
const SECRET_KEY = process.env.SECRET_KEY;
const GMAIL_ID = process.env.GMAIL_ID;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
async function sendMail(message) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: GMAIL_ID,
        pass: GMAIL_PASSWORD,
      },
    });
    console.log("inside mail");
    let res = await transporter.sendMail({
      from: message.from, // sender address
      to: message.to, // list of receivers
      subject: message.subject, // Subject line
      text: message.text, // plain text body
    });
    return res;
  } catch (error) {
    return error;
  }
}
async function singup(req, res) {
  try {
    let user = req.body;

    let newUser = await userModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
      role: user.role,
    });

    res.status(201).json({
      message: "Singup Success",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: "Failed to Singup..!!",
      error,
    });
  }
}
async function login(req, res) {
  try {
    let { email, password } = req.body;
    let presentUser = await userModel.find({ email: email });

    if (presentUser.length) {
      let loggedInuser = presentUser[0];

      if (loggedInuser.password == password) {
        //token creation

        let token = jwt.sign({ id: loggedInuser["_id"] }, SECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true });
        res.status(200).json({
          message: "Login Success",
          data: presentUser[0],
        });
      } else {
        res.status(200).json({
          message: "Id/password did n't match",
        });
        //res.render("login.pug",{message:"Invalid Username and password"});
      }
    } else {
      res.status(200).json({
        message: "No user found. Kindly Signup",
      });
    }
  } catch (error) {
    res.status(200).json({
      message: "Login failed.catch.",
      error,
    });
  }
}
function isAdmin(roles) {}
async function isLoggedIn(req, res, next) {
  try {
    let token = req.cookies.jwt;
    const payload = jwt.verify(token, SECRET_KEY);

    if (payload) {
      //console.log(payload);
      let user = await userModel.findById(payload.id);
      req.name = user.name;
      req.user = user;
      next();
    } else {
      next();
      // res.status(501).json({
      //   message: "Please login",
      // });
    }
  } catch (error) {
    next();
  }
}
async function logout(req, res) {
  try {
    res.clearCookie("jwt");
    res.redirect("/");
  } catch (error) {
    res.status(501).json({
      error,
    });
  }
}
async function protectRoute(req, res, next) {
  try {
    console.log("dd");
    const token = req.cookies.jwt;
    console.log(token);
    const payload = jwt.verify(token, SECRET_KEY);

    if (payload) {
      req.id = payload.id;

      next();
    } else {
      res.status(501).json({
        message: "Please login",
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "Please login",
    });
  }
}
async function isAuthorized(req, res, next) {
  try {
    let id = req.id;
    let user = await userModel.findById(id);
    if (user.role == "admin") next();
    else
      res.status(),
        json({
          mesaage: "You dont have admin rights..!!",
        });
  } catch (error) {
    res.status(501).json({
      message: "unauthorized",
    });
  }
}
async function forgetPassword(req, res) {
  try {
    let { email } = req.body;
    let user = await userModel.findOne({ email: email });
    //console.log(user);
    if (user) {
      let token = user.createPwdToken();
      console.log(token);
      await user.save({ validateBeforeSave: false });
      let resetlink = `https://meal-plan-ner.herokuapp.com/resetPassword/${token}`;
      let message = {
        from:"no-reply@no-reply.com",
        to:"abhaynhes@gmail.com",
        subject:"Reset Password",
        text:resetlink
      }
      let response = sendMail(message);
      console.log("mail-res",response);
      res.status(200).json({
        message:"Password reset link sent to mail"
      })
    } else {
      res.status(200).json({
        message: "User not registered",
      });
    }
  } catch (error) {
    console.log("error",error);
    res.status(200).json({
      message: "Failed to forget password",
    });
  }
}
async function resetPassword(req, res) {
  try {
    let { password, confirmPassword } = req.body;
    let token = req.params.token;
    console.log("resetpassword",token,password,confirmPassword);
    const user = await userModel.findOne({
      pwdToken: token,
      tokenTime: { $gt: Date.now() },
    });
    if (user) {
      user.resetPasswordHandler(password, confirmPassword);
      user.save();
      res.status(200).json({
        message: "Reset password Success",
      });
    } else {
      res.status(200).json({
        message: "link Expired..!!",
      });
    }
  } catch (error) {
    res.status(200).json({
      message: "Reset password failed..!!",
      error,
    });
  }
}
module.exports.singup = singup;
module.exports.login = login;
module.exports.protectRoute = protectRoute;
module.exports.isAuthorized = isAuthorized;
module.exports.isAdmin = isAdmin;
module.exports.forgetPassword = forgetPassword;
module.exports.resetPassword = resetPassword;
module.exports.isLoggedIn = isLoggedIn;
module.exports.logout = logout;
