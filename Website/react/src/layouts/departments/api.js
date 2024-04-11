import api from "../../api";
import { useQuery, useMutation, useQueryClient } from "react-query";

function iterate(data, departments) {
  data.forEach((item) => {
    // console.log(`ID: ${item.ID}, Name: ${item.Name}`);
    const matchingDepartments = departments.filter((dep) => dep.department === item.ID.toString());
    matchingDepartments.forEach((dep) => {
      if (!item.Children) {
        item.Children = [];
      }
      item.Children.push({
        ID: dep.id,
        Name: dep.name,
        Type: "capital",
        Children: null,
      });
    });
    if (item.Children) {
      iterate(item.Children, departments);
    }
  });
  return data;
}
export const useFetchData = () => {
  return useQuery("departments", async () => {
    const token = localStorage.getItem("token");
    const response = await api.get("/department/capital-and-recurrent", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id, type) => {
      const token = localStorage.getItem("token");
      console.log("id, type");
      console.log(id, type);
      if (type !== "undefined") {
        console.log("የስ");
        await api.delete(`/department/capital/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        console.log("ኦፕ");
        await api.delete(`/department/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("departments");
      },
    }
  );
};
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id) => {
      console.log(id);
      const token = localStorage.getItem("token");
      await api.patch(
        `/department/update/${id}`,
        {},
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
export const useCreateCapitalDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, title, selectedDepartment }) => {
      const token = localStorage.getItem("token");
      var finalId = id;
      if (selectedDepartment?.ID && !isFullyDivisibleBy100(parseInt(selectedDepartment.ID))) {
        finalId = `${selectedDepartment.ID}${id}`;
      }
      await api.post(
        `/department/capital`,
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
