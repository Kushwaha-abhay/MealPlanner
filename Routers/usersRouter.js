const express = require("express");
const userRouter = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    
    destination: function(req , file , cb){
      cb(null , "public/img/users");
    } ,
    filename : function(req , file , cb){
      cb(null , `user${Date.now()}.jpg`);
    } 
  });


function fileFilter(req , file , cb){
    
    if(file.mimetype.includes("image")){
      cb(null , true);
    }
    else{
      cb(null , false);
    }
  }


const upload = multer({storage:storage , fileFilter:fileFilter});
const {updateProfileImg,getUsersById,deleteUser,updateUser} = require("../Controller/userController");
const {singup,login, protectRoute,forgetPassword,resetPassword} = require("../Controller/authController");

userRouter.post("/signup",singup);
userRouter.post("/login",login);
userRouter.post("/forgetPassword", forgetPassword);
userRouter.patch("/resetPassword/:token", resetPassword);
// userRouter
// .route("")
// .get(getAllUsers)
// .post(createUser);
userRouter.use(protectRoute);

userRouter.patch("/updateProfileImg",upload.single("user"),updateProfileImg)

userRouter
.route("")
.get(getUsersById)
.patch(updateUser)
.delete(deleteUser);


module.exports = userRouter;