const express = require("express");
const route = express.Router();
const isAuth = require("../middlewares/is-auth");
const incomeController = require("../controllers/income.controller");

// get all incomes
route.get("/", isAuth, incomeController.getAll);

// update income
route.put("/:id", isAuth, incomeController.update);

// create income
route.post("/", isAuth, incomeController.create);

// delete income
route.delete("/:id", isAuth, incomeController.delete);

module.exports = route;
