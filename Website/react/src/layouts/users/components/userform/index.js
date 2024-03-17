/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useDropzone } from "react-dropzone";
import Modal from "@mui/material/Modal";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MDButton from "components/MDButton";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";

// Call the renderModal function in the desired section of the form
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  formControl: {
    minWidth: 120,
  },
}));

function UserForm({ user, onSubmit, roles, data }) {
  const classes = useStyles();
  const [formData, setFormData] = useState(user);
  const [files, setFiles] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  function handleDepChange(value) {
    console.log("value", value);
    setFormData({ ...formData, DepartmentID: value });
  }
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    setFiles(acceptedFiles[0]);
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., make an API request
    onSubmit(formData, files);
  };
  console.log("formData.Username");
  console.log(formData.Username);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 1,
  });

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField
        label="Username"
        name="Username"
        value={formData.Username}
        onChange={handleChange}
      />
      <TextField
        type="password"
        label="Password"
        name="Password"
        value={formData.Password}
        onChange={handleChange}
      />
      <TextField
        type="email"
        label="Email"
        name="Email"
        value={formData.Email}
        onChange={handleChange}
      />
      <Select label="User Type" name="UserType" value={formData.UserType} onChange={handleChange}>
        {roles.map((role) => (
          <MenuItem key={role.roleID} value={role.roleID}>
            {role.roleName}
          </MenuItem>
        ))}
      </Select>
      {/* <TextField
        label="Profile Picture Link"
        name="ProfilePictureLink"
        value={formData.ProfilePictureLink}
        onChange={handleChange}
      /> */}
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
          <h3>Uploaded File:</h3>
          <ul>
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}{" "}
      <Select label="Gender" name="Gender" value={formData.Gender} onChange={handleChange}>
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </Select>
      <Grid container>
        <TextField
          type="number"
          label="Department ID"
          name="DepartmentID"
          value={formData.DepartmentID}
        />
        {renderModal(data, handleDepChange)}
      </Grid>
      <TextField
        type="tel"
        label="Phone Number"
        name="PhoneNumber"
        value={formData.PhoneNumber}
        onChange={handleChange}
      />
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </form>
  );
}
const dropzoneStyle = {
  border: "2px dashed #ccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};
const renderModal = (data, handleDepChange) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log("data", data);
  return (
    <div>
      <MDButton onClick={handleOpen}>Choose Department</MDButton>
      <Dialog fullWidth={true} maxWidth={"sm"} open={open} onClose={handleClose}>
        <DialogTitle>Select Department</DialogTitle>
        <DialogContent>
          <RecursiveTreeView items={data} handleDepChange={handleDepChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
function RecursiveTreeView({ items, handleDepChange }) {
  return (
    <TreeView defaultCollapseIcon={<ArrowDropDownIcon />} defaultExpandIcon={<ArrowRightIcon />}>
      {items.map((treeitem) => (
        <Grid container key={treeitem.ID} style={{ border: "1px solid black" }}>
          <TreeItem nodeId={treeitem.ID.toString()} label={`${treeitem.ID} :${treeitem.Name}`}>
            {treeitem.Children && (
              <RecursiveTreeView items={treeitem.Children} handleDepChange={handleDepChange} />
            )}
          </TreeItem>
          <Grid item>
            <MDButton
              onClick={() => {
                console.log("treeitem.ID", treeitem.ID);
                handleDepChange(treeitem.ID);
              }}
            >
              Select
            </MDButton>
          </Grid>
        </Grid>
      ))}
    </TreeView>
  );
}

export default UserForm;
