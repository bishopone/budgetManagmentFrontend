/* eslint-disable react/prop-types */
// Page3.jsx
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDProgress from "components/MDProgress";
import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import InputFileUpload from "./fileupload";

const Page3 = ({ formData, setFormData, nextPage, previousPage, handleSubmit }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const inputformData = [
    {
      title: "Marital Status",
      type: "Choice", // Use "file" type for file uploads
      inputType: "Choice", // Use "file" type for file uploads
      name: "MaritalStatus",
      validation: {
        required: false, // Not required, adjust as needed
      },
    },
    {
      title: "Number of children",
      type: "number", // Use "file" type for file uploads
      inputType: "Input", // Use "file" type for file uploads
      name: "Numberofchildren",
      validation: {
        required: false, // Not required, adjust as needed
      },
    },
    {
      title: "Profile Picture",
      type: "file", // Use "file" type for file uploads
      inputType: "FileInput", // Use "file" type for file uploads
      name: "ProfilePicture",
      validation: {
        required: false, // Not required, adjust as needed
      },
    },
    {
      title: "Related Documents",
      type: "file", // Use "file" type for file uploads
      inputType: "FileInput", // Use "file" type for file uploads
      name: "RelatedDocuments",
      validation: {
        required: false, // Not required, adjust as needed
      },
    },
  ];

  return (
    <Card id="delete-account">
      <MDBox pt={2} px={2} alignItems="center">
        {/* <MDProgress value="0" label="preogress"></MDProgress> */}
      </MDBox>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Personal Information
        </MDTypography>
      </MDBox>
      <MDBox pt={2} px={2}></MDBox>
      <MDBox pt={2} px={8} sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 5 }} columns={{ xs: 4, sm: 8, md: 1 }}>
          {inputformData.map((_, index) => (
            <Grid
              item
              xs={2}
              sm={4}
              md={4}
              key={index}
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              {inputformData[index].inputType === "Choice" && (
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  name={inputformData[index].name}
                >
                  <FormControlLabel
                    onChange={handleChange}
                    value="Maried"
                    checked={formData.MaritalStatus === "Maried"}
                    control={<Radio />}
                    label="Maried"
                    name={inputformData[index].name}
                  />
                  <FormControlLabel
                    onChange={handleChange}
                    value="Un-Maried"
                    checked={formData.MaritalStatus === "Un-Maried"}
                    control={<Radio />}
                    label="Un-Maried"
                    name={inputformData[index].name}
                  />
                  <FormControlLabel
                    onChange={handleChange}
                    value="Divorced"
                    checked={formData.MaritalStatus === "Divorced"}
                    control={<Radio />}
                    label="Divorced"
                    name={inputformData[index].name}
                  />
                  <FormControlLabel
                    onChange={handleChange}
                    value="Divorced By Death"
                    checked={formData.MaritalStatus === "Divorced By Death"}
                    control={<Radio />}
                    label="Divorced By Death"
                    name={inputformData[index].name}
                  />
                </RadioGroup>
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
              {inputformData[index].inputType === "FileInput" && (
                <InputFileUpload
                  formData={formData}
                  setFormData={setFormData}
                  name={inputformData[index].name}
                  label={inputformData[index].title}
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
        <MDButton onClick={handleSubmit} variant="gradient" color="dark">
          &nbsp;Sumbit
          <Icon sx={{ fontWeight: "bold" }}>arrow_right</Icon>
        </MDButton>
      </MDBox>
    </Card>
  );
};

export default Page3;
