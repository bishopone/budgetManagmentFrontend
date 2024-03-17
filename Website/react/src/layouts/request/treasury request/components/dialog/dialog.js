/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Autocomplete from "@mui/material/Autocomplete";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import api from "api";
import MDSnackbar from "components/MDSnackbar";
import Chip from "@mui/material/Chip";
import { useQueryClient } from "react-query";

export default function MaxWidthDialog({
  isopen,
  handleClose,
  adminUsers,
  selectedRequest,
  reject,
  comments,
}) {
  const [adminUser, setAdminUser] = useState("");
  const [comment, setComment] = useState(comments === "" ? "" : comments);
  const [errorSB, setErrorSB] = useState(false);
  const [message, setMessage] = useState("");
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [contigencyCodes, setContigencyCodes] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/reject-reasons/1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setReasons(response.data);
        setSelectedReason(response.data[0].reason);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  useEffect(() => {
    fetchLiveData();
  }, []);

  const fetchLiveData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("treasury/stable-total-balance", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setContigencyCodes(response.data);
    } catch (error) {
      console.error("Error fetching contigency codes:", error);
    }
  };

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
  };
  const handleadminChange = (event) => {
    setAdminUser(event.target.value);
  };
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const onConfirm = async () => {
    const token = localStorage.getItem("token");
    console.log(selectedRequest);
    if (!adminUsers.length === 0 && adminUser === "") {
      window.alert("Please Make Sure You have selected an Admin to pass the Task To!!");
      return;
    }
    await api
      .post(
        `/budget/pass/`,
        {
          RequestID: selectedRequest,
          selectedAdmin: adminUser,
          comment: comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setMessage("submited ");
        openSuccessSB(true);
        queryClient.invalidateQueries("fetchcontengecy");

        handleClose();
      })
      .catch((error) => {
        console.error("Error passing request:", error);
        setMessage(error.response.data.error);
        openErrorSB(true);
      });
  };
  const onReject = async () => {
    const token = localStorage.getItem("token");
    console.log(selectedRequest);
    if (selectedReason === "") {
      window.alert("Please Select A Reason for the rejection.");
      return;
    }
    await api
      .post(
        `/budget/reject`,
        {
          RequestID: selectedRequest,
          comment: selectedReason,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setMessage("submited ");
        openSuccessSB(true);
        queryClient.invalidateQueries("fetchcontengecy");

        handleClose();
      })
      .catch((error) => {
        console.error("Error passing request:", error);
        setMessage(error.response.data.error);
        openErrorSB(true);
      });
  };
  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Publice Finance Budget Manager"
      content={message}
      dateTime="Now"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="right"
      title="Publice Finance Budget Manager"
      content={message}
      dateTime="Now"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  return (
    <>
      {reject ? (
        <Dialog fullWidth={true} maxWidth={"sm"} open={isopen} onClose={handleClose}>
          <DialogTitle>Choose A Reason</DialogTitle>
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
              <FormControl sx={{ mt: 2, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-label">Reasons</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={reasons}
                  onChange={handleReasonChange}
                  label="Reason To Decline"
                  inputProps={{
                    name: "max-width",
                    id: "max-width",
                  }}
                >
                  {reasons.map((reason) => (
                    <MenuItem key={reason.id} value={reason.reason}>
                      {reason.reason}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <MDBox mt={5}></MDBox>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setComment(comments === "" ? "" : comments);
                setAdminUser("");
                handleClose();
              }}
            >
              Close
            </Button>
            <Button onClick={() => onReject()}>Submit</Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog fullWidth={true} maxWidth={"sm"} open={isopen} onClose={handleClose}>
          {adminUsers.length === 0 ? (
            <DialogTitle>Complete This Request ?</DialogTitle>
          ) : (
            <DialogTitle>Choose A Reciver</DialogTitle>
          )}{" "}
          <DialogContent>
            {adminUsers ? (
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
                {adminUsers.length !== 0 ? (
                  <FormControl sx={{ mt: 2, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Admins</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      value={adminUser}
                      onChange={handleadminChange}
                      label="Admins"
                      inputProps={{
                        name: "max-width",
                        id: "max-width",
                      }}
                    >
                      {adminUsers.map((admin) => {
                        console.log(admin);
                        return (
                          <MenuItem key={admin.UserID} value={admin.UserID}>
                            {admin.Username}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                ) : null}
                <MDBox mt={5}></MDBox>
                <MyAutocomplete
                  handleCommentChange={handleCommentChange}
                  comment={comment}
                  contigencyCodes={contigencyCodes}
                  setcomment={setComment}
                />
                {/* <TextField
                  onChange={handleCommentChange}
                  value={comment}
                  fullWidth
                  label="Comment"
                  id="fullWidth"
                /> */}
              </Box>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setComment(comments === "" ? "" : comments);
                setAdminUser("");
                handleClose();
              }}
            >
              Close
            </Button>
            <Button onClick={() => onConfirm()}>Submit</Button>
          </DialogActions>
        </Dialog>
      )}
      {renderErrorSB}
      {renderSuccessSB}
    </>
  );
}
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const MyAutocomplete = ({ comment, handleCommentChange, contigencyCodes, setcomment }) => {
  // Dummy data for choices
  console.log(contigencyCodes);
  const getOptionLabel = (option) => {
    console.log("option", option);
    return option?.contigency_id || option;
  };
  return (
    <Autocomplete
      freeSolo
      noOptionsText="No labels"
      sx={{ width: 500 }}
      options={contigencyCodes}
      inputValue={comment}
      renderOption={(props, option) => (
        <MDBox key={option.contigency_id} onClick={() => setcomment(option.contigency_id)}>
          <Chip label={`${option.contigency_id} ${option.name}`} />
          <Chip label={formatNumber(option.total_balance)} color="primary" />
        </MDBox>
      )}
      getOptionLabel={getOptionLabel}
      onInputChange={(event, newInputValue) => setcomment(newInputValue)}
      renderInput={(params) => (
        <TextField
          onChange={handleCommentChange}
          value={comment}
          fullWidth
          label="Comment"
          id="fullWidth"
          {...params}
        />
      )}
    />
  );
};
