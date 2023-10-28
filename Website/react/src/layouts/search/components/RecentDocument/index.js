/* eslint-disable react/prop-types */
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

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Projects from "layouts/documents/components/Projects";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import { useState } from "react";

// Images
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function RecentDocument({ nextPage }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);
  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Edit A document</MenuItem>
      <MenuItem onClick={closeMenu}>Delete A document</MenuItem>
    </Menu>
  );

  return (
    <Card id="delete-account">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Recent Documents
        </MDTypography>
        <MDBox pt={2} px={2} display="flex" alignItems="center">
          <MDButton onClick={nextPage} variant="gradient" color="dark">
            <Icon sx={{ fontWeight: "bold" }}>add</Icon>
            &nbsp;add new Document
          </MDButton>
          <MDBox color="text" px={2}>
            <Icon
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              fontSize="small"
              onClick={openMenu}
            >
              more_vert
            </Icon>
          </MDBox>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            {renderMenu}
          </MDBox>
        </MDBox>
      </MDBox>
      <MDBox pt={2} px={2}></MDBox>
      <Projects></Projects>
    </Card>
  );
}

export default RecentDocument;
