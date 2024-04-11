/* eslint-disable react/prop-types */
// LanguageControl.js
import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  fetchLanguages,
  updateTranslation,
  createLanguage,
  deleteLanguageTranslation,
} from "./api";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useQueryClient } from "react-query"; // Import queryClient from React Query
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import ErrorComponent from "examples/Error";
import CircularProgress from "@mui/material/CircularProgress";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDSnackbar from "components/MDSnackbar";

const LanguageControl = () => {
  const { data: languages, isLoading, isError } = useQuery("languages", fetchLanguages);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const queryClient = useQueryClient();
  const [languageKey, setLanguageKey] = useState("");
  const [message, setMessage] = useState("");
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const [errorSB, setErrorSB] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const handleLanguageChange = (selectedLanguageId) => {
    // const selectedLanguageId = event.target.value;
    setSelectedLanguage(selectedLanguageId);
  };
  const handleLanguageAdd = async () => {
    if (languageKey === "") {
      window.alert("Language Can Not Be Empty !!");
      return;
    }
    try {
      await createLanguage(languageKey);
      queryClient.invalidateQueries("languages");
      setLanguageKey("");
      setMessage("language key created successfuly");
      openSuccessSB();
    } catch (error) {
      console.log(error);
      setErrorSB("there was a problem with the creation of language");
      openErrorSB();
    }
  };
  const handleDelete = async (languageKey) => {
    await deleteLanguageTranslation(languageKey);
    queryClient.invalidateQueries("languages");
    setMessage(`removed language key : ${languageKey}`);
    openSuccessSB();
  };

  const handleEditTranslation = async (translationId, newValue) => {
    // Assuming translationId is the key of the translation
    await updateTranslation(selectedLanguage, translationId, newValue);
    queryClient.invalidateQueries("languages");
  };

  const getTranslationsWithIds = () => {
    if (selectedLanguage) {
      const selectedLanguageData = languages.find((lang) => lang.code === selectedLanguage);
      const translations = selectedLanguageData.translations;
      return translations.map((translation, index) => {
        const entries = Object.entries(translation);
        const [key, value] = entries[0];
        return {
          id: index,
          name: key,
          value: (
            <EditableTranslationCell
              value={value}
              onEdit={(newValue) => handleEditTranslation(key, newValue)}
            />
          ),
          delete: (
            <MDButton color="error" onClick={() => handleDelete(key)}>
              Delete
            </MDButton>
          ),
        };
      });
    }
    return [];
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <CircularProgress color="inherit" />
          </Grid>
        </Grid>
      </DashboardLayout>
    );
  }
  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Publice Finance Budget Manager"
      content={message}
      dateTime="Now"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="right"
      title="Publice Finance Budget Manager"
      content={message}
      dateTime="Now"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  if (isError) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <ErrorComponent error={error} />
          </Grid>
        </Grid>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox sx={{ justifyContent: "space-between" }}>
        <MDBox sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Select Language:</InputLabel>
          {languages.map((language) => (
            <MDButton onClick={() => handleLanguageChange(language.code)} key={language.id}>
              {language.name}
            </MDButton>
          ))}
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            onChange={(x) => setLanguageKey(x.target.value)}
            value={languageKey}
            type="text"
            label="Language Key"
            fullWidth
          />
        </MDBox>
        <MDButton onClick={() => handleLanguageAdd()}>Add Language Key</MDButton>
      </MDBox>
      {selectedLanguage && (
        <MDBox>
          <DataTable
            canSearch
            table={{
              columns: [
                { Header: "Name", accessor: "name", width: "30%" },
                { Header: "Value", accessor: "value", width: "30%" },
                { Header: "ACTION", accessor: "delete", width: "30%" },
              ],
              rows: getTranslationsWithIds(),
            }}
          />
        </MDBox>
      )}
      <Footer />
      {renderErrorSB}
      {renderSuccessSB}
    </DashboardLayout>
  );
};

const EditableTranslationCell = ({ value, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    setEditing(false);
    onEdit(newValue);
  };

  const handleCancelClick = () => {
    setEditing(false);
    setNewValue(value);
  };

  return (
    <MDBox>
      {editing ? (
        <>
          <MDInput type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
          <MDButton onClick={handleSaveClick}>Save</MDButton>
          <MDButton onClick={handleCancelClick}>Cancel</MDButton>
        </>
      ) : (
        <MDBox>
          {value}
          <MDButton onClick={handleEditClick}>Edit</MDButton>
        </MDBox>
      )}
    </MDBox>
  );
};

export default LanguageControl;
