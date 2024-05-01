// api.js
import api from "api";

const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export { updateUser };
