/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

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

function UserForm({ user, onSubmit }) {
  const classes = useStyles();
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., make an API request
    onSubmit(formData);
  };
  console.log("formData.Username");
  console.log(formData.Username);
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
        <MenuItem value="Receiver">Receiver</MenuItem>
        <MenuItem value="Provider">Provider</MenuItem>
      </Select>
      <TextField
        label="Profile Picture Link"
        name="ProfilePictureLink"
        value={formData.ProfilePictureLink}
        onChange={handleChange}
      />
      <Select label="Gender" name="Gender" value={formData.Gender} onChange={handleChange}>
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </Select>
      <TextField
        type="number"
        label="Department ID"
        name="DepartmentID"
        value={formData.DepartmentID}
        onChange={handleChange}
      />
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

export default UserForm;
