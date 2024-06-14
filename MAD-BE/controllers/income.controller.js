const { v4: uuidv4 } = require("uuid");
const Income = require("../models/income");
const CategoryIncome = require("../models/category-income");

// create new income
exports.create = async (req, res, next) => {
  try {
    const { date, money, note, categoryIncomeId } = req.body;
    const userId = req.user.dataValues.id;
    const income = await Income.create({
      id:  uuidv4(),
      date: new Date(date),
      money,
      note,
      userId,
      categoryIncomeId,
    });

    res.status(200).json({
      message: "Created income successfully!",
      income,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// get all incomes
exports.getAll = async (req, res, next) => {
  try {
    const userId = req.user.dataValues.id;
    const incomes = await Income.findAll({
      where: { userId: userId },
      include: [{ model: CategoryIncome, required: true }]
    });

    res.status(200).json(incomes);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// update income
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const income = req.body;
    await Income.update(income, {
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: "Update income successfully!",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// delete income
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Income.destroy({
      where: {
        id: id,
      },
    });

    res.status(200).json({ message: "Delete income successfully!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
