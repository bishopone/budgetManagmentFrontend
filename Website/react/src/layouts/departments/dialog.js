/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import MDBox from "components/MDBox";
import api from "../../api";
import InputAdornment from "@mui/material/InputAdornment";

export default function MaxWidthDialog({ isopen, handleClose, selectedDepartment, fetchdata }) {
  const [open, setOpen] = useState(isopen);
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");

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
    const token = localStorage.getItem("token");
    var finalId = id;
    // console.log(selectedRequest);
    if (selectedDepartment?.ID && !isFullyDivisibleBy100(parseInt(selectedDepartment.ID))) {
      finalId = `${selectedDepartment.ID}${id}`;
    }
    console.log({
      ID: finalId,
      Name: title,
      ParentID: selectedDepartment?.ID ? selectedDepartment.ID : null,
    });
    await api
      .post(
        `/department/`,
        {
          ID: finalId,
          Name: title,
          ParentID: selectedDepartment?.ID ? selectedDepartment.ID : null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        fetchdata();
        handleClose();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
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
