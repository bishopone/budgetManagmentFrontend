/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDropzone } from "react-dropzone";
import api from "api";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MDButton from "components/MDButton";
function formatCurrency(value) {
  return parseFloat(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function ModalContent({ isopen, handleClose }) {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [amount, setAmount] = useState("0");

  const handleAmountChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9.]/g, "");
    console.log();
    setAmount(numericValue === "" ? "0" : numericValue);
  };

  const formattedAmount = formatCurrency(amount);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: "image/*" });

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("description", description);
    formData.append("transaction_type", "credit");

    files.forEach((file) => {
      formData.append(`attachment`, file);
    });
    try {
      await api.post("/treasury", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      handleClose();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Dialog fullWidth={true} maxWidth={"sm"} open={isopen} onClose={handleClose}>
      <DialogTitle>Modal Content</DialogTitle>
      <DialogContent>
        <TextField label="Amount" value={formattedAmount} onChange={handleAmountChange} fullWidth />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
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
