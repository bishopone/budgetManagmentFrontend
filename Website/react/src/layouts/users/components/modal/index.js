/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from "api";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MDButton from "components/MDButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function ModalContent({ isopen, handleClose, id, fetchData, name }) {
  const [files, setFiles] = useState([]);
  const [type, setType] = useState("");
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: "image/*" });

  const handleSubmit = async () => {
    if (type === "") {
      return;
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("userid", id);
    formData.append("type", type);
    files.forEach((file) => {
      formData.append(`signiture`, file);
    });
    try {
      await api.post("/signiture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
      handleClose();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  const handleTypeChange = (val) => {
    setType(val.target.value);
  };
  return (
    <Dialog fullWidth={true} maxWidth={"sm"} open={isopen} onClose={handleClose}>
      <DialogTitle>Name :{name}</DialogTitle>
      <DialogContent>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          value={type}
          onChange={handleTypeChange}
          label="Reason To Decline"
          inputProps={{
            name: "max-width",
            id: "max-width",
          }}
        >
          <MenuItem key={"Stamp"} value={"Stamp"}>
            Stamp
          </MenuItem>
          <MenuItem key={"Signature"} value={"Signature"}>
            Signature
          </MenuItem>
          <MenuItem key={"Titer"} value={"Titer"}>
            Titer
          </MenuItem>
        </Select>
        <div {...getRootProps()} style={dropzoneStyle}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag and drop some files here, or click to select files</p>
          )}{" "}
        </div>
        {files.length > 0 && (
          <div>
            <h3>Uploaded Files:</h3>
            <ul>
              {files.map((file) => (
                <li key={file.name}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}{" "}
      </DialogContent>

      <DialogActions>
        <MDButton onClick={handleClose} variant="contained" color="secondary">
          Cancel
        </MDButton>
        <MDButton onClick={handleSubmit} color="success">
          Submit
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

const dropzoneStyle = {
  border: "2px dashed #ccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

export default ModalContent;
