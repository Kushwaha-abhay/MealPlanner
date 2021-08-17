
const userModel = require("../Models/usersModel");

async function createUser(req, res) {
  try{
    let newUser = req.body;
    let user = await userModel.create(newUser);
    res.status(200).json({
      message: "User created successfuly",
      data: user
      })
  }
  catch(error){
    res.status(501).json({
    message: "User creation failed..!!",
    error: error
    });
  }};
 
async function getAllUsers(req, res) {
  try{
    let users = await userModel.find({})
    res.status(200).json({
      message: "Got All Users successfuly",
      data: users
      })
  }
  catch(error){
    res.status(404).json({
      message: "No Users found..!!",
      error: error
      });
  }}

async function getUsersById(req, res) {
  try{
    let id  = req.id;
    console.log(req.id);
    let user = await userModel.findById(id);
    res.status(200).json({
      message: "Goy user by ID",
      data: user,
    });
  }
  catch
  {
    res.status(404).json({
    message: "Result not found",
    });
  }
}
  
async function deleteUser(req, res) {
  try{
    let id  = req.id;
    await userModel.findByIdAndDelete(id);
    res.status(200).json({
      message:"Delete Successful",
   })
  }
  catch{
      res.status(404).json({
      message: "Delete Failed..",
    });
  }}
  
async function updateUser(req, res) {
  try{
    let id = req.id;
    let updateOb = req.body.updatedOb;
    // await planModel.findByIdAndUpdate(id,updateOb,{new:true}) ye nai karenge as validator nai kaam karta 
    let user = await userModel.findById(id);
    
    for(key in updateOb)
    user[key] = updateOb[key];

    
    let updatedUser = await user.save();
    res.status(201).json({
      message: "Successfully updated",
      user : updatedUser
        });
    }
    catch(error){
      res.status(501).json({
      message: "Failed..to update user",
      error
      });
    }
}

async function updateProfileImg(req,res){
  
try{
  let file = req.file;
  let imgPath = file.destination+"/"+file.filename;
  imgPath = imgPath.substring(6);
   let id = req.id;
   let user =await userModel.findById(id);
   //console.log(user);
   
   user.pImage = imgPath;
   let u = await user.save({validateBeforeSave:false});
  // console.log("u", u);
   res.status(200).json({
     message: "profile photo updated"
   })
}
catch(error){
  res.status(200).json({
    message: "Failed to update Photo",
    error
    });
}
}

  
module.exports.getAllUsers = getAllUsers;
module.exports.getUsersById = getUsersById;
module.exports.createUser = createUser;
module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;
module.exports.updateProfileImg = updateProfileImg;
