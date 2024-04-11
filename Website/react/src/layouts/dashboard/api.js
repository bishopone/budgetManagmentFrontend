// api.js
import api from "api";
import { useQuery } from "react-query";

const fetchDashboardData = async (token) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const totalBudget = await api.get("/dashboard/budget-count", { headers });
    const totalAmount = await api.get("/dashboard/budget-amount-count", { headers });
    const finishedRequestCount = await api.get("/dashboard/budget-count-finished", { headers });
    const finishedBudgetAmount = await api.get("/dashboard/budget-amount-count-finished", {
      headers,
    });
    const budgetFrequency = await api.get("/dashboard/budget-monthly", { headers });

    return {
      totalBudget: totalBudget.data,
      totalAmount: new Intl.NumberFormat().format(totalAmount.data.totalAmount),
      finishedRequestCount: finishedRequestCount.data.finishedRequests,
      finishedBudgetAmount: new Intl.NumberFormat().format(
        finishedBudgetAmount.data.FinishedBudgetAmount
      ),
      budgetFrequency: budgetFrequency.data,
    };
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const useDashboardData = () => {
  const token = localStorage.getItem("token");

  return useQuery("dashboardData", () => fetchDashboardData(token));
};
