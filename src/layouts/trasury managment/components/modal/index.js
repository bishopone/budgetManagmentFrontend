/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useState, useCallback, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useDropzone } from "react-dropzone";
import api from "api";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogTitle from "@mui/material/DialogTitle";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { useQueryClient } from "react-query";
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
  const [idformData, setIdFormData] = useState({ id: "", name: "", type: "" });
  const [contigencyCodes, setContigencyCodes] = useState([]);
  const queryClient = useQueryClient();
  const handleAmountChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9.]/g, "");
    console.log();
    setAmount(numericValue === "" ? "0" : numericValue);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const formattedAmount = formatCurrency(amount);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: "image/*" });

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("contigency_id", idformData.id);
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
      queryClient.invalidateQueries("transaction");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  const handleidChange = (event) => {
    const selectedId = event.target.value;
    const selectedContigency = contigencyCodes.find((contigency) => contigency.id === selectedId);
    setIdFormData((prevData) => ({
      ...prevData,
      id: selectedId,
      name: selectedContigency?.name || "",
      type: selectedContigency?.type || "",
    }));
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/contigency-code/?type=all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setContigencyCodes(response.data);

      // Set the default value for formData.id (the first "id" in the response)
      if (response.data.length > 0) {
        setIdFormData((prevData) => ({ ...prevData, id: response.data[0].id }));
      }
    } catch (error) {
      console.error("Error fetching contigency codes:", error);
    }
  };
  return (
    <Dialog fullWidth={true} maxWidth={"sm"} open={isopen} onClose={handleClose}>
      <DialogTitle>Modal Content</DialogTitle>
      <DialogContent>
        <InputLabel>ID</InputLabel>
        <Select sx={{ minHeight: 50 }} value={idformData.id} onChange={handleidChange} fullWidth>
          {contigencyCodes.map((contigency) => (
            <MenuItem key={contigency.id} value={contigency.id}>
              {contigency.id}: {contigency.name}
            </MenuItem>
          ))}
        </Select>
        {}
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
