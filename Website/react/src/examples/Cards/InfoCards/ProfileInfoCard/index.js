/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-routers components
import { Link } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React base styles
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import MDButton from "components/MDButton";

function ProfileInfoCard({ title, description, info, action, shadow }) {
  const labels = [];
  const values = [];
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(
    Object.entries(info).map(([key, value]) => ({ [key]: value }))
  );
  const handleEdit = (value) => {
    // setEditData((prevData) => [...prevData, { [value.target.name]: value.target.value }]);
    updateValueByKey(value.target.name, value.target.value);
  };
  const updateValueByKey = (key, newValue) => {
    setEditData((prevDataArray) => {
      const newDataArray = prevDataArray.map((obj) => {
        if (obj.hasOwnProperty(key)) {
          // Create a new object with the updated value
          return { ...obj, [key]: newValue };
        }
        return obj;
      });

      return newDataArray;
    });
  };
  const handleSubmit = (value) => {
    console.log(editData);
  };
  Object.keys(info).forEach((el) => {
    labels.push(el);
  });

  // Push the object values into the values array
  Object.values(info).forEach((el) => values.push(el));

  const findValueByKey = (key) => {
    const foundObject = editData.find((obj) => obj.hasOwnProperty(key));
    return foundObject ? foundObject[key] : undefined;
  };
  // Render the card info items
  const renderItems = labels.map((label, key) => (
    <MDBox key={label} display="flex" py={1} pr={2}>
      <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
        {label}: &nbsp;
      </MDTypography>
      <MDTypography variant="button" fontWeight="regular" color="text">
        &nbsp;{values[key]}
      </MDTypography>
    </MDBox>
  ));
  const renderEditItems = labels.map((label, key) => {
    return (
      <MDBox key={label} display="flex" py={1} pr={2}>
        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
          {label}: &nbsp;
        </MDTypography>
        {console.log(label)}
        {/* {findValueByKey(label)} */}
        {label === "Gender" ? (
          <Select label={label} name={label} value={findValueByKey(label)} onChange={handleEdit}>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        ) : (
          <TextField
            name={label}
            label={label}
            value={findValueByKey(label)}
            onChange={handleEdit}
            fullWidth
          />
        )}
      </MDBox>
    );
  });

  // Render the card social media icons
  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        <MDTypography
          onClick={() => {
            console.log("selam");
            setIsEdit(!isEdit);
          }}
          variant="body2"
          color="secondary"
        >
          <Tooltip title={action.tooltip} placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
        </MDBox>
        <MDBox opacity={0.3}>
          <Divider />
        </MDBox>
        <MDBox>{isEdit ? renderEditItems : renderItems}</MDBox>
        {isEdit ? <MDButton onClick={handleSubmit}>Submit</MDButton> : null}
      </MDBox>
    </Card>
  );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  social: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
};

export default ProfileInfoCard;
