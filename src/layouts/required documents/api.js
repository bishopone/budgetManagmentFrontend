import api from "../../api";
import { useQuery, useMutation, useQueryClient } from "react-query";

// api.js

export const useFetchData = () => {
  return useQuery("budgetsteps", async () => {
    const token = localStorage.getItem("token");
    const response = await api.get("/budgetsteps/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response.data", response.data);
    return response.data;
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id) => {
      const token = localStorage.getItem("token");
      await api.delete(`/budgetsteps/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("budgetsteps");
      },
    }
  );
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ BudgetTypeID, CaseNumber, DocumentPlacement, Name, Description }) => {
      const token = localStorage.getItem("token");
      await api.post(
        `/budgetsteps/`,
        {
          BudgetTypeID,
          CaseNumber,
          DocumentPlacement,
          Name,
          Description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("budgetsteps");
      },
    }
  );
};

export const useEditDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, title }) => {
      console.log("id, title");
      console.log(id, title);
      const token = localStorage.getItem("token");

      await api.put(
        `/budgetsteps/${id}`,
        {
          name: title,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("budgetsteps");
      },
    }
  );
};
