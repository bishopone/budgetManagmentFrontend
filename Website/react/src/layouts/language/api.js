// api.js
import api from "api";

export const fetchLanguages = async () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const response = await api.get("language", { headers });
  return response.data;
};

export const createLanguage = async (language) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const response = await api.post("language", { language }, { headers });
  return response.data;
};
export const deleteLanguageTranslation = async (language) => {
  console.log(language);
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await api.delete(`/language/${language}`, { headers });
    return response;
  } catch (err) {
    console.error(err);
  }
};

export const updateTranslation = async (selectedLanguage, translationId, newValue) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  console.log(selectedLanguage, translationId, newValue);
  const response = await api.put(
    `language/${selectedLanguage}`,
    {
      [translationId]: newValue,
    },
    { headers }
  );

  return response.data;
};
