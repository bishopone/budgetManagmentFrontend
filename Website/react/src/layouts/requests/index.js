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
import { Navigate } from "react-router-dom";
import api from "../../api";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";

import MDButton from "components/MDButton";
import { Modal, Backdrop, Fade, Box } from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
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

  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("false");
  const [selectedUser, setSelectedUser] = useState({});
  const [errorSB, setErrorSB] = useState(false);
  const [message, setMessage] = useState("");
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      await api
        .get("/budget/", {
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
                  <IconButton color="primary" onClick={() => onView(x)}>
                    <Icon>visibility</Icon>
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => onConfirm(x.RequestID, x.Type, x.NewState)}
                  >
                    <Icon>thumb_up</Icon>
                  </IconButton>
                  <IconButton color="primary" onClick={() => onView(x)}>
                    <Icon>thumb_down</Icon>
                  </IconButton>
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
    fetchData();
  }, []);

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

  const onConfirm = async (RequestID, Type, Previousemessage) => {
    const token = localStorage.getItem("token");
    console.log(token);
    await api
      .post(
        `/budget/pass/`,
        {
          RequestID: RequestID,
          Type: Type,
          PrevMessage: Previousemessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setMessage(response.data.message);
        setUsers((prev) => {
          const filteredUsers = prev.filter((user) => {
            console.log(user["UserID"]);
            console.log(response.data.userId);
            console.log(parseInt(user["UserID"]) !== parseInt(response.data.userId));
            return parseInt(user["UserID"]) !== parseInt(response.data.userId);
          });
          console.log(filteredUsers);
          return filteredUsers;
        });
        openSuccessSB(true);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        setMessage(error.response.data.error);
        openErrorSB(true);
      });
  };
  const handleImage = (value) => {
    setImage(value);
    setOpen(true);
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
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {menu === "All" ? (
        <>
          <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h6" fontWeight="medium"></MDTypography>
          </MDBox>
          <MDBox pt={2} px={2}></MDBox>
          <MDBox mt={2}>
            <DataTable
              table={{
                columns: [
                  { Header: "RequestID", accessor: "RequestID", width: "25%" },
                  { Header: "Budget Type", accessor: "typeName", width: "25%" },
                  { Header: "FromBudgetCode", accessor: "FromBudgetCode", width: "20%" },
                  { Header: "ToBudgetCode", accessor: "ToBudgetCode", width: "20%" },
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
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box sx={style}>
          <Fade sx={style} in={open} timeout={500}>
            <img src={image} alt="asd" style={{ maxHeight: "90%", maxWidth: "90%" }} />
          </Fade>
        </Box>
      </Modal>
      {renderErrorSB}
      {renderSuccessSB}
      <div ref={uiRef} />

      <Footer />
    </DashboardLayout>
  );
}

export default Requests;
