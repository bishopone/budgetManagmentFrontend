import { useQuery } from "react-query";
import api from "api";

async function fetchData({ queryKey }) {
  const fillter = queryKey[1];
  const budgettype = queryKey[2];
  console.log("queryKey", queryKey, fillter, budgettype);
  const token = localStorage.getItem("token");
  const url = `/budget/${fillter === 0 ? `active/${budgettype}` : `${budgettype}`}`;
  try {
    const response = await api.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
}
export function useFetchData(fillter, budgettype) {
  return useQuery(["fetchcapitalown", fillter, budgettype], fetchData);
}
