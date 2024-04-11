// api.js
import api from "api";

const API_URL = "/devices";

export const fetchDevices = async () => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const { data } = await api.get(API_URL, { headers });
  return data;
};

export const updateDeviceState = async (deviceId, newState) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  await api.put(`${API_URL}/${deviceId}`, { state: newState }, { headers });
};
export const deleteDevice = async (deviceId) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  await api.delete(`${API_URL}/${deviceId}`, { headers });
};
