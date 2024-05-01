import api from "../../api";
import { useQuery, useMutation, useQueryClient } from "react-query";

// api.js

export const useFetchData = () => {
  return useQuery("department", async () => {
    const token = localStorage.getItem("token");
    const response = await api.get("/department/", {
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
      await api.delete(`/department/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("departments");
      },
    }
  );
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, title, selectedDepartment }) => {
      const token = localStorage.getItem("token");
      var finalId = id;
      if (selectedDepartment?.ID && !isFullyDivisibleBy100(parseInt(selectedDepartment.ID))) {
        finalId = `${selectedDepartment.ID}${id}`;
      }
      await api.post(
        `/department/`,
        {
          ID: finalId,
          Name: title,
          ParentID: selectedDepartment,
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
        queryClient.invalidateQueries("departments");
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
        `/department/${id}`,
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
        queryClient.invalidateQueries("departments");
      },
    }
  );
};
