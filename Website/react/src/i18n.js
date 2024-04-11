// // i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import api from "api";

async function fetchLanguage() {
  try {
    const response = await api.get("/language", {
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.data;
    const parsedLanguageData = data.map((language) => ({
      ...language,
      translations: language.translations,
    }));
    const defaultLanguageCode = parsedLanguageData.length > 0 ? parsedLanguageData[0].code : "en";
    return { data: parsedLanguageData, defaultLanguageCode };
  } catch (error) {
    console.error("Error fetching language:", error);
    throw error;
  }
}
function transformData(data) {
  const result = {};
  console.log(data);
  data.forEach((language) => {
    const translations = {};
    console.log(language);
    language.translations.forEach((translation) => {
      Object.keys(translation).forEach((key) => {
        translations[key] = translation[key];
      });
    });

    result[language.code] = {
      translation: translations,
    };
  });

  return result;
}

const initializeI18n = async () => {
  try {
    const { data } = await fetchLanguage();
    const defaultlanguage = localStorage.getItem("defaultlanguage") || "en";
    const transformedData = transformData(data);
    console.log("translations", transformedData);
    i18n.use(initReactI18next).init({
      resources: transformedData || {},
      debug: true,
      lng: defaultlanguage,
      keySeparator: false,
      interpolation: {
        escapeValue: false,
      },
    });
  } catch (error) {
    console.error("Error initializing i18n:", error);
    throw error;
  }
};

initializeI18n();

export default i18n;
