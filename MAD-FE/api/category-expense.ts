import axios from "axios";

// Get all category expense
export const getAllCategoryExpense = async () => {
  try {
    const response = await axios.get("category-expense");

    return response;
  } catch (error) {
    console.log(error);
  }
};
