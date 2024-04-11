/* eslint-disable react/prop-types */
import { Card, Dialog, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import React, { useState } from "react";
import { useCreateDepartment, useDeleteDepartment } from "./api";
import MDTypography from "components/MDTypography";

const Documents = ({ data, tabid }) => {
  const [items, setItems] = useState(data);
  const [isModalOpen, setModalOpen] = useState(false);
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [CaseNumber, setCaseNumber] = useState("");
  const [DocumentPlacement, setDocumentPlacement] = useState("");
  const deleteDepartmentMutation = useDeleteDepartment(); // New mutation for deleting permissions
  const createDepartmentMutation = useCreateDepartment(); // New mutation for deleting permissions
  const cases = [
    {
      id: 1,
      name: "Case 1",
    },
    {
      id: 2,
      name: "Case 2",
    },
    {
      id: 3,
      name: "Case 3",
    },
  ];
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = (cases, placement) => {
    console.log(cases, placement);
    setCaseNumber(cases);
    setDocumentPlacement(placement + 1);
    setModalOpen(true);
  };

  const handleInputChange = (dropdownIndex, itemIndex, event) => {
    const { name, value } = event.target;
    const updatedItems = [...items];
    updatedItems[dropdownIndex][itemIndex][name] = value;
    setItems(updatedItems);
  };

  const handleAddItem = async (BudgetTypeID) => {
    console.log(BudgetTypeID, CaseNumber, DocumentPlacement, Name, Description);
    await createDepartmentMutation.mutateAsync({
      BudgetTypeID,
      CaseNumber,
      DocumentPlacement,
      Name,
      Description,
    });
    setCaseNumber("");
    setDocumentPlacement("");
    setModalOpen(false);
  };

  const handleDeleteItem = async (BudgetID) => {
    await deleteDepartmentMutation.mutateAsync(BudgetID);
  };
  return (
    <Card>
      {console.log(data)}
      <MDBox>
        {cases.map((dropdown, dropdownIndex) => (
          <MDBox key={dropdown.id}>
            <MDTypography key={dropdown.id}>{dropdown.name}</MDTypography>
            {items[dropdown.id]?.map((item, itemIndex) => (
              <div key={itemIndex}>
                <TextField
                  name="name"
                  label="Name"
                  value={item?.Name}
                  onChange={(event) => handleInputChange(dropdownIndex, itemIndex, event)}
                />
                <TextField
                  name="description"
                  label="Description"
                  value={item?.Description}
                  onChange={(event) => handleInputChange(dropdownIndex, itemIndex, event)}
                />
                <IconButton onClick={() => handleDeleteItem(item.BudgetID)}>Delete</IconButton>
              </div>
            ))}
            <MDButton
              onClick={() =>
                handleModalOpen(dropdown.id, (items[dropdown.id] && items[dropdown.id].length) || 1)
              }
            >
              Add
            </MDButton>
          </MDBox>
        ))}
      </MDBox>
      <Dialog maxWidth={false} open={isModalOpen} onClose={handleModalClose}>
        <DialogTitle>Create A New Document</DialogTitle>
        <DialogContent>
          <MDBox>
            <TextField
              name="name"
              label="Name"
              value={Name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              name="description"
              label="Description"
              value={Description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <MDButton onClick={() => handleAddItem(tabid)}>Add</MDButton>
          </MDBox>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Documents;
