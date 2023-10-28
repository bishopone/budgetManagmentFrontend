/* eslint-disable react/jsx-no-undef */
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

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import QRCode from "qrcode";
import { QRCodeSVG } from "qrcode.react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { Box, Pagination } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import MDPagination from "components/MDPagination";
import Card from "@mui/material/Card";
import { useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Resume from "./resume";
import CircularProgress from "@mui/material/CircularProgress";

import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MDButton from "components/MDButton";
import Stack from "@mui/material/Stack";
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    [theme.breakpoints.down("sm")]: {
      flexBasis: "50%",
    },
    [theme.breakpoints.down("xs")]: {
      flexBasis: "100%",
    },
  },
}));
function Details() {
  const classes = useStyles();
  const navigate = useNavigate();
  const Authenticated = localStorage.getItem("token");
  const params = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [password, setPassword] = useState("");
  const openPasswordModal = () => {
    setOpenModal(true);
  };
  const handleChange = (event, value) => {
    setPage(value);
  };
  const [qr, setQr] = useState("");
  const GenerateQRCode = (data) => {
    var host = window.location.host;
    setQr(`${host}/share/${data.document}/${data.password}`);
  };
  const closePasswordModal = () => {
    setOpenModal(false);
  };
  if (!Authenticated) {
    navigate("/authentication/sign-in");
    return null;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get(`/employee/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: `multipart/form-data`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  }, []);
  const itemsPerPage = 1;
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [sharingResponse, setSharingResponse] = useState(null);
  const [data, setData] = useState({});
  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handleSharing = () => {
    setIsSharing(true);
    const token = localStorage.getItem("token");

    api
      .post(
        `/shared/shared-documents/`,
        {
          documentName: `${data.employee.FirstName} ${data.employee.MiddleName} ${data.employee.LastName}`,
          EmployeeID: data.employee.EmployeeID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setSharingResponse(response.data);

        GenerateQRCode(response.data);
        setIsSharing(false);
      })
      .catch((error) => {
        setIsSharing(false);
        console.error("Error fetching search results:", error);
      });
  };
  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={openPasswordModal}>Share The document</MenuItem>
      <MenuItem onClick={closeMenu}>Edit The document</MenuItem>
      <MenuItem onClick={closeMenu}>Delete The document</MenuItem>
    </Menu>
  );
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={2} sx={{ height: "100%" }}>
        <Card id="delete-account" sx={{ height: "100%" }}>
          <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h6" fontWeight="medium">
              Employee Details
            </MDTypography>
            <MDBox pt={2} px={2} display="flex" alignItems="center">
              <MDBox color="text" px={2}>
                <Icon
                  sx={{ cursor: "pointer", fontWeight: "bold" }}
                  fontSize="small"
                  onClick={openMenu}
                >
                  more_vert
                </Icon>
              </MDBox>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                {renderMenu}
              </MDBox>
            </MDBox>
          </MDBox>
          <MDBox px={8}>
            {data.employee && page === 1 && (
              <Resume employee={data.employee} Authenticated={Authenticated}></Resume>
            )}
            {data.documents && page !== 1 && (
              <>
                <MDTypography variant="h5" gutterBottom>
                  Documents
                </MDTypography>
                <Grid container justifyContent="center" spacing={2}>
                  {data.documents &&
                    data.documents.slice(startIndex, endIndex).map((document) => (
                      <Grid item xs={4} key={document.DocumentID}>
                        <TransformWrapper>
                          <TransformComponent>
                            <img
                              src={`${api.getUri()}/${document.DocumentPath.replace(
                                "low",
                                "high"
                              )}?token=${Authenticated}`}
                              alt={`Document ${document.DocumentID}`}
                              style={{ width: "100%", cursor: "zoom-in" }}
                            />
                          </TransformComponent>
                        </TransformWrapper>
                      </Grid>
                    ))}
                </Grid>
              </>
            )}
            <MDBox
              p={4}
              display="flex"
              justifyContent="center"
              spacing={2}
              style={{ height: "100%" }}
            >
              <Stack spacing={2}>
                <Pagination
                  count={data.documents ? data.documents.length : 1}
                  page={page}
                  onChange={handleChange}
                />
              </Stack>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
      <MDBox pt={2} px={2}></MDBox>
      <Footer />
      <Modal
        open={openModal}
        onClose={closePasswordModal}
        aria-labelledby="password-modal"
        aria-describedby="password-modal-description"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div className={classes.paper}>
          {isSharing ? (
            <Card sx={{ maxWidth: 345 }}>
              {" "}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  SHARING
                </Typography>
                <Typography variant="WARNING" color="text.secondary">
                  <CircularProgress></CircularProgress>
                </Typography>
              </CardContent>
            </Card>
          ) : sharingResponse ? (
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  SUCCESS
                </Typography>
                {qr ? <QRCodeSVG value={qr} /> : null}
                <Typography variant="h5" color="text.secondary">
                  DOCUMENT id: {sharingResponse.document}
                </Typography>
                <Typography variant="WARNING" color="text.secondary">
                  PASSWORD : {sharingResponse.password}
                </Typography>
              </CardContent>
              <CardActions
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <MDButton onClick={closePasswordModal} size="small" color="info">
                  Cancel
                </MDButton>
              </CardActions>
            </Card>
          ) : (
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  WARNING
                </Typography>
                <Typography variant="WARNING" color="text.secondary">
                  YOU ARE ABOUT TO SHARE THIS DOCUMENT WITH ANY ONE WHO HAS THE PASSWORD WHICH CAN
                  BE OUTSIDERS
                </Typography>
              </CardContent>
              <CardActions
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <MDButton onClick={closePasswordModal} size="small" color="info">
                  Cancel
                </MDButton>
                <MDButton onClick={handleSharing} size="small" color="warning">
                  Share Document
                </MDButton>
              </CardActions>
            </Card>
          )}
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default Details;
