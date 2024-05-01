/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import api from "api";
import MDSnackbar from "components/MDSnackbar";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import { useQueryClient } from "react-query";

export default function MaxWidthDialogDetail({
  isopen,
  handleClose,
  adminUsers,
  selectedRequest,
  reject,
  type,
}) {
  console.log(adminUsers);
  const [open, setOpen] = useState(isopen);
  const [adminUser, setAdminUser] = useState("");
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [errorSB, setErrorSB] = useState(false);
  const [message, setMessage] = useState("");
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [requestdata, setRequestData] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [acceptedAmounts, setAcceptedAmounts] = useState(requestdata.map(() => ""));
  const queryClient = useQueryClient();

  const handleFullAmountClick = (index) => {
    const newAcceptedAmounts = [...acceptedAmounts];
    newAcceptedAmounts[index] = requestdata[index].Amount;
    setAcceptedAmounts(newAcceptedAmounts);
  };

  const handleSubmitClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedData = requestdata.map((row, index) => ({
        ...row,
        CompletedAmount: acceptedAmounts[index],
        RequestID: selectedRequest,
        selectedAdmin: adminUser,
        comment: comment,
      }));

      await api.put(
        "/budget/details",
        { updatedData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Successfully updated data on the server!");
      setMessage("submited ");
      openSuccessSB(true);
      queryClient.invalidateQueries("fetchrecurrents");
      handleClose();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("selectedRequest", selectedRequest);
    api
      .get(`budget/details/${selectedRequest}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRequestData(response.data);
        setSelectedReason(response.data[0].reason);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [selectedRequest]);

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
        queryClient.invalidateQueries("fetchrecurrents");
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
        queryClient.invalidateQueries("fetchrecurrents");
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
      <Dialog maxWidth={false} open={isopen} onClose={handleClose}>
        {/* <DialogTitle>Choose A Reason</DialogTitle> */}
        <DialogContent>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ display: "table-header-group" }}>
              <TableRow>
                <TableCell colSpan={5} align="center" style={{ width: "100%" }}>
                  Budget Details
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ width: "25%" }} align="center">
                  BudgetFrom
                </TableCell>
                <TableCell style={{ width: "25%" }} align="center">
                  BudgetTo
                </TableCell>
                <TableCell style={{ width: "25%" }} align="center">
                  Amount
                </TableCell>
                <TableCell style={{ width: "25%" }} align="center">
                  AcceptedAmount
                </TableCell>
                <TableCell style={{ width: "25%" }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requestdata.map((row, index) => (
                <TableRow key={index}>
                  <TableCell style={{ width: "25%" }} align="left">
                    {row.BudgetFrom}
                  </TableCell>
                  <TableCell align="left">{row.BudgetTo}</TableCell>
                  <TableCell align="left">{row.Amount}</TableCell>
                  <TableCell align="left">
                    <TextField
                      type="number"
                      value={acceptedAmounts[index]}
                      onChange={(e) => {
                        const newAcceptedAmounts = [...acceptedAmounts];
                        newAcceptedAmounts[index] = e.target.value;
                        setAcceptedAmounts(newAcceptedAmounts);
                      }}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Button onClick={() => handleFullAmountClick(index)}>Full</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                    sx={{ minHeight: 50 }}
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
              <TextField
                onChange={handleCommentChange}
                value={comment}
                fullWidth
                label="Comment"
                id="fullWidth"
              />
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={() => handleSubmitClick()}>Submit</Button>
        </DialogActions>
      </Dialog>

      {renderErrorSB}
      {renderSuccessSB}
    </>
  );
}
