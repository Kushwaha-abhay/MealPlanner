const plansModel = require("../Models/plansModel");

function getDemoPage(req, res) {
  //res.render("demo.pug",{title:"Demo Page"});
  res.render("base.pug");
}
async function getHomePage(req, res) {
  try{
    let plans = await plansModel.find(); 
    plans = plans.splice(0 , 3);
    res.render("home.pug" , {name:req.name , plans});
  }
  catch(error){
    console.log(error);
  }
}
function getloginPage(req, res) {
  res.render("login.pug",{name:req.name});
}
function getSingUpPage(req, res) {
  res.render("signup.pug",{name:req.name});
}
async function getPlansPage(req,res){
  try { 
    let getplans = await plansModel.find();
    res.render("plans.pug",{plans:getplans, name:req.name});
  }
  catch(error){

  }
  
}
function getForgetPwPage(req,res){
  res.render("forgetPassword.pug");
}
 function getResetPwPage(req,res){
res.render("resetPassword.pug",{name:req.name});
}
function getProfilePage(req,res){
  res.render("profilePage.pug",{user:req.user});
}

module.exports.getDemoPage = getDemoPage;
module.exports.getHomePage = getHomePage;
module.exports.getloginPage = getloginPage;
module.exports.getSingUpPage = getSingUpPage;
module.exports.getPlansPage = getPlansPage;
module.exports.getForgetPwPage = getForgetPwPage;
module.exports.getResetPwPage =getResetPwPage;
module.exports.getProfilePage = getProfilePage;