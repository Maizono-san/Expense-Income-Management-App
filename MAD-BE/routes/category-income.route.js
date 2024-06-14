const express = require("express");
const route = express.Router();
const isAuth = require("../middlewares/is-auth");
const categoryIncomeController = require("../controllers/category-income.controller");

// get all category-incomes
route.get("/", isAuth, categoryIncomeController.getAll);

module.exports = route;
