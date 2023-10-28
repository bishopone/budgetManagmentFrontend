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

import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { setLayout, useMaterialUIController } from "context";

import { useState, useEffect } from "react";

import Footer from "examples/Footer";
import api from "../../api";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Card from "@mui/material/Card";
import { useParams } from "react-router-dom";
import Resume from "../details/resume";

function Share() {
  const params = useParams();
  const [controller, dispatch] = useMaterialUIController();
  const handleChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    setLayout(dispatch, "no");

    api
      .get(`/shared/shared-documents/?documentId=${params.id}&documentPassword=${params.password}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  }, []);
  const itemsPerPage = 1;
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <>
      <Card>
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Employee Details
          </MDTypography>
        </MDBox>
        <MDBox>
          {data.employee && page === 1 && (
            <Resume employee={data.employee} Authenticated={data.token}></Resume>
          )}
          {data.documents && page !== 1 && (
            <>
              <MDTypography variant="h5" gutterBottom>
                Documents
              </MDTypography>
              <Grid
                container
                justifyContent="center"
                style={{
                  maxWidth: "100% !important",
                  height: "max-content",
                }}
              >
                {data.documents &&
                  data.documents.slice(startIndex, endIndex).map((document) => (
                    <Grid
                      item
                      xs={4}
                      key={document.DocumentID}
                      style={{
                        maxWidth: "100%",
                        width: "100%",
                        height: "max-content",
                      }}
                    >
                      <TransformWrapper
                        style={{
                          width: "max-content",
                          height: "max-content",
                          maxWidth: "100% !important",
                        }}
                      >
                        <TransformComponent
                          style={{
                            width: "max-content",
                            height: "max-content",
                            maxWidth: "100% !important",
                          }}
                        >
                          <img
                            src={`${api.getUri()}/${document.DocumentPath.replace(
                              "low",
                              "high"
                            )}?token=${data.token}`}
                            alt={`Document ${document.DocumentID}`}
                            style={{
                              width: "max-content",
                              height: "max-content",
                              maxWidth: "100% !important",
                              maxWidth: window.innerWidth / 1.2,
                              maxHeight: window.innerHeight / 2,
                              cursor: "zoom-in",
                            }}
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
      <MDBox pt={2} px={2}></MDBox>
      <Footer />
    </>
  );
}

export default Share;
