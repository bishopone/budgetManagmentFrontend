/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import api from "api";
import InputAdornment from "@mui/material/InputAdornment";
import { useCreateDepartment, useEditDepartment } from "./api.js";

export default function MaxWidthDialog({ isopen, handleClose, selectedDepartment, isEdit }) {
  const [title, setTitle] = useState(selectedDepartment?.Name ? selectedDepartment.Name : "");
  const [id, setId] = useState(selectedDepartment?.ID ? selectedDepartment.ID : "");
  const createDepartment = useCreateDepartment();
  const editDepartment = useEditDepartment();
  console.log("selectedDepartmentselectedDepartment", selectedDepartment);
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleIdChange = (event) => {
    setId(event.target.value);
  };
  function isFullyDivisibleBy100(number) {
    return number % 100 === 0;
  }
  const onConfirm = async () => {
    var finalId = id;
    if (selectedDepartment?.ID && !isFullyDivisibleBy100(parseInt(selectedDepartment.ID))) {
      finalId = `${selectedDepartment.ID}${id}`;
    }

    if (isEdit) {
      editDepartment.mutate({
        id: parseInt(selectedDepartment.ID),
        title: title,
      });
    } else {
      createDepartment.mutate({
        id: finalId,
        title: title,
        selectedDepartment: selectedDepartment?.ID ? selectedDepartment.ID : null,
      });
    }
    setTitle("");
    setId("");
    handleClose();
  };
  return (
    <>
      <Dialog fullWidth={true} maxWidth={"sm"} open={isopen} onClose={handleClose}>
        <DialogTitle>FIll In The Form</DialogTitle>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <TextField
              value={selectedDepartment?.ID ? `${selectedDepartment?.ID}/` : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <TextField value={id} onChange={handleIdChange} />
                  </InputAdornment>
                ),
              }}
            />
            <MDBox mt={5}></MDBox>
            <TextField
              onChange={handleTitleChange}
              value={title}
              fullWidth
              label="Title"
              id="fullWidth"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={() => onConfirm()}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
