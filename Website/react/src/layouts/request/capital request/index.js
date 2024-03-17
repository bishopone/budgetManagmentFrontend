/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";
import Icon from "@mui/material/Icon";
import { Template, generate } from "@pdfme/generator";

import template from "./template.json";
import { useState, useEffect, useRef } from "react";
// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import UserForm from "./components/userform";
import IconButton from "@mui/material/IconButton";

import { useNavigate } from "react-router-dom";
import api from "api";
import MDSnackbar from "components/MDSnackbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import LoadingModal from "examples/Loading"; // Make sure to adjust the import path based on your project structure

import MaxWidthDialog from "./components/dialog/dialog";
import MaxWidthDialogDetail from "./components/dialog/dialogdetail";
import { useTranslation } from "react-i18next";
import ErrorComponent from "examples/Error";
import { CircularProgress, Grid } from "@mui/material";
import { useFetchData } from "./api";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "500px",
  height: "500px",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
// eslint-disable-next-line react/prop-types
function Requests({ budgettype }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    navigate("/sign-in");
    return null;
  }
  const uiRef = useRef(null);
  const [reject, setIsReject] = useState(false);
  const [type, setType] = useState("");

  const [menu, setMenu] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [fillter, setFillter] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [errorSB, setErrorSB] = useState(false);
  const [message, setMessage] = useState("");
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [prevFillter, setPrevFillter] = useState(null);
  const {
    data: Requests,
    isLoading: isrequestLoading,
    isError: isrequestError,
    error: requestError,
  } = useFetchData(fillter, budgettype);

  // useEffect(() => {
  //   if (prevFillter !== fillter) {
  //     fetchData();
  //     setPrevFillter(fillter);
  //   }
  // }, [fillter, prevFillter]);

  const handleModalOpen = () => {
    setModalVisible(true);
  };
  function formatNumberWithSlashes(input) {
    // Check if the input is null or undefined
    if (input == null || isNaN(input)) {
      return null;
    }

    let numberString = input.toString();

    // Extract the first 3 digits, next 2 digits, and the rest
    let firstPart = numberString.substring(0, Math.min(3, numberString.length));
    let secondPart = numberString.substring(3, Math.min(5, numberString.length));
    let thirdPart = numberString.substring(5, Math.min(7, numberString.length));
    let fourthPart = numberString.substring(7);

    // Format the number string
    let formattedNumber = `${firstPart}/${secondPart}/${thirdPart}/${fourthPart}`;

    return formattedNumber;
  }

  const handleModalClose = () => {
    setModalVisible(false);
  };
  function formatDateString(input) {
    // Ensure the input is a 10-character string
    const inputString = input.toString();
    if (inputString.length !== 10) {
      return inputString; // Return the input as-is if it doesn't match the expected length
    }

    // Split the input string into segments
    const segment1 = inputString.substring(0, 3); // "111"
    const segment2 = inputString.substring(3, 5); // "01"
    const segment3 = inputString.substring(5, 7); // "01"
    const segment4 = inputString.substring(7, 10); // "016"

    // Concatenate the segments with slashes
    const formattedString = `${segment1}/${segment2}/${segment3}/${segment4}`;

    return formattedString;
  }
  // async function fetchData() {
  //   const token = localStorage.getItem("token");
  //   const url = `/budget/${fillter === 0 ? `active/${budgettype}` : `${budgettype}`}`;
  //   await api
  //     .get(url, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       const permissions = JSON.parse(localStorage.getItem("permission")) ?? [];
  //       const canReject = permissions.includes("rejectCapitalRequest");
  //       const userlist = [];
  //       const budgetTypes = [
  //         "Recurrent Budget",
  //         "Capital Own Budget",
  //         "Contengency Budget",
  //         "Internal Budget",
  //         "Capital Other Budget",
  //       ];
  //       response.data.forEach((x) => {
  //         const transformedUser = {
  //           ...x,
  //           option: (
  //             <>
  //               <IconButton color="warning" onClick={() => onView(x)}>
  //                 <Icon>visibility</Icon>
  //               </IconButton>
  //               {fillter === 0 ? (
  //                 <IconButton
  //                   color="success"
  //                   onClick={() => onNextStep(x.Type, x.RequestID, x.comment)}
  //                 >
  //                   <Icon>thumb_up</Icon>
  //                 </IconButton>
  //               ) : null}
  //               {fillter === 0 && canReject ? (
  //                 <IconButton color="primary" onClick={() => onReject(x)}>
  //                   <Icon>thumb_down</Icon>
  //                 </IconButton>
  //               ) : null}
  //             </>
  //           ),
  //           typeName: t(budgetTypes[x.Type - 1]),
  //           BudgetFromformated: formatDateString(x.BudgetFrom),
  //           BudgetToformated: formatDateString(x.BudgetTo),
  //         };

  //         // Push the transformed object to the userlist array
  //         userlist.push(transformedUser);
  //       });
  //       console.log(userlist);
  //       setUsers(userlist);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching users:", error);
  //     });
  // }
  const onView = async (value) => {
    try {
      handleModalOpen();
      const token = localStorage.getItem("token");

      const pdf = await api.get(`/pdf/generate-pdf/${value.RequestID}`, {
        headers: { "Content-Type": "application/pdf", Authorization: `Bearer ${token}` },
        responseType: "arraybuffer",
      });

      const blob = new Blob([pdf.data], { type: "application/pdf" });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      handleModalClose();
      // Open the PDF in a new tab
      window.open(url, "_blank");

      // Release the URL when it's no longer needed to free up resources
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  const onNextStep = async (type, requestId, comment) => {
    const token = localStorage.getItem("token");
    handleModalOpen();

    await api
      .get(`/budget/nextauth/${type}/${requestId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        handleModalClose();
        console.log("comment", comment);
        setComment(comment);
        setAdminUsers(response.data.auths);
        setSelectedRequest(requestId);
        setType(response.data.type);
        handleAdminChoice(true);
      })
      .catch((error) => {
        handleModalClose();

        console.error("Error deleting user:", error);
      });
  };
  const onReject = async (value) => {
    console.log(value);
    setOpen(true);
    setSelectedRequest(value.RequestID);
    setIsReject(true);
  };
  const handleAdminChoice = (value) => {
    setIsReject(false);
    setOpen(value);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getusers = () => {
    return users;
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    if (menu === "ADD") {
      console.log("ADD");
      console.log(data);
      await api
        .post(`/users/`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessage(response.data.message);
          // setUsers();
          openSuccessSB(true);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          setMessage(error.response.data.error);
          openErrorSB(true);
        });
    } else {
      console.log("Edit");
      console.log(data);
      await api
        .put(`/users/${selectedUser["UserID"]}`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessage(response.data.message);
          // setUsers();
          openSuccessSB(true);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          setMessage(error.response.data.error);
          openErrorSB(true);
        });
    }
    setMenu("All");
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
  const [adminUsers, setAdminUsers] = useState([]);
  const handleChange = (event, newValue) => {
    setFillter(newValue);
  };
  if (isrequestLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <CircularProgress color="inherit" />
          </Grid>
        </Grid>
      </DashboardLayout>
    );
  }

  if (isrequestError) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <ErrorComponent error={requestError} />
          </Grid>
        </Grid>
      </DashboardLayout>
    );
  }
  function displayRequest() {
    const userlist = [];
    const budgetTypes = [
      "Recurrent Budget",
      "Capital Budget",
      "Contengency Budget",
      "Internal Budget",
    ];
    Requests.forEach((x) => {
      console.log(x);
      const transformedUser = {
        ...x,
        option: (
          <>
            <IconButton color="warning" onClick={() => onView(x)}>
              <Icon>visibility</Icon>
            </IconButton>
            {fillter === 0 ? (
              <IconButton color="success" onClick={() => onNextStep(x.Type, x.RequestID)}>
                <Icon>thumb_up</Icon>
              </IconButton>
            ) : null}
            {fillter === 0 ? (
              <IconButton color="primary" onClick={() => onReject(x)}>
                <Icon>thumb_down</Icon>
              </IconButton>
            ) : null}
          </>
        ),
        typeName: t(budgetTypes[x.Type - 1]),
        BudgetFromformated: formatNumberWithSlashes(x.BudgetFrom),
        BudgetToformated: formatNumberWithSlashes(x.BudgetTo),
      };
      userlist.push(transformedUser);
    });
    return userlist;
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {menu === "All" ? (
        <>
          <MDBox
            sx={{ width: 500 }}
            pt={2}
            px={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Tabs
              sx={{ width: "100%" }}
              value={fillter}
              centered
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
              <Tab label={t("Assigned To Me")} />
              <Tab label={t("All Assigned")} />
            </Tabs>
          </MDBox>
          <MDBox pt={2} px={2}></MDBox>
          <MDBox mt={2}>
            <DataTable
              table={{
                columns: [
                  { Header: "RequestID", accessor: "RequestID", width: "25%" },
                  { Header: "የበጀት አይነት", accessor: "typeName", width: "25%" },
                  { Header: "የ ላኪ ስም", accessor: "UserName", width: "25%" },
                  { Header: "የ ተቁዋም ስም", accessor: "Name", width: "25%" },
                  { Header: "ከ", accessor: "BudgetFromformated", width: "20%" },
                  { Header: "ወደ", accessor: "BudgetToformated", width: "20%" },
                  { Header: "ቀን", accessor: "ChangeDate", width: "20%" },
                  { Header: "ብር", accessor: "Amount", width: "20%" },
                  { Header: "ሁኔታ", accessor: "NewState", width: "25%" },
                  { Header: "አስተያየት", accessor: "comments", width: "25%" },
                  { Header: "አማራጭ", accessor: "option", width: "20%" },
                ],
                rows: displayRequest(),
              }}
            />
          </MDBox>
        </>
      ) : (
        <MDBox mt={2}>
          <UserForm user={selectedUser} onSubmit={onSubmit} />
        </MDBox>
      )}
      <MDBox pt={2} px={2}></MDBox>
      {type !== "Worker" ? (
        <MaxWidthDialog
          isopen={open}
          handleClose={handleClose}
          adminUsers={adminUsers}
          selectedRequest={selectedRequest}
          reject={reject}
        />
      ) : reject ? (
        <MaxWidthDialog
          isopen={open}
          handleClose={handleClose}
          adminUsers={adminUsers}
          selectedRequest={selectedRequest}
          reject={reject}
        />
      ) : (
        <MaxWidthDialogDetail
          isopen={open}
          handleClose={handleClose}
          adminUsers={adminUsers}
          selectedRequest={selectedRequest}
        />
      )}

      <LoadingModal isVisible={modalVisible} onClose={handleModalClose} />

      {renderErrorSB}
      {renderSuccessSB}
      <div ref={uiRef} />

      <Footer />
    </DashboardLayout>
  );
}

export default Requests;
