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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import { useState, useEffect } from "react";
// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
// Billing page components
import RecentDocument from "layouts/documents/components/RecentDocument";
import Page1 from "layouts/documents/components/form/page1";
import Page2 from "layouts/documents/components/form/page2";
import Page3 from "layouts/documents/components/form/page3";
import BillingInformation from "layouts/documents/components/BillingInformation";
import Transactions from "layouts/documents/components/Transactions";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import axios from "axios";

function Documents() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    navigate("/sign-in");
    return null;
  }
  const [formData, setFormData] = useState({});

  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = async () => {
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const [pageData, setPageData] = useState({});

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      await api
        .get("/dropdowns/all/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPageData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching total documents:", error);
        });
    }

    fetchData();
  }, []);
  async function handleSubmit() {
    const data = new FormData();
    const token = localStorage.getItem("token");
    const relatedDocumentsArray = Object.values(formData.RelatedDocuments);

    // Append text fields
    data.append("FirstName", formData.FirstName);
    data.append("MiddleName", formData.MiddleName);
    data.append("LastName", formData.LastName);
    data.append("BirthDate", formData.BirthDate);
    data.append("Gender", formData.Gender);
    data.append("BirthPlace", formData.BirthPlace);
    data.append("PhoneNumber", formData.PhoneNumber);
    data.append("Salary", formData.Salary);
    data.append("Numberofchildren", formData.Numberofchildren);
    data.append("MaritalStatus", formData.MaritalStatus);

    // Append select fields (assuming they have `id` properties)
    data.append("CountryId", formData.countries.id);
    data.append("ReligionId", formData.religions.id);
    data.append("EducationLevelId", formData.educationLevels.id);
    data.append("PositionId", formData.positions.id);
    data.append("DepartmentId", formData.departments.id);
    data.append(`languages`, JSON.stringify(formData.languages));

    // Append languages (assuming each language has an `id` property)
    // formData.languages.forEach((language, index) => {
    //   data.append(`languages[${index}].id`, language.id);
    // });

    // Append images
    relatedDocumentsArray.forEach((document, index) => {
      // Assuming each document in RelatedDocuments is a File object
      data.append(`RelatedDocuments`, document);
    });

    // Assuming ProfilePicture is a File object
    data.append("ProfilePicture", formData.ProfilePicture);
    await axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/employee/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: `multipart/form-data`,
        },
      })
      .then((response) => {})
      .catch((error) => {
        console.error("POST Request Error:", error);
      });
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={2}>
        <div>
          {currentPage === 0 && <RecentDocument nextPage={nextPage} />}
          {currentPage === 1 && (
            <Page1
              pageData={pageData}
              formData={formData}
              setFormData={setFormData}
              nextPage={nextPage}
              previousPage={previousPage}
            />
          )}
          {currentPage === 2 && (
            <Page2
              pageData={pageData}
              formData={formData}
              setFormData={setFormData}
              nextPage={nextPage}
              previousPage={previousPage}
            />
          )}
          {currentPage === 3 && (
            <Page3
              pageData={pageData}
              formData={formData}
              setFormData={setFormData}
              previousPage={previousPage}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </MDBox>
      <MDBox pt={2} px={2}></MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Documents;
