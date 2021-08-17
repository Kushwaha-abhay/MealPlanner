const mongoose = require("mongoose");
const crypto = require("crypto");
// const {DB_LINK} = require("../config/secrets");
const DB_LINK = process.env.DB_LINK;
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true }
  ).then((db) => console.log("users dB connected..!!"));

let userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [40, "Your  name is more than 40 characters"]
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
    minlength:[6,"Password must be greater than 6 characters"]
  },
  confirmPassword :{
    type: String,
    minlength:[6,"Password must be greater than 6 characters"],
    validate : {
        validator :function(){
          return this.confirmPassword == this.password;
        },
        message:"Password didn't match..!!"
      }
  
  },
  role : {
    type :String,
    enum:["admin","user","resturant owner","delivery boy"],
    default : "user"
},
pImage : {
  type: String,
  default: "/img/users/default.jpeg"
},
pwdToken : String,
tokenTime : String,
bookedPlanId : {
  type : String
}
});

userschema.pre("save",function(){
  this.confirmPassword = undefined
});

userschema.methods.createPwdToken = function(){
  //creates token and provides when the method is called
  let token = crypto.randomBytes(32).toString("hex");
  let time = Date.now()*60*10*1000;

  this.pwdToken = token;
  this.tokenTime = time;
  return token;
}

userschema.methods.resetPasswordHandler = function(password,confirmPassword){
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.pwdToken = undefined;
  this.tokenTime = undefined;
}

let userModel = mongoose.model("userCollection",userschema);
module.exports = userModel;