const CategoryExpense = require("../models/category-expense");

// get all category_expense
exports.getAll = async (req, res, next) => {
  try {
    const userId = req.user.dataValues.id;
    const category_expenses = await CategoryExpense.findAll({
      where: { userId: userId },
    });

    res.status(200).json(category_expenses);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};