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
import ErrorComponent from "examples/Error";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import React from "react";
import { useDashboardData } from "./api";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useAuth from "context/authContext";

function Dashboard() {
  useAuth();
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useDashboardData();

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <CircularProgress color="inherit" />
          </Grid>
        </Grid>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <ErrorComponent error={error} />
          </Grid>
        </Grid>
      </DashboardLayout>
    );
  }

  const { totalBudget, totalAmount, finishedRequestCount, finishedBudgetAmount, budgetFrequency } =
    data;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="money"
                title={t("Total Budget")}
                count={totalBudget.totalNumberOfBudget}
                percentage={{
                  color: "success",
                  amount: "",
                  label: t("Percentage of total budget spent."),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="paid"
                title={t("Total in Birr")}
                count={totalAmount}
                percentage={{
                  color: "success",
                  amount: "",
                  label: t("Percentage of total budget spent in Birr."),
                }}
              />
            </MDBox>
          </Grid>
          {console.log(finishedRequestCount)}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="done"
                title={t("Requests Finished")}
                count={finishedRequestCount}
                percentage={{
                  color: "success",
                  amount: "",
                  label: t("Percentage of finished request count."),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="payment"
                title={t("Budgets Completed")}
                count={finishedBudgetAmount}
                percentage={{
                  color: "success",
                  amount: "",
                  label: t("Percentage of completed budget amount."),
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title={t("Budget Requests Frequency")}
                  description={t("Chart showing the frequency of budget requests.")}
                  date={t("Current status report.")}
                  chart={budgetFrequency}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title={t("Budget Requests Trend")}
                  description={t("Chart showing the trend of budget requests.")}
                  date={t("Current status report.")}
                  chart={budgetFrequency}
                />
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
