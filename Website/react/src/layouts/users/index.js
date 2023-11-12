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
import { useState, useEffect } from "react";
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
function Users() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    navigate("/authentication/sign-in");
    return null;
  }
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
        .get("/users/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userlist = [];
          response.data.forEach((x) => {
            const transformedUser = {
              ...x,
              ProfilePicture: (
                <MDAvatar
                  src={x.ProfilePictureLink}
                  alt="name"
                  variant="square"
                  size="md"
                  onClick={(e) => handleImage(x.ProfilePictureLink)}
                />
              ),
              option: (
                <>
                  <IconButton color="warning" onClick={() => onEdit(x)}>
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton color="primary" onClick={() => onDelete(x.UserID)}>
                    <Icon>delete</Icon>
                  </IconButton>
                </>
              ),
            };

            // Push the transformed object to the userlist array
            userlist.push(transformedUser);
          });
          console.log(typeof userlist);
          setUsers(userlist);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
    fetchData();
  }, []);

  const onEdit = (value) => {
    setSelectedUser(value);
    setMenu("Edit");
  };
  const onDelete = async (value) => {
    const token = localStorage.getItem("token");
    await api
      .delete(`/users/${value}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("user");
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
            <MDBox pt={2} px={2} display="flex" alignItems="center">
              <MDButton
                onClick={() => {
                  setMenu("ADD");
                }}
                variant="gradient"
                color="dark"
              >
                <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                &nbsp;add new User
              </MDButton>
            </MDBox>
          </MDBox>
          <MDBox pt={2} px={2}></MDBox>
          <MDBox mt={2}>
            <DataTable
              table={{
                canSearch: true,
                columns: [
                  { Header: "Picture", accessor: "ProfilePicture", width: "25%" },
                  { Header: "Name", accessor: "Username", width: "25%" },
                  { Header: "type", accessor: "UserType", width: "25%" },
                  { Header: "Department Name", accessor: "DepartmentName", width: "25%" },
                  { Header: "Gender", accessor: "Gender", width: "25%" },
                  { Header: "PhoneNumber", accessor: "PhoneNumber", width: "25%" },
                  { Header: "option", accessor: "option", width: "25%" },
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

      <Footer />
    </DashboardLayout>
  );
}

export default Users;
