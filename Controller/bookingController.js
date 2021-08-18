
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
        client_reference_id: planId,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: plan.name,
              },
              unit_amount: plan.price*100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'https://meal-plan-ner.herokuapp.com',
        cancel_url: 'https://meal-plan-ner.herokuapp.com',
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
async function checkoutComplete(req, res) {
  try{
    const END_POINT_KEY = process.env.END_POINT_KEY;
    // console.log("Checkout complete ran !!");
    // console.log("Request object");
    // console.log(req);
    const stripeSignature = req.headers["stripe-signature"];
  
    console.log("endpoint key = " , END_POINT_KEY);
    console.log("stripeSign = " , stripeSignature);
    console.log("Req.bdoy =>" , req.body);
  
    // if(req.body.data.type == "checkout.session.completed"){
      const userEmail = req.body.data.object.customer_email;
      const planId = req.body.data.object.client_reference_id;
      await createNewBooking(userEmail , planId); 
    // }
  }
  catch(error){
    res.json({
      error
    })
  }
}

module.exports.createPaymentSesion = createPaymentSesion;
module.exports.checkoutComplete = checkoutComplete;
module.exports.createNewBooking = createNewBooking;
    