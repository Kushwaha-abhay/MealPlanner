
const stripe = require('stripe')('sk_test_51JPR10SAQv7kCWEsx2O4qgTHtZZLWbcFMxgmLHhfrhBFQkmlrXARzue8L7I2tPu7ZOnvhHkH9GqjCOP9TFRiPicr00wNiAMFQU')
const planModel = require("../Models/plansModel");
const userModel = require("../Models/usersModel");
const bookingModel = require("../Models/bookingModel");

async function createPaymentSesion(req,res){
    try{
        let userId = req.id;
     let {planId} = req.body;
    // console.log("planid",req.body);
     let plan = await planModel.findById(planId);
     let user = await userModel.findById(userId);
    //console.log("user",user);
     const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email:user.email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: plan.name,
              },
              unit_amount: plan.price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/',
        cancel_url: 'http://localhost:3000/',
      });
      res.status(200).json({session});
    }
    catch(error){
    console.log(error);
    }
}

async function createNewBooking(userEmail, planId) {
  try{
    const user = await userModel.findOne({email:userEmail});
    const plan = await planModel.findById(planId);

    const userId = user["_id"];

    if(user.bookedPlanId == undefined){
      const bookingOrder = {
        userId : userId ,
        bookedPlans : [ {planId:planId , name:plan.name  ,currentPrice : plan.price}    ]
      }
      const newBookingOrder = await bookingModel.create(bookingOrder);
      user.bookedPlanId = newBookingOrder["_id"];
      await user.save({validateBeforeSave:false});
    }
    else{
      // already bought some plans !!!
      const newBookedPlan = {
        planId : planId,
        name: plan.name,
        currentPrice:plan.price
      }
      const userBookingObject = await bookingModel.findById(user.bookedPlanId);
      userBookingObject.bookedPlans.push(newBookedPlan);
      await userBookingObject.save();
    }
  }
  catch(error){
   return error;
  }
  // console.log("inside createNewBooking !!!");
  // console.log(userEmail);
  // console.log(planId);
  // booking collection =>
  // if(user.bookedPlanId){
  // get booking id => go to booking document , push in bookedPlans
  // }
  // else
  // new booking document
  // id => user.bookedPlanId
  // booking document.bookedPlans.push(obj);
}


module.exports.createPaymentSesion = createPaymentSesion;
    