// rejectReasonApi.js
import api from "api";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Function to retrieve token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Function to set headers with token
const setHeaders = (token) => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const createRejectReason = async (rejectReasonData) => {
  try {
    const token = getToken();
    console.log("rejectReasonData:", rejectReasonData);
    const response = await api.post("/reject-reasons", rejectReasonData, {
      headers: setHeaders(token),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error creating reject reason: ${error.message}`);
  }
};

const updateRejectReason = async (rejectReasonData) => {
  try {
    const token = getToken();
    const response = await api.put(
      `/reject-reasons/${rejectReasonData.rejectReasonID}`,
      rejectReasonData,
      { headers: setHeaders(token) }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error updating reject reason: ${error.message}`);
  }
};

const deleteRejectReason = async ({ rejectReasonID }) => {
  try {
    const token = getToken();
    console.log("rejectReasonID", rejectReasonID);
    const response = await api.delete(`/reject-reasons/${rejectReasonID}`, {
      headers: setHeaders(token),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error deleting reject reason: ${error.message}`);
  }
};

const fetchRejectReasons = async () => {
  try {
    const token = getToken();
    const response = await api.get("/reject-reasons", { headers: setHeaders(token) });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching reject reasons: ${error.message}`);
  }
};

export const useRejectReasons = () => {
  const token = getToken();
  return useQuery("rejectReasons", () => fetchRejectReasons(token));
};

export const useCreateRejectReason = () => {
  const queryClient = useQueryClient();

  return useMutation((rejectReasonData) => createRejectReason(rejectReasonData), {
    onSuccess: () => {
      queryClient.invalidateQueries("rejectReasons");
    },
  });
};

export const useUpdateRejectReason = () => {
  const queryClient = useQueryClient();

  return useMutation((rejectReasonData) => updateRejectReason(rejectReasonData), {
    onSuccess: () => {
      queryClient.invalidateQueries("rejectReasons");
    },
  });
};

export const useDeleteRejectReason = () => {
  const queryClient = useQueryClient();

  return useMutation((rejectReasonID) => deleteRejectReason(rejectReasonID), {
    onSuccess: () => {
      queryClient.invalidateQueries("rejectReasons");
    },
  });
};
