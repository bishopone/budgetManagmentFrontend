/* eslint-disable react/jsx-props-no-spreading */
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Typography } from "@mui/material";
import Documents from "layouts/required documents/documents.js";
import { useFetchData } from "./api";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function DragOrder() {
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useFetchData();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <DndProvider backend={HTML5Backend}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label={t("Recurrent Budget")} />
            <Tab label={t("Capital Budget")} />
            <Tab label={t("Contingency Budget")} />
            <Tab label={t("Internal Budget")} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Documents data={data["1"] ?? {}} tabid={1} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Documents data={data["2"] ?? {}} tabid={2} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Documents data={data["3"] ?? {}} tabid={3} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <Documents data={data["4"] ?? {}} tabid={4} />
        </CustomTabPanel>
      </DndProvider>
      <Footer />
    </DashboardLayout>
  );
}
export default DragOrder;
