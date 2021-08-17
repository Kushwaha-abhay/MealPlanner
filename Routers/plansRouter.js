const express = require("express");
const { protectRoute ,isAuthorized, isAdmin} = require("../Controller/authController");
const planRouter = express.Router();
const {
  getAllPlans,
  createPlan,
  getPlansById,
  deletePlan,
  updatePlan,
} = require("../Controller/planController");

//planRouter.use(isAdmin(["admin"]))
planRouter
.route("")
.get(getAllPlans)
.post(createPlan);

planRouter
.route("/:id")
.get(protectRoute,isAuthorized, getPlansById)
.patch(protectRoute,isAuthorized,updatePlan)
.delete(protectRoute,isAuthorized,deletePlan);

module.exports = planRouter;
