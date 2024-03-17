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
import Icon from "@mui/material/Icon";

import { useState, useEffect, useRef } from "react";
// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import IconButton from "@mui/material/IconButton";

import { useNavigate } from "react-router-dom";
import api from "api";
import LoadingModal from "examples/Loading"; // Make sure to adjust the import path based on your project structure
import MDSnackbar from "components/MDSnackbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MaxWidthDialog from "./components/dialog/dialog";
import MaxWidthDialogDetail from "./components/dialog/dialogdetail";
import { useTranslation } from "react-i18next";
import ErrorComponent from "examples/Error";
import { CircularProgress, Grid } from "@mui/material";
import { useFetchData } from "./api";

// eslint-disable-next-line react/prop-types
function Requests({ budgettype }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    navigate("/sign-in");
    return null;
  }

  const [reject, setIsReject] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState("");
  const [type, setType] = useState("");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [fillter, setFillter] = useState(0);
  const [errorSB, setErrorSB] = useState(false);
  const [message, setMessage] = useState("");
  const openErrorSB = () => setErrorSB(true);
  const [comment, setComment] = useState("");
  const closeErrorSB = () => setErrorSB(false);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {
    data: Requests,
    isLoading: isrequestLoading,
    isError: isrequestError,
    error: requestError,
  } = useFetchData(fillter, budgettype);
  // const [prevFillter, setPrevFillter] = useState(null);

  // useEffect(() => {
  //   if (prevFillter !== fillter) {
  //     fetchData();
  //     setPrevFillter(fillter);
  //   }
  // }, [fillter, prevFillter]);

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  // async function fetchData() {
  //   const token = localStorage.getItem("token");
  //   const url = `/budget/${fillter === 0 ? `active/${budgettype}` : `${budgettype}`}`;
  //   console.log(url);
  //   await api
  //     .get(url, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       const userlist = [];
  //       const budgetTypes = [
  //         "Recurrent Budget",
  //         "Capital Budget",
  //         "Contengency Budget",
  //         "Internal Budget",
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
  //                   onClick={() => onNextStep(x.Type, x.RequestID, x.comments)}
  //                 >
  //                   <Icon>thumb_up</Icon>
  //                 </IconButton>
  //               ) : null}
  //               {fillter === 0 ? (
  //                 <IconButton color="primary" onClick={() => onReject(x)}>
  //                   <Icon>thumb_down</Icon>
  //                 </IconButton>
  //               ) : null}
  //             </>
  //           ),
  //           BudgetFrom:
  //             x.BudgetFrom === 0
  //               ? "መደበኛ መጠባበቀያ"
  //               : x.BudgetFrom === 1
  //               ? "ካፒታል መጠባበቀያ"
  //               : x.BudgetFrom,
  //           typeName: t(budgetTypes[x.Type - 1]),
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
      handleModalClose();
      console.error("Error fetching PDF:", error);
    }
  };

  const onReject = async (value) => {
    console.log(value);
    setOpen(true);
    setSelectedRequest(value.RequestID);
    setIsReject(true);
  };

  const onNextStep = async (type, requestId, comment) => {
    // console.log(type, requestId);
    const token = localStorage.getItem("token");
    await api
      .get(`/budget/nextauth/${type}/${requestId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("comment", comment);
        setComment(comment || "");
        setAdminUsers(response.data.auths);
        setSelectedRequest(requestId);
        setType(response.data.type);
        handleAdminChoice(true);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleAdminChoice = (value) => {
    setIsReject(false);
    setOpen(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const onSubmit = async (data) => {
  //   const token = localStorage.getItem("token");

  //   if (menu === "ADD") {
  //     console.log("ADD");
  //     console.log(data);
  //     await api
  //       .post(`/users/`, data, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         setMessage(response.data.message);
  //         // setUsers();
  //         openSuccessSB(true);
  //       })
  //       .catch((error) => {
  //         console.error("Error creating user:", error);
  //         setMessage(error.response.data.error);
  //         openErrorSB(true);
  //       });
  //   } else {
  //     console.log("Edit");
  //     console.log(data);
  //     await api
  //       .put(`/users/${selectedUser["UserID"]}`, data, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         setMessage(response.data.message);
  //         // setUsers();
  //         openSuccessSB(true);
  //       })
  //       .catch((error) => {
  //         console.error("Error creating user:", error);
  //         setMessage(error.response.data.error);
  //         openErrorSB(true);
  //       });
  //   }
  //   setMenu("All");
  // };

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
  const displayRequest = () => {
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
  };
  function formatNumberWithSlashes(input) {
    const inputString = input.toString(); // Convert input to a string
    let formattedString = "";
    for (let i = 0; i < inputString.length; i += 3) {
      const segment = inputString.slice(i, i + 3);
      formattedString += segment;
      if (i + 3 < inputString.length) {
        formattedString += "/";
      }
    }
    console.log("formattedString", formattedString);
    return formattedString;
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
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
                { Header: "ከ", accessor: "BudgetFrom", width: "20%" },
                { Header: "ወደ", accessor: "BudgetTo", width: "20%" },
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
      <MDBox pt={2} px={2}></MDBox>
      {type !== "Worker" ? (
        <MaxWidthDialog
          isopen={open}
          handleClose={handleClose}
          adminUsers={adminUsers}
          selectedRequest={selectedRequest}
          // fetchData={fetchData}
          reject={reject}
          comments={comment}
        />
      ) : reject ? (
        <MaxWidthDialog
          isopen={open}
          handleClose={handleClose}
          adminUsers={adminUsers}
          selectedRequest={selectedRequest}
          // fetchData={fetchData}
          reject={reject}
          comments={comment}
        />
      ) : (
        <MaxWidthDialogDetail
          isopen={open}
          handleClose={handleClose}
          adminUsers={adminUsers}
          selectedRequest={selectedRequest}
          // fetchData={fetchData}
          comments={comment}
        />
      )}

      {renderErrorSB}
      {renderSuccessSB}
      <LoadingModal isVisible={modalVisible} onClose={handleModalClose} />

      <Footer />
    </DashboardLayout>
  );
}

export default Requests;
