import axios from "axios";

// Get all category income
export const getAllCategoryIncome = async () => {
  try {
    const response = await axios.get("category-income");

    return response;
  } catch (error) {
    console.log(error);
  }
};
