/* eslint-disable react/prop-types */
import React from "react";
import { Paper, Grid, Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MDTypography from "components/MDTypography";

const useStyles = makeStyles((theme) => ({
  resumeContainer: {
    padding: theme.spacing(2),
    width: "210mm", // A4 paper width
    height: "297mm", // A4 paper height
    margin: "auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    width: "100%", // Change to full width for responsiveness
    [theme.breakpoints.up("md")]: {
      width: "210mm", // A4 paper width for larger screens
    },
    justifyContent: "space-evenly", // Vertically center the content
    marginBottom: theme.spacing(2),
  },
  resumeContainer: {
    width: "100%", // Change to full width for responsiveness
    height: "100%", // Change to full width for responsiveness
    margin: "auto",
    [theme.breakpoints.up("md")]: {
      width: "210mm", // A4 paper width for larger screens
    },
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "start", // Vertically center the content
    alignItems: "center", // Horizontally center the content
    padding: theme.spacing(2),
  },
  gridContainer: {
    padding: theme.spacing(2),
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // 2 columns
    gap: theme.spacing(2), // Gap between items
  },
  gridItem: {
    border: "1px solid #ccc",
    borderRadius: theme.spacing(1),
  },
  profilePicture: {
    [theme.breakpoints.up("md")]: {
      width: "120px ",
      height: "120px ",
    },
    [theme.breakpoints.down("md")]: {
      width: "100px ",
      height: "100px ",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80px ",
      height: "80px ",
    },
    borderRadius: "50%",
  },
  sectionHeader: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  sectionContent: {
    padding: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  responsiveTypography: {
    [theme.breakpoints.up("md")]: {
      fontSize: "16px",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "14px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
    },
  },
}));

const Resume = ({ employee, Authenticated }) => {
  const classes = useStyles();
  const url = process.env.REACT_APP_API_BASE_URL;

  return (
    <Paper elevation={3} className={classes.resumeContainer}>
      <div className={classes.header}>
        <Avatar
          src={`${url}/${
            employee.ProfilePicture
              ? employee.ProfilePicture.replace("low", "high").replaceAll("\\", "/")
              : "uploads/NoImage.jpg"
          }?token=${Authenticated}`}
          className={classes.profilePicture}
        />
        <div>
          <MDTypography
            variant="h4"
            className={classes.responsiveTypography}
          >{`${employee.FirstName.toUpperCase()} ${employee.MiddleName.toUpperCase()} ${employee.LastName.toUpperCase()}`}</MDTypography>
          <MDTypography
            className={classes.responsiveTypography}
          >{`Employee ID: ${employee.EmployeeID}`}</MDTypography>
          <MDTypography
            className={classes.responsiveTypography}
          >{`Position : ${employee.EmployeePosition}`}</MDTypography>
          <MDTypography
            className={classes.responsiveTypography}
          >{`Department : ${employee.EmployeeDepartment}`}</MDTypography>
        </div>
      </div>
      <div className={classes.gridContainer}>
        <div className={classes.gridItem}>
          <div>
            <div className={classes.sectionHeader}>
              <MDTypography className={classes.responsiveTypography} variant="h6">
                Personal Information
              </MDTypography>
            </div>
            <div className={classes.sectionContent}>
              <MDTypography
                className={classes.responsiveTypography}
                variant="body1"
              >{`Gender: ${employee.Gender}`}</MDTypography>
              <MDTypography
                className={classes.responsiveTypography}
                variant="body1"
              >{`Birth Date: ${employee.BirthDate}`}</MDTypography>
              <MDTypography
                className={classes.responsiveTypography}
                variant="body1"
              >{`Birth Place: ${employee.BirthPlace}`}</MDTypography>
            </div>
          </div>
          <div>
            <div className={classes.sectionHeader}>
              <MDTypography className={classes.responsiveTypography} variant="h6">
                Contact
              </MDTypography>
            </div>
            <div className={classes.sectionContent}>
              <MDTypography
                className={classes.responsiveTypography}
                variant="body1"
              >{`Phone Number: ${employee.PhoneNumber}`}</MDTypography>
            </div>
          </div>
        </div>
        <div className={classes.gridItem}>
          <div>
            <div className={classes.sectionHeader}>
              <MDTypography className={classes.responsiveTypography} variant="h6">
                Work Information
              </MDTypography>
            </div>
            <div className={classes.sectionContent}>
              <MDTypography
                className={classes.responsiveTypography}
                variant="body1"
              >{`Salary: $${parseFloat(employee.Salary).toFixed(2)}`}</MDTypography>
            </div>
          </div>
          <div>
            <div className={classes.sectionHeader}>
              <MDTypography className={classes.responsiveTypography} variant="h6">
                Education
              </MDTypography>
            </div>
            <div className={classes.sectionContent}>
              <MDTypography
                className={classes.responsiveTypography}
                variant="body1"
              >{`Education Level ID: ${employee.EducationLevelName}`}</MDTypography>
            </div>
          </div>
          <div>
            <div className={classes.sectionHeader}>
              <MDTypography className={classes.responsiveTypography} variant="h6">
                Additional Information
              </MDTypography>
            </div>
            <div className={classes.sectionContent}>
              <MDTypography
                className={classes.responsiveTypography}
                variant="body1"
              >{`Religion ID: ${employee.EmployeeReligion}`}</MDTypography>
              <MDTypography
                className={classes.responsiveTypography}
                variant="body1"
              >{`Marital Status: ${employee.MaritalStatus}`}</MDTypography>
              <MDTypography
                className={classes.responsiveTypography}
                variant="body1"
              >{`Number of Children: ${employee.Numberofchildren}`}</MDTypography>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default Resume;
