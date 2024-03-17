import React, { useState } from "react";
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
import { useDeleteDepartment, useFetchData } from "./api.js";

/* eslint-disable react/prop-types */

const DepartmentManager = () => {
  const { data, isLoading, isError, error } = useFetchData();
  const deleteDepartment = useDeleteDepartment();
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleDelete = (id) => {
    console.log(id);
    deleteDepartment.mutate(id);
  };

  const handleEdit = (item) => {
    console.log(item);
    setIsEdit(true);
    setSelectedDepartment(item);
    setOpen(true);
  };

  const handleAdd = (item) => {
    console.log(item);
    setIsEdit(false);
    setSelectedDepartment(item);
    setOpen(true);
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
          isEdit={isEdit}
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
