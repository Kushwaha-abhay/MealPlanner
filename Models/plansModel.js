const mongoose = require("mongoose");
// const {DB_LINK} = require("../config/secrets");
const DB_LINK = process.env.DB_LINK;
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true }
  ).then((db) => console.log("plans dB connected..!!"));

let planschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [40, "Your plan name is more than 40 characters"],
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  rating :{
    type: Number
  },
  discount : {
    type :Number,
    validate : {
      validator :function(){
        return this.discount < this.price;
      },
      message:"Discount must be less than actual price"
    }
  }
});

let planModel = mongoose.model("planCollection",planschema);
module.exports = planModel;