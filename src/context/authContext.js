import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "api";

function useAuth() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }
    checkToken(token);
  }, []);
  const checkToken = async (token) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await api.get("/users/checkToken", { headers });
      console.log("response", response);
      if (response.status !== 200) {
        navigate("/sign-in");
        return;
      }
    } catch (error) {
      navigate("/sign-in");
      return;
    }
  };
  return [];
}

export default useAuth;
