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
import { Checkbox, Grid } from "@mui/material";
import MaxWidthDialog from "./dialog.js";
import { useDeleteDepartment, useUpdateDepartment, useFetchData } from "./api.js";

/* eslint-disable react/prop-types */

const DepartmentManager = () => {
  const { data, isLoading, isError, error } = useFetchData();
  const deleteDepartment = useDeleteDepartment();
  const updateDepartment = useUpdateDepartment();
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isCapital, setIsCapital] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = (id) => {
    console.log(id);
    updateDepartment.mutate(id);
  };

  const handleDelete = (id, type) => {
    console.log(id);
    deleteDepartment.mutate(id, type);
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

  const handleCreateCapital = (item) => {
    console.log(item);
    setIsCapital(true);
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
          handleCreateCapital={handleCreateCapital}
          handleUpdate={handleUpdate}
        />
        <MaxWidthDialog
          isopen={open}
          handleClose={handleClose}
          selectedDepartment={selectedDepartment}
          isEdit={isEdit}
          isCapital={isCapital}
        />
      </Grid>
      <Footer />
    </DashboardLayout>
  );
};

export default DepartmentManager;

function RecursiveTreeView({
  items,
  handleAdd,
  handleEdit,
  handleDelete,
  handleCreateCapital,
  handleUpdate,
}) {
  return (
    <TreeView defaultCollapseIcon={<ArrowDropDownIcon />} defaultExpandIcon={<ArrowRightIcon />}>
      {items.map((item) => (
        <MDBox key={item.ID}>
          <TreeItem nodeId={item.ID.toString()} label={`${item.ID} :${item.Name}`}>
            {item.Children && (
              <RecursiveTreeView
                items={item.Children}
                handleAdd={handleAdd}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleCreateCapital={handleCreateCapital}
                handleUpdate={handleUpdate}
              />
            )}
          </TreeItem>
          <Grid container gap={"5px"}>
            <MDButton onClick={() => handleAdd(item)}> ADD </MDButton>
            <MDButton onClick={() => handleEdit(item)}> Edit </MDButton>
            {item.Type === "recurrent" ? (
              <MDButton onClick={() => handleCreateCapital(item)}> Create Capital </MDButton>
            ) : null}
            <MDButton onClick={() => handleDelete(item.ID, item.Type)}> Delete </MDButton>
            {item.Type === "recurrent" ? (
              <Checkbox
                checked={item.isSelectable}
                onChange={() => handleUpdate(item.ID)}
                inputProps={{ "aria-label": "controlled" }}
              />
            ) : null}
          </Grid>
        </MDBox>
      ))}
    </TreeView>
  );
}
