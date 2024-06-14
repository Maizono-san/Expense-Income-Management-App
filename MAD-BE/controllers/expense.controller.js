const Expense = require("../models/expense");
const CategoryExpense = require("../models/category-expense");
const { v4: uuidv4 } = require("uuid");


// create new expense
exports.create = async (req, res, next) => {
  try {
    const { date, money, note, categoryExpenseId } = req.body;
    const userId = req.user.dataValues.id;
    const expense = await Expense.create({
      id:uuidv4(),
      date: new Date(date),
      money,
      note,
      userId,
      categoryExpenseId
    });

    res.status(200).json({
      message: "Created expense successfully!",
      expense,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// get all expenses
exports.getAll = async (req, res, next) => {
  try {
    const userId = req.user.dataValues.id;
    const expenses = await Expense.findAll({
      where: { userId: userId },
      include: [{model: CategoryExpense, required: true,}]
    });

    res.status(200).json(expenses);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// update expense
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const expense = req.body;
    await Expense.update(expense, {
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: "Update expense successfully!",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// delete expense
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Expense.destroy({
      where: {
        id: id,
      },
    });

    res.status(200).json({ message: "Delete expense successfully!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
