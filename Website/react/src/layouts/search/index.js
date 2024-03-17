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
import Typography from "@mui/material/Typography";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import IDCard from "./idcard";

function Search() {
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_BASE_URL;
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    navigate("/sign-in");
    return null;
  }
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dob.getFullYear();
    const currentMonth = currentDate.getMonth();
    const birthMonth = dob.getMonth();
    const currentDay = currentDate.getDate();
    const birthDay = dob.getDate();
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age--;
    }
    const ageString = age.toString();
    return ageString;
  }

  useEffect(() => {
    setSearching(true);
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      search_name: searchTerm,
      page: 1,
    });

    api
      .get(`/employee/search?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: `multipart/form-data`,
        },
      })
      .then((response) => {
        setSearchResults(response.data.employees.results);
        setLoading(false);
        setSearching(false);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        setLoading(false);
        setSearching(false);
      });
  }, [searchTerm]);
  return (
    <DashboardLayout>
      <DashboardNavbar setSearchTerm={setSearchTerm} />
      <MDBox mt={2}>
        <Typography variant="h4" gutterBottom>
          Search Results
        </Typography>
        {loading || searching ? (
          <Grid container justifyContent="center">
            <CircularProgress color="black" />
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {searchResults.map((result) => (
              <Grid item key={result.EmployeeID} xs={12} sm={6} md={4}>
                <Link to={`/documents/search/${result.EmployeeID}`}>
                  <MDBox elevation={3} style={{ padding: "16px" }}>
                    <IDCard
                      name={`${result.FirstName} ${result.MiddleName} ${result.LastName}`}
                      phoneNumber={result.PhoneNumber}
                      age={calculateAge(result.uploadDate)}
                      gender={result.Gender}
                      imageSrcl={`${url}/${
                        result.ProfilePicture
                          ? result.ProfilePicture.replace("\\", "/")
                          : "uploads/NoImage.jpg"
                      }?token=${isAuthenticated}`}
                      imageSrch={`${url}/${
                        result.ProfilePicture
                          ? result.ProfilePicture.replace("low", "high").replaceAll("\\", "/")
                          : "uploads/NoImage.jpg"
                      }?token=${isAuthenticated}`}
                    />
                  </MDBox>
                </Link>
              </Grid>
            ))}
          </Grid>
        )}
      </MDBox>
      <MDBox pt={2} px={2}></MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Search;
