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

import React, { useState, useEffect } from "react";
import api from "../../api";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");

  const [totalBudget, setTotalBudget] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [finishedRequestCount, setFinishedRequestCount] = useState(0);
  const [finishedBudgetAmount, setFinishedBudgetAmount] = useState(0);
  const [budgetFrequency, setBudgetFrequency] = useState({});

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");

      await api
        .get("/dashboard/budget-count", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTotalBudget(response.data.totalNumberOfBudget);
        })
        .catch((error) => {
          console.error("Error fetching total documents:", error);
        });

      // Fetch total number of employees
      await api
        .get("/dashboard/budget-amount-count")
        .then((response) => {
          const formattedNumber = new Intl.NumberFormat().format(response.data.totalAmount);

          setTotalAmount(formattedNumber);
        })
        .catch((error) => {
          console.error("Error fetching total employees:", error);
        });

      // Fetch number of uploaded documents in the last week
      await api
        .get("/dashboard/budget-count-finished")
        .then((response) => {
          setFinishedRequestCount(response.data.finishedRequests);
        })
        .catch((error) => {
          console.error("Error fetching uploaded documents count:", error);
        });
      await api
        .get("/dashboard/budget-amount-count-finished")
        .then((response) => {
          const formattedNumber = new Intl.NumberFormat().format(
            response.data.FinishedBudgetAmount
          );
          setFinishedBudgetAmount(formattedNumber);
        })
        .catch((error) => {
          console.error("Error fetching uploaded documents count:", error);
        });

      await api
        .get("/dashboard/budget-monthly")
        .then((response) => {
          setBudgetFrequency(response.data);
        })
        .catch((error) => {
          console.error("Error fetching uploaded documents count:", error);
        });
    }

    fetchData();
  }, []);

  if (!isAuthenticated) {
    navigate("/authentication/sign-in");
    return null;
  }

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
                title="Budget"
                count={totalBudget}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "The Total Number of Budget requested.",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="paid"
                title="Amount in Birr"
                count={totalAmount}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "The Total Amount of Budget requested in Birr.",
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
                title="Requests Completed"
                count={finishedRequestCount}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "The Total Number of Completed Budget Requests",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="payment"
                title="money transfered"
                count={finishedBudgetAmount}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "The Total Number of Completed Money Transfer",
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
                  title="Budget Request Frequency"
                  description="Number of Budget Transfer Reqested"
                  date="just updated"
                  chart={budgetFrequency}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Document Relationships"
                  description="Types of Document And Relationships"
                  date="just updated"
                  chart={budgetFrequency}
                  // chart={{
                  //   labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  //   datasets: {
                  //     label: "Sales",
                  //     data: [450, 200, 100, 220, 500, 100, 400, 230, 500],
                  //   },
                  // }}
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
