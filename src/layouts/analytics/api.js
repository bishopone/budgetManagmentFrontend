// api.js
import api from "api";
import { useQuery } from "react-query";

const fetchData = async (url, headers) => {
  const response = await api.get(url, { headers });
  return response.data;
};

export const fetchAnalyticsData = async (token) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const distributions = await fetchData("/analysis/all-analyses", headers);
    const requests = await fetchData("/budget/all", headers);

    const listoftypes = ["መደበኛ በጀት", "የካፒታል በጀት", "መጠባበቂያ በጀት ", "", "ውስጠ ገቢ በጀት"];
    const requestlist = requests.map((x, index) => ({
      ...x,
      Type: listoftypes[parseInt(x.Type) - 1],
      index,
    }));

    return {
      distributions,
      requests: requestlist,
    };
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const getSingleRequestHistory = async (token, id) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  console.log("last", id);
  try {
    const requests = await fetchData(`/budget/history/${id}`, headers);
    const nodes = [];
    const edges = [];
    console.log("last", requests);
    requests.map((node, index) =>
      nodes.push({
        id: `${node["LogID"]}`,
        ...(index === 0 ? { sourcePosition: "right" } : { sourcePosition: "left" }),
        ...(index === requests.length - 1
          ? { targetPosition: "left" }
          : { targetPosition: "right" }),
        data: { label: node["NewState"] },
        type: "ImgMediaCard",
        position: { x: 0 + index * 200, y: Math.sin(index) * 100 },
      })
    );
    for (let i = 1; i <= requests.length; i++) {
      if (requests[i]?.["LogID"] !== undefined) {
        edges.push({
          id: `${requests[i - 1]?.["LogID"]}${requests[i]?.["LogID"]}`,
          source: `${requests[i - 1]["LogID"]}`,
          type: "smoothstep",
          label: `${requests[i]["comments"]}`,
          target: `${requests[i]?.["LogID"]}`,
          animated: true,
        });
      }
    }
    console.log("requests", id);
    console.log(requests);
    console.table(nodes);
    console.table(edges);
    return { nodes, edges };
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const useAnalyticsData = () => {
  const token = localStorage.getItem("token");

  return useQuery("analyticsData", () => fetchAnalyticsData(token));
};
export const useBudgetHistory = (id) => {
  const token = localStorage.getItem("token");
  console.log("useBudgetHistoryuseBudgetHistory id:", id);
  return useQuery("bdugetData", () => getSingleRequestHistory(token, id));
};
