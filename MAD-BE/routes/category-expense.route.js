const express = require("express");
const route = express.Router();
const isAuth = require("../middlewares/is-auth");
const categoryExpenseController = require("../controllers/category-expense.controller");

// get all category-expenses
route.get("/", isAuth, categoryExpenseController.getAll);

module.exports = route;
