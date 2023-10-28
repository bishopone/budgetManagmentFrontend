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
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/documents/components/Projects/data";
import { useNavigate } from "react-router-dom";
import api from "../../../../api";

function Projects() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");

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
            x.DocumentPath = (
              <MDAvatar
                src={`http://localhost:5000/${x.DocumentPath}?t=${token}`}
                alt="name"
                variant="square"
                size="md"
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
    </Card>
  );
}

export default Projects;
