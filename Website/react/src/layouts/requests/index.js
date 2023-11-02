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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import api from "../../api";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import MDButton from "components/MDButton";
import { Modal, Backdrop, Fade, Box } from "@mui/material";
import MaxWidthDialog from "./components/dialog/dialog";
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
function Requests() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    navigate("/authentication/sign-in");
    return null;
  }
  const uiRef = useRef(null);

  const [menu, setMenu] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [fillter, setFillter] = useState(0);
  const [selectedUser, setSelectedUser] = useState({});
  const [errorSB, setErrorSB] = useState(false);
  const [message, setMessage] = useState("");
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  useEffect(() => {
    fetchData();
  }, [fillter]);

  async function fetchData() {
    const token = localStorage.getItem("token");
    const url = `/budget/${fillter === 0 ? "active" : ""}`;
    console.log(url);
    await api
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const userlist = [];
        const budgetTypes = [
          "Normal Budget",
          "Capital Budget",
          "Emergency Budget",
          "Internal Budget",
        ];
        response.data.forEach((x) => {
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
                  <IconButton color="primary" onClick={() => onView(x)}>
                    <Icon>thumb_down</Icon>
                  </IconButton>
                ) : null}
              </>
            ),
            typeName: budgetTypes[x.Type - 1],
          };

          // Push the transformed object to the userlist array
          userlist.push(transformedUser);
        });
        console.log(userlist);
        setUsers(userlist);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }
  const onView = async (value) => {
    console.log(value);
    try {
      const response = await api.get(`/uploads/${value.SignatureFilename}`, {
        responseType: "arraybuffer",
      });
      const arrayBuffer = new Uint8Array(response.data);
      const blob = new Blob([arrayBuffer], { type: "image/png" });
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result.split(",")[1]);
        };
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          reject(error);
        };
        reader.readAsDataURL(blob);
      });
      const NotoSerifEthiopic = {
        NotoSerifEthiopic: {
          data: fetch("/NotoSerifEthiopic-Regular.ttf")
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.blob(); // Get the response as a Blob
            })
            .then((blob) => {
              const reader = new FileReader();
              reader.onload = function (event) {
                const arrayBuffer = event.target.result;
                // Now 'arrayBuffer' contains the font data in binary format
              };
              reader.readAsArrayBuffer(blob);
            })
            .catch((error) => {
              console.error("Error loading TTF font:", error);
            }),
        },
      };
      const inputs = [
        {
          Name: "abeselom",
          Deparment: "አቤቱታ ማጣራትና  አብይ የስራሂደት",
          fromdep1: value.FromDep.toString(),
          fromdep2: "",
          fromdep3: "",
          fromdep4: "",
          fromdep5: "",
          fromdep6: "",
          fromdep7: "",
          todep1: value.ToDep.toString(),
          todep2: "",
          todep3: "",
          todep4: "",
          todep5: "",
          todep6: "",
          todep7: "",
          fromcode1: value.FromBudgetCode.toString(),
          fromcode2: "",
          fromcode3: "",
          fromcode4: "",
          fromcode5: "",
          fromcode6: "",
          fromcode7: "",
          tocode1: value.ToBudgetCode.toString(),
          tocode2: "",
          tocode3: "",
          tocode4: "",
          tocode5: "",
          tocode6: "",
          tocode7: "",
          amount1: value.Amount.toString(),
          amount2: "",
          amount3: "",
          amount4: "",
          amount5: "",
          amount6: "",
          amount7: "",
          reason: "አቤቱታ ማጣራትና  አብይ የስራሂደት",
          status: "",
          finalreason: "",
          field41: `data:image/png;base64,${base64Data}`,
          date: value.RequestDate,
        },
      ];
      generate({ template, inputs, options: { NotoSerifEthiopic } }).then((pdf) => {
        console.log(pdf);
        const blob = new Blob([pdf.buffer], { type: "application/pdf" });
        window.open(URL.createObjectURL(blob));
      });
      // Now you can use base64Data for your intended purposes.
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const onNextStep = async (type, requestId) => {
    const token = localStorage.getItem("token");
    await api
      .get(`/budget/nextauth/${type}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setAdminUsers(response.data);
        setSelectedRequest(requestId);
        handleAdminChoice(true);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleAdminChoice = (value) => {
    setOpen(value);
  };

  const handleClose = () => {
    setOpen(false);
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
    console.log(newValue);
    setFillter(newValue);
  };

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
              <Tab label="Assigned To Me" />
              <Tab label="All Asigned" />
            </Tabs>
          </MDBox>
          <MDBox pt={2} px={2}></MDBox>
          <MDBox mt={2}>
            <DataTable
              table={{
                columns: [
                  { Header: "RequestID", accessor: "RequestID", width: "25%" },
                  { Header: "Budget Type", accessor: "typeName", width: "25%" },
                  { Header: "FromDep", accessor: "FromDep", width: "20%" },
                  { Header: "ToDep", accessor: "ToDep", width: "20%" },
                  { Header: "Date", accessor: "ChangeDate", width: "20%" },
                  { Header: "Amount", accessor: "Amount", width: "20%" },
                  { Header: "State", accessor: "NewState", width: "25%" },
                  { Header: "option", accessor: "option", width: "20%" },
                ],
                rows: [...users],
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
      <MaxWidthDialog
        isopen={open}
        handleClose={handleClose}
        adminUsers={adminUsers}
        selectedRequest={selectedRequest}
        fetchData={fetchData}
      />
      {renderErrorSB}
      {renderSuccessSB}
      <div ref={uiRef} />

      <Footer />
    </DashboardLayout>
  );
}

export default Requests;
