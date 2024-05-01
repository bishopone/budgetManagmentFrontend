/* eslint-disable react/prop-types */
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import React from "react";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import PieChart from "examples/Charts/PieChart/index";
import VerticalBarChart from "examples/Charts/BarCharts/VerticalBarChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// Data
import DataTable from "examples/Tables/DataTable";
import ErrorComponent from "examples/Error";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";
import { useAnalyticsData } from "./api";
import FlowModal from "./modal";

function formatHours(decimalHours) {
  const roundedHours = Math.round(decimalHours * 10) / 10;
  const formattedString = `${roundedHours}hr`;
  return formattedString;
}

function formatCurrency(value) {
  return parseFloat(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
function Analytics() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  const { data, isLoading, isError, error } = useAnalyticsData();
  const [isOpen, setIsOpen] = React.useState(false);
  const [requestid, setRequestid] = React.useState(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleHistoryOpen = (id) => {
    console.log("handleHistoryOpen", id);
    setRequestid(id);
    setIsOpen(true);
  };

  const handleGeneratePdf = async () => {
    try {
      const gridContainer = document.getElementById("grid-container");
      const pdfWidth = 190;
      const pdf = new jsPDF("p", "mm", "a4");
      const firstHalfImage = await html2canvas(gridContainer, {
        height: gridContainer.offsetHeight,
      });
      pdf.addImage(firstHalfImage.toDataURL("image/png"), "PNG", 10, 10, pdfWidth, 290);
      pdf.save("analytics.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (!isAuthenticated) {
    navigate("/sign-in");
  }
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

  const { distributions, requests } = data;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDButton onClick={handleGeneratePdf}>Generate PDF</MDButton>
      <MDBox py={3} id="grid-container">
        <Grid container spacing={3}>
          {Object.keys(distributions).length !== 0 ? (
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon={"comparearrows"}
                  title={"አማካይ የማጠናቀቂያ ጊዜ"}
                  count={
                    formatHours(distributions?.averageProcessingTime?.AverageProcessingTime) ?? 0
                  }
                  percentage={{
                    color: "success",
                    amount: "",
                    label: `ጥያቄን ለማጠናቀቅ አማካይ ጊዜ`,
                  }}
                />
              </MDBox>
            </Grid>
          ) : null}
          {Object.keys(distributions).length !== 0 ? (
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon={"money"}
                  title={"ትልቁ የበጀት ጥያቄ"}
                  count={formatCurrency(distributions?.largestAndSmallest?.LargestTransfer) ?? 0}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: `የተጠየቀው ትልቁ የበጀት ጥያቄ`,
                  }}
                />
              </MDBox>
            </Grid>
          ) : null}
          {Object.keys(distributions).length !== 0 ? (
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon={"money"}
                  title={"ትንሹ የበጀት ጥያቄ"}
                  count={formatCurrency(distributions?.largestAndSmallest?.SmallestTransfer) ?? 0}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: `የተጠየቀው ትንሹ  የበጀት ጥያቄ`,
                  }}
                />
              </MDBox>
            </Grid>
          ) : null}
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3} columns={12}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <VerticalBarChart
                  icon={{ color: "info", component: "workspaces" }}
                  title="የበጀት ዓይነቶች"
                  description="የበጀት አይነት የገንዘብ ልውውጥ ለእያንዳንዱ የበጀት ዓይነቶች"
                  chart={
                    Object.keys(distributions).length !== 0
                      ? {
                          labels: distributions.averageTransferAmountByType.labels,
                          datasets: distributions.averageTransferAmountByType.datasets,
                        }
                      : {}
                  }
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <PieChart
                  icon={{ color: "info", component: "workspaces" }}
                  title="የበጀት ዓይነቶች"
                  description="ለእያንዳንዱ የበጀት ዓይነቶች የገንዘብ ልውውጥ መጠን"
                  chart={
                    Object.keys(distributions).length !== 0
                      ? {
                          labels: distributions.averageTransferAmountByType.labels,
                          datasets: {
                            label: "amount",
                            backgroundColors: ["info", "primary", "dark", "secondary", "primary"],
                            data: distributions.averageTransferAmountByType.datasets[0].data,
                          },
                        }
                      : {}
                  }
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <VerticalBarChart
                  icon={{ color: "info", component: "leaderboard" }}
                  title="የበጀት ሁኔታ"
                  description="ከሁኔታ ጋር አጠቃላይ የጥያቄዎች ብዛት።"
                  chart={
                    Object.keys(distributions).length !== 0
                      ? {
                          labels: distributions.requestStats.labels,
                          datasets: distributions.requestStats.datasets,
                        }
                      : {}
                  }
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <PieChart
                  icon={{ color: "info", component: "leaderboard" }}
                  title="የበጀት ሁኔታ"
                  description="ከሁኔታ ጋር አጠቃላይ የጥያቄዎች ብዛት።"
                  chart={
                    Object.keys(distributions).length !== 0
                      ? {
                          labels: distributions.requestStats.labels,
                          datasets: {
                            label: "Projects",
                            backgroundColors: ["info", "primary", "dark", "secondary", "primary"],
                            data: distributions.requestStats.datasets[0].data,
                          },
                        }
                      : {}
                  }
                />
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <VerticalBarChart
                  icon={{ color: "info", component: "domain" }}
                  title="ቢሮዎች"
                  description="ከእያንዳንዱ ክፍል የጥያቄዎች ብዛት።"
                  chart={
                    Object.keys(distributions).length !== 0
                      ? {
                          labels: distributions.requestsByRequester.labels,
                          datasets: distributions.requestsByRequester.datasets,
                        }
                      : {}
                  }
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <PieChart
                  icon={{ color: "info", component: "domain" }}
                  title="ቢሮዎች"
                  description="ከእያንዳንዱ ክፍል የጥያቄዎች ብዛት።"
                  chart={
                    Object.keys(distributions).length !== 0
                      ? {
                          labels: distributions.requestsByRequester.labels,
                          datasets: {
                            label: "ጥያቄዎች",
                            backgroundColors: ["info", "primary", "dark", "secondary", "primary"],
                            data: distributions.requestsByRequester.datasets[0].data,
                          },
                        }
                      : {}
                  }
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <VerticalBarChart
                  icon={{ color: "info", component: "today" }}
                  title="የጥያቄ ቀናት"
                  description="በጊዜ ላይ የተመሰረቱ ጥያቄዎች"
                  chart={
                    Object.keys(distributions).length !== 0
                      ? {
                          labels: distributions.requestsByDate.labels,
                          datasets: distributions.requestsByDate.datasets,
                        }
                      : {}
                  }
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <PieChart
                  icon={{ color: "info", component: "today" }}
                  title="የጥያቄ ቀናት"
                  description="በጊዜ ላይ የተመሰረቱ ጥያቄዎች"
                  chart={
                    Object.keys(distributions).length !== 0
                      ? {
                          labels: distributions.requestsByDate.labels,
                          datasets: {
                            label: "ጥያቄዎች",
                            backgroundColors: ["info", "primary", "dark", "secondary", "primary"],
                            data: distributions.requestsByDate.datasets[0].data,
                          },
                        }
                      : {}
                  }
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <VerticalBarChart
                  icon={{ color: "info", component: "receiptlong" }}
                  title="የበጀት ኮዶች"
                  description="ከበጀት ኮድ ወደ የበጀት ኮድ የተላለፈው የገንዘብ መጠን።"
                  chart={
                    Object.keys(distributions).length !== 0
                      ? {
                          labels: distributions.budgetcodes.labels,
                          datasets: distributions.budgetcodes.datasets,
                        }
                      : {}
                  }
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <MDBox>
        <DataTable
          canSearch
          table={{
            columns: [
              { Header: "ቁ.", accessor: "index", width: "15%" },
              { Header: "ID", accessor: "RequestID", width: "25%" },
              { Header: "አይነት", accessor: "Type", width: "25%" },
              { Header: "ብር", accessor: "Amount", width: "20%" },
              { Header: "ከ", accessor: "BudgetFrom", width: "20%" },
              { Header: "ወደ", accessor: "BudgetTo", width: "20%" },
              { Header: "ሁኔታ", accessor: "RequestStatus", width: "20%" },
              { Header: "ቀን", accessor: "RequestDate", width: "20%" },
              {
                Header: "history",
                accessor: "History",
                width: "20%",
                Cell: ({ row }) => (
                  <MDButton onClick={() => handleHistoryOpen(row.original.RequestID)}>
                    HISTORY
                  </MDButton>
                ),
              },
            ],
            rows: [...requests],
          }}
        />
      </MDBox>
      <FlowModal isOpen={isOpen} handleClose={handleClose} id={requestid} />

      <Footer />
    </DashboardLayout>
  );
}

export default Analytics;
