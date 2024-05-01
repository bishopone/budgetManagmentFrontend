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
import ModalContent from "./components/modal";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import api from "../../api";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";
import { useFetchData } from "./api.js";

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
  const { data, isLoading, isError, error } = useFetchData();
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    navigate("/sign-in");
    return null;
  }
  const [menu, setMenu] = useState("All");

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [stampOpen, setStampOpen] = useState(false);
  const [image, setImage] = useState("false");
  const [deleteId, setDeleteId] = useState("");
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
  }, []);

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
        console.log(response);
        const userlist = [];
        response.data.forEach((x) => {
          const transformedUser = {
            ...x,
            ProfilePicture: (
              <MDAvatar
                src={`${api.getUri()}/${x.ProfilePictureLink}`}
                alt="name"
                variant="square"
                size="md"
                onClick={(e) => handleImage(`${api.getUri()}/${x.ProfilePictureLink}`)}
              />
            ),
            Stamp:
              x.Stamp !== null ? (
                <MDAvatar
                  src={`${api.getUri()}/${x.Stamp}`}
                  alt="name"
                  variant="square"
                  size="md"
                  onClick={(e) => handleImage(`${api.getUri()}/${x.Stamp}`, x.StampID)}
                />
              ) : null,
            Signature:
              x.Signature !== null ? (
                <MDAvatar
                  src={`${api.getUri()}/${x.Signature}`}
                  alt="name"
                  variant="square"
                  size="md"
                  onClick={(e) => handleImage(`${api.getUri()}/${x.Signature}`, x.SignatureID)}
                />
              ) : null,
            Titer:
              x.Titer !== null ? (
                <MDAvatar
                  src={`${api.getUri()}/${x.Titer}`}
                  alt="name"
                  variant="square"
                  size="md"
                  onClick={(e) => handleImage(`${api.getUri()}/${x.Titer}`, x.TiterID)}
                />
              ) : null,
            option: (
              <>
                <IconButton color="secondary" onClick={() => handleStamps(x.UserID)}>
                  <Icon>approval</Icon>
                </IconButton>
                <IconButton color="black" onClick={() => onEdit(x)}>
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
        setUsers(userlist);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    await api
      .get("/roles/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  const onEdit = (value) => {
    setSelectedUser(value);
    setMenu("Edit");
  };
  const handleStamps = (value) => {
    setStampOpen(true);
    setSelectedUser(value);
    // setMenu("Edit");
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
        setMessage(response.data.message);
        setUsers((prev) => {
          const filteredUsers = prev.filter((user) => {
            return parseInt(user["UserID"]) !== parseInt(response.data.userId);
          });
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
  const handleImage = (value, id) => {
    setImage(value);
    setOpen(true);
    setDeleteId(id);
  };
  const getAllusers = () => {
    return users;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    if (deleteId === "") {
      return;
    }
    const token = localStorage.getItem("token");

    await api
      .delete(`/signiture/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setMessage("success");
        openSuccessSB(true);
      })
      .catch((error) => {
        console.error("Error deleting signiture or stamp:", error);
        setMessage(error.response.data.error);
        openErrorSB(true);
      });
  };

  const onSubmit = async (data, image) => {
    const token = localStorage.getItem("token");

    // Create FormData object
    const formData = new FormData();

    // Append data fields to FormData
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    // Append image as 'profile' field
    formData.append("profile", image);

    if (menu === "ADD") {
      await api
        .post(`/users/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessage(response.data.message);
          openSuccessSB(true);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          setMessage(error.response.data.error);
          openErrorSB(true);
        });
    } else {
      await api
        .put(`/users/${selectedUser["UserID"]}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessage(response.data.message);
          openSuccessSB(true);
        })
        .catch((error) => {
          console.error("Error updating user:", error);
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
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
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
                  { Header: "Stamp", accessor: "Stamp", width: "25%" },
                  { Header: "Signature", accessor: "Signature", width: "25%" },
                  { Header: "Titer", accessor: "Titer", width: "25%" },
                  { Header: "Name", accessor: "Username", width: "25%" },
                  { Header: "type", accessor: "UserType", width: "25%" },
                  { Header: "Department Name", accessor: "DepartmentName", width: "25%" },
                  { Header: "Gender", accessor: "Gender", width: "25%" },
                  { Header: "PhoneNumber", accessor: "PhoneNumber", width: "25%" },
                  { Header: "option", accessor: "option", width: "25%" },
                ],
                rows: getAllusers(),
              }}
            />
          </MDBox>
        </>
      ) : (
        <MDBox mt={2}>
          <UserForm user={selectedUser} onSubmit={onSubmit} roles={roles} data={data} />
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
        <MDBox sx={style}>
          <Fade sx={style} in={open} timeout={500}>
            <img src={image} alt="asd" style={{ maxHeight: "90%", maxWidth: "90%" }} />
          </Fade>
          <MDButton color="error" onClick={handleDelete}>
            Delete
          </MDButton>
        </MDBox>
      </Modal>
      {renderErrorSB}
      {renderSuccessSB}
      <ModalContent
        isopen={stampOpen}
        handleClose={() => setStampOpen(false)}
        id={selectedUser}
        fetchData={fetchData}
        name={users.find((val) => val.UserID === selectedUser)?.Username ?? ""}
      />

      <Footer />
    </DashboardLayout>
  );
}

export default Users;
