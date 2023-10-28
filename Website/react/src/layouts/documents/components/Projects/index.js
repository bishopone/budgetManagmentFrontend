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

import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import { makeStyles } from "@mui/styles";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

import { useNavigate } from "react-router-dom";
import api from "../../../../api";
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
function Projects() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("false");

  const handleClose = () => {
    setOpen(false);
  };

  const handleImage = (value) => {
    setImage(value);
    setOpen(true);
  };
  const [recentDocuments, setRecentDocuments] = useState({
    columns: [
      { Header: "Name", accessor: "name", width: "35%", align: "left" },
      { Header: "document", accessor: "DocumentPath", width: "25%", align: "left" },
      { Header: "type", accessor: "TypeName", align: "center" },
      { Header: "date", accessor: "UploadDate", align: "center" },
    ],
    rows: [],
  });
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    navigate("/authentication/sign-in");
    return null;
  }
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      await api
        .get("/dashboard/documents-recent", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          response.data.rows.map((x) => {
            const url = x.DocumentPath;
            x.DocumentPath = (
              <MDAvatar
                src={`http://localhost:5000/${url}?token=${token}`}
                alt="name"
                variant="square"
                size="md"
                onClick={(e) =>
                  handleImage(`http://localhost:5000/${url.replace("low", "high")}?token=${token}`)
                }
              />
            );
            var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
            const date = new Date(x.UploadDate);
            x.UploadDate = date.toLocaleDateString("en-US", options);
          });
          setRecentDocuments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching total documents:", error);
        });
    }
    fetchData();
  }, []);

  return (
    <Card>
      <MDBox>
        <DataTable
          table={recentDocuments}
          showTotalEntries={true}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
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
    </Card>
  );
}

export default Projects;
