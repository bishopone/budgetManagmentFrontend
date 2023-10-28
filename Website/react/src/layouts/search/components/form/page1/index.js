/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
// Page1.jsx
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDSelect from "components/MDSelect";
import MDProgress from "components/MDProgress";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import api from "../../../../../api";

const Page1 = ({ formData, setFormData, nextPage, previousPage, pageData }) => {
  const handleChange = (e) => {
    
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputformData = [
    {
      title: "First Name",
      placeholder: "First Name",
      inputType: "Input",
      type: "text",
      name: "FirstName",
      validation: {
        required: true,
        minLength: 2,
      },
    },
    {
      title: "Middle Name",
      placeholder: "Middle Name",
      inputType: "Input",
      type: "text",
      name: "MiddleName",
      validation: {
        required: false, // Not required, adjust as needed
      },
    },
    {
      title: "Last Name",
      placeholder: "Last Name",
      inputType: "Input",
      type: "text",
      name: "LastName",
      validation: {
        required: true,
        minLength: 2,
      },
    },
    {
      title: "Birth Date",
      placeholder: "",
      inputType: "Input",
      type: "date",
      name: "BirthDate",
      validation: {
        required: false,
      },
    },
    {
      title: "Gender",
      placeholder: "Gender",
      inputType: "Choice",
      type: "text",
      name: "Gender",
      validation: {
        required: true,
        minLength: 1,
      },
    },
    {
      title: "Nationality",
      placeholder: "Nationality",
      inputType: "Drop",
      type: "number",
      name: "countries",
      validation: {
        required: true,
        min: 1, // You may need to adjust this based on your database
      },
    },
    {
      title: "Phone Number",
      placeholder: "Phone Number",
      inputType: "Input",
      type: "tel",
      name: "PhoneNumber",
      validation: {
        required: false, // Not required, adjust as needed
      },
    },
    {
      title: "Birth Place",
      placeholder: "Birth Place",
      inputType: "Input",
      type: "text",
      name: "BirthPlace",
      validation: {
        required: false, // Not required, adjust as needed
      },
    },
    {
      title: "Religion",
      placeholder: "Religion",
      inputType: "Drop",
      type: "number",
      name: "religions",
      validation: {
        required: false, // Not required, adjust as needed
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
              {inputformData[index].inputType === "Choice" && (
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  name={inputformData[index].name}
                >
                  <FormControlLabel
                    onChange={handleChange}
                    value="Male"
                    checked={formData.Gender === "Male"}
                    control={<Radio />}
                    label="Male"
                    name={inputformData[index].name}
                  />
                  <FormControlLabel
                    onChange={handleChange}
                    value="Female"
                    checked={formData.Gender === "Female"}
                    control={<Radio />}
                    label="Female"
                    name={inputformData[index].name}
                  />
                </RadioGroup>
              )}
              {inputformData[index].inputType === "Drop" && (
                <MDSelect
                  isOptionEqualToValue={(option, value) => option === value}
                  image={inputformData[index].name === "countries"}
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
              {inputformData[index].inputType === "Input" && (
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

export default Page1;
