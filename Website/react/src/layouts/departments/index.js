/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import api from "../../api.js";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { Grid } from "@mui/material";
import MaxWidthDialog from "./dialog.js";

const DepartmentManager = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  async function fetchData() {
    const token = localStorage.getItem("token");
    await api
      .get("/department/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching total documents:", error);
      });
  }
  const handleDelete = (id) => {
    console.log(id);
    const token = localStorage.getItem("token");
    api
      .delete(`/department/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        fetchData();
      });
  };

  const handleEdit = (item) => {
    console.log(item);
    setSelectedDepartment(item);
    setOpen(true);
  };

  const handleAdd = (item) => {
    console.log(item);
    setSelectedDepartment(item);
    setOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={2}></MDBox>
      <Grid container gap={"5px"}>
        <MDButton onClick={() => handleAdd(null)}> ADD </MDButton>
      </Grid>
      <Grid
        display={"flex"}
        alignContent={"center"}
        justifyContent={"center"}
        container
        height={"100%"}
        columns={2}
        gap={5}
        spacing={3}
      >
        <RecursiveTreeView
          items={data}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        <MaxWidthDialog
          isopen={open}
          handleClose={handleClose}
          selectedDepartment={selectedDepartment}
          fetchdata={fetchData}
        />
      </Grid>
      <Footer />
    </DashboardLayout>
  );
};

export default DepartmentManager;

function RecursiveTreeView({ items, handleAdd, handleEdit, handleDelete }) {
  return (
    <TreeView defaultCollapseIcon={<ArrowDropDownIcon />} defaultExpandIcon={<ArrowRightIcon />}>
      {items.map((item) => (
        <>
          <TreeItem key={item.ID} nodeId={item.ID.toString()} label={`${item.ID} :${item.Name}`}>
            {item.Children && (
              <RecursiveTreeView
                items={item.Children}
                handleAdd={handleAdd}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </TreeItem>
          <Grid container gap={"5px"}>
            <MDButton onClick={() => handleAdd(item)}> ADD </MDButton>
            <MDButton onClick={() => handleEdit(item)}> Edit </MDButton>
            <MDButton onClick={() => handleDelete(item.ID)}> Delete </MDButton>
          </Grid>
        </>
      ))}
    </TreeView>
  );
}
