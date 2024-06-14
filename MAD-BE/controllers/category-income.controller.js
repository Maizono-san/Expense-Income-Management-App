const CategoryIncome = require("../models/category-income");

// get all category_income
exports.getAll = async (req, res, next) => {
  try {
    const userId = req.user.dataValues.id;
    
    const category_incomes = await CategoryIncome.findAll({
      where: { userId: userId },
    });

    res.status(200).json(category_incomes);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};