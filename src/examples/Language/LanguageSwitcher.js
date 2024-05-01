// LanguageSwitcher.js
import React from "react";
import { useTranslation } from "react-i18next";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const changeLanguage = (lng) => {
    localStorage.setItem("defaultlanguage", lng);
    i18n.changeLanguage(lng);
  };

  return (
    <MDBox>
      <MDButton onClick={() => changeLanguage("en")}>English</MDButton>
      <MDButton onClick={() => changeLanguage("am")}>Amharic</MDButton>
    </MDBox>
  );
}

export default LanguageSwitcher;
