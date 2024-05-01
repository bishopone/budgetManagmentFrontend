/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import { Button, Box } from "@mui/material";

function FileUploadButton({ name, formData, setFormData }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    // Do something with the selected file
    
    setFormData({
      ...formData,
      [name]: name === "RelatedDocuments" ? selectedFiles : selectedFiles[0],
    });
  };

  return (
    <Box>
      <Button variant="contained" color={"black"} onClick={handleButtonClick}>
        Upload {name}
      </Button>
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileChange}
        multiple={name === "RelatedDocuments"}
        ref={fileInputRef}
        style={{
          display: "none", // Hide the input element
        }}
      />
    </Box>
  );
}

export default FileUploadButton;
