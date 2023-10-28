import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import React, { useState, useEffect } from "react";
import api from "../../api";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import PieChart from "examples/Charts/PieChart/index";
import VerticalBarChart from "examples/Charts/BarCharts/VerticalBarChart";
import DefaultLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data

import { useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";
import { Card } from "@mui/material";

function Dashboard() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");

  const [distributions, setDistributions] = useState({});
  const [barCharts, setBarCharts] = useState("salaryDistribution");
  const [pieChart, setPieChart] = useState("educationLevelDistribution");
  const [lineCharts, setLineCharts] = useState("ageGroupsDistribution");

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");

      await api
        .get("/analysis/distribution", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setDistributions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching total documents:", error);
        });
    }

    fetchData();
  }, []);

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    navigate("/authentication/sign-in");
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {Object.keys(distributions).length !== 0
            ? distributions.genderDistribution.labels.map((label, index) => (
                <Grid item key={index} xs={12} md={6} lg={3}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      icon={label.toLowerCase()}
                      title={label}
                      count={distributions.genderDistribution.datasets[index]}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: `The Total Number of ${label}s.`,
                      }}
                    />
                  </MDBox>
                </Grid>
              ))
            : null}
          {Object.keys(distributions).length !== 0
            ? distributions.maritalStatusDistribution.labels.map((label, index) => (
                <Grid item key={index} xs={12} md={6} lg={3}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      icon={"people"}
                      title={label}
                      count={distributions.maritalStatusDistribution.datasets[index]}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: `The Total Number of ${label}.`,
                      }}
                    />
                  </MDBox>
                </Grid>
              ))
            : null}
          {Object.keys(distributions).length !== 0
            ? distributions.languageDistribution.labels.map((label, index) => (
                <Grid item key={index} xs={12} md={6} lg={3}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      icon={"language"}
                      title={label}
                      count={distributions.languageDistribution.datasets[index]}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: `The Total Number of ${label}.`,
                      }}
                    />
                  </MDBox>
                </Grid>
              ))
            : null}
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3} columns={12}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <Card>
                  <MDBox mb={3}>
                    <MDButton onClick={() => setBarCharts("salaryDistribution")}>
                      {barCharts === "salaryDistribution" ? <Icon>checkbox</Icon> : null} &nbsp;
                      SALARY
                    </MDButton>
                    <MDButton onClick={() => setBarCharts("educationLevelDistribution")}>
                      {barCharts === "educationLevelDistribution" ? <Icon>checkbox</Icon> : null}{" "}
                      &nbsp; EDUCATION
                    </MDButton>
                    <MDButton onClick={() => setBarCharts("ageGroupsDistribution")}>
                      {barCharts === "ageGroupsDistribution" ? <Icon>checkbox</Icon> : null} &nbsp;
                      AGE
                    </MDButton>
                  </MDBox>
                  <VerticalBarChart
                    icon={{ color: "info", component: "leaderboard" }}
                    title="Vertical Bar Chart"
                    description="Sales related to age average"
                    chart={
                      Object.keys(distributions).length !== 0
                        ? {
                            labels: distributions[barCharts].labels,
                            datasets: [
                              {
                                label: "Sales by age",
                                color: "dark",
                                data: distributions[barCharts].datasets,
                              },
                            ],
                          }
                        : {}
                    }
                  />
                </Card>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <Card>
                  <MDBox mb={3}>
                    <MDButton onClick={() => setPieChart("salaryDistribution")}>
                      {pieChart === "salaryDistribution" ? <Icon>checkbox</Icon> : null} &nbsp;
                      SALARY
                    </MDButton>
                    <MDButton onClick={() => setPieChart("educationLevelDistribution")}>
                      {pieChart === "educationLevelDistribution" ? <Icon>checkbox</Icon> : null}{" "}
                      &nbsp; EDUCATION
                    </MDButton>
                    <MDButton onClick={() => setPieChart("ageGroupsDistribution")}>
                      {pieChart === "ageGroupsDistribution" ? <Icon>checkbox</Icon> : null} &nbsp;
                      AGE
                    </MDButton>
                  </MDBox>
                  <PieChart
                    icon={{ color: "info", component: "leaderboard" }}
                    title="Pie Chart"
                    description="Analytics Insights"
                    chart={
                      Object.keys(distributions).length !== 0
                        ? {
                            labels: distributions[pieChart].labels,
                            datasets: {
                              label: "Projects",
                              backgroundColors: ["info", "primary", "dark", "secondary", "primary"],
                              data: distributions[pieChart].datasets,
                            },
                          }
                        : {}
                    }
                  />
                </Card>
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <Card>
                  <MDBox mb={3}>
                    <MDButton onClick={() => setLineCharts("salaryDistribution")}>
                      {lineCharts === "salaryDistribution" ? <Icon>checkbox</Icon> : null} &nbsp;
                      SALARY
                    </MDButton>
                    <MDButton onClick={() => setLineCharts("educationLevelDistribution")}>
                      {lineCharts === "educationLevelDistribution" ? <Icon>checkbox</Icon> : null}{" "}
                      &nbsp; EDUCATION
                    </MDButton>
                    <MDButton onClick={() => setLineCharts("ageGroupsDistribution")}>
                      {lineCharts === "ageGroupsDistribution" ? <Icon>checkbox</Icon> : null} &nbsp;
                      AGE
                    </MDButton>
                  </MDBox>
                  <DefaultLineChart
                    icon={{ color: "info", component: "leaderboard" }}
                    title="Line Chart"
                    description="Analytics Insights"
                    chart={
                      Object.keys(distributions).length !== 0
                        ? {
                            labels: distributions[lineCharts].labels,
                            datasets: [
                              {
                                label: "Organic Search",
                                color: "info",
                                data: distributions[lineCharts].datasets,
                              },
                            ],
                          }
                        : {}
                    }
                  />
                </Card>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
