/* eslint-disable react/prop-types */
// Page2.jsx

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDSelect from "components/MDSelect";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

import LanguageProficiencyForm from "./languageForm";
const Page2 = ({ formData, setFormData, nextPage, previousPage, pageData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const inputformData = [
    {
      title: "Salary",
      inputType: "input",
      type: "number",
      name: "Salary",
      validation: {
        required: true,
        min: 0,
      },
    },
    {
      title: "Education Level",
      inputType: "drop",
      type: "number",
      name: "educationLevels",
      validation: {
        required: true,
        min: 1, // You may need to adjust this based on your database
      },
    },
    {
      title: "Educational Inistitute",
      inputType: "drop",
      type: "text",
      name: "university",
      validation: {
        required: false, // Not required, adjust as needed
        min: 1, // You may need to adjust this based on your database
      },
    },
    {
      title: "Department",
      inputType: "drop",
      type: "number",
      name: "departments",
      validation: {
        required: true,
        min: 1, // You may need to adjust this based on your database
      },
    },
    {
      title: "Position",
      inputType: "drop",
      type: "number",
      name: "positions",
      validation: {
        required: true,
        min: 1, // You may need to adjust this based on your database
      },
    },
  ];
  return (
    <Card id="delete-account">
      <MDBox pt={2} px={2} alignItems="center">
        {/* <MDProgress value="0" label="preogress"></MDProgress> */}
      </MDBox>
      <MDBox pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Personal Information
        </MDTypography>
      </MDBox>
      <MDBox pt={2} px={2}></MDBox>
      <MDBox pt={2} px={8} sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {inputformData.map((_, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              {inputformData[index].inputType === "drop" && (
                <MDSelect
                  name={inputformData[index].name}
                  onChange={(event, newInputValue) => {
                    
                    setFormData({ ...formData, [inputformData[index].name]: newInputValue });
                  }}
                  defaultValue={formData[inputformData[index].name]}
                  options={pageData[inputformData[index].name]}
                  value={formData[inputformData[index].name]}
                  title={inputformData[index].title}
                ></MDSelect>
              )}
              {inputformData[index].inputType === "input" && (
                <MDInput
                  name={inputformData[index].name}
                  label={inputformData[index].title}
                  type={inputformData[index].type}
                  defaultValue={formData[inputformData[index].name]}
                  placeholder={inputformData[index].placeholder}
                  required={inputformData[index].validation?.required || false}
                  onChange={handleChange}
                />
              )}
            </Grid>
          ))}
        </Grid>
        <LanguageProficiencyForm
          pageData={pageData}
          formData={formData}
          setFormData={setFormData}
        />
      </MDBox>
      <MDBox m pt={2} px={2} display="flex" justifyContent="space-between" alignItems="flex-end">
        <MDButton onClick={previousPage} variant="gradient" color="dark">
          <Icon sx={{ fontWeight: "bold" }}>arrow_left</Icon>
          &nbsp;cancel
        </MDButton>
        <MDButton onClick={nextPage} variant="gradient" color="dark">
          &nbsp;Next Page
          <Icon sx={{ fontWeight: "bold" }}>arrow_right</Icon>
        </MDButton>
      </MDBox>
    </Card>
  );
};

export default Page2;
