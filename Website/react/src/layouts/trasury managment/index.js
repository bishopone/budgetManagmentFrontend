import MDBox from "components/MDBox";
import { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useNavigate } from "react-router-dom";
import api from "api";
import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";
import ModalContent from "./components/modal";
import ContigencyCodeTable from "./components/codemanager";
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
function TreasuryManagment() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  const permissions = JSON.parse(localStorage.getItem("permission")) ?? [];
  const ContengencyCredit = permissions.includes("ContengencyCredit");

  if (!isAuthenticated) {
    navigate("/sign-in");
    return null;
  }
  // const [latestBalance, setLatestBalance] = useState("Loading");
  const [users, setUsers] = useState([]);
  const [previousData, setPreviousData] = useState(null);

  const [open, setOpen] = useState(false);
  // const [image, setImage] = useState("false");
  const [errorSB, setErrorSB] = useState(false);
  const [message, setMessage] = useState("");
  // const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const [successSB, setSuccessSB] = useState(false);
  // const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  // function isEqual(objA, objB) {
  //   return objA === objB;
  // }

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get("/treasury/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const userlist = response.data.map((x, index) => ({ ...x, index }));
      console.log(userlist);
      setUsers(userlist);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchData();

    // // Initialize the EventSource
    // const eventSource = new EventSource(
    //   `${process.env.REACT_APP_API_BASE_URL}/treasury/total-balance`
    // );
    // eventSource.onmessage = async (event) => {
    //   const data = JSON.parse(event.data);

    //   // Check if the data is different from the previous data
    //   if (JSON.stringify(data) !== JSON.stringify(previousData)) {
    //     const formattedNumber = new Intl.NumberFormat("en-US", {
    //       style: "decimal",
    //       maximumFractionDigits: 2,
    //     }).format(data);
    //     setLatestBalance(`${formattedNumber} BIRR`);

    //     // Update previousData with the current data
    //     setPreviousData(data);

    //     // Fetch additional data when there's a change
    //     fetchData();
    //   }
    // };

    // eventSource.onerror = (error) => {
    //   setLatestBalance("Connecting ....");
    //   console.error("SSE error:", error);
    // };

    // return () => {
    //   // Cleanup the EventSource when the component unmounts
    //   eventSource.close();
    // };
  }, []);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const onView = async () => {
    try {
      console.log("selam");
      const pdf = await api.get(`/pdf/report-generate-pdf`, {
        headers: { "Content-Type": "application/pdf" },
        responseType: "arraybuffer",
      });

      const blob = new Blob([pdf.data], { type: "application/pdf" });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(url, "_blank");

      // Release the URL when it's no longer needed to free up resources
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };
  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Publice Finance Budget Manager"
      content={message}
      dateTime="Now"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="right"
      title="Publice Finance Budget Manager"
      content={message}
      dateTime="Now"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ContigencyCodeTable />
      <MDBox pt={2} px={2}></MDBox>
      <MDBox mt={2}>
        {ContengencyCredit ? (
          <MDButton
            color="white"
            bgColor="info"
            borderRadius="lg"
            shadow="lg"
            opacity={1}
            px={10}
            py={5}
            onClick={handleOpen}
          >
            Credit
          </MDButton>
        ) : null}
        <MDButton
          color="white"
          bgColor="info"
          borderRadius="lg"
          shadow="lg"
          opacity={1}
          px={10}
          py={5}
          onClick={onView}
        >
          Report
        </MDButton>
        <DataTable
          table={{
            columns: [
              { Header: "NO", accessor: "index", width: "15%" },
              { Header: "ID", accessor: "transaction_id", width: "25%" },
              { Header: "Type", accessor: "transaction_type", width: "25%" },
              { Header: "Amount", accessor: "amount", width: "20%" },
              { Header: "Amount Before", accessor: "before_balance", width: "20%" },
              { Header: "contigency_id", accessor: "contigency_id", width: "20%" },
              { Header: "Description", accessor: "description", width: "20%" },
              { Header: "Time", accessor: "date_time", width: "20%" },
            ],
            rows: [...users],
          }}
        />
      </MDBox>
      <MDBox pt={2} px={2}></MDBox>
      <ModalContent isopen={open} handleClose={handleClose} />
      {renderErrorSB}
      {renderSuccessSB}
      <Footer />
    </DashboardLayout>
  );
}

export default TreasuryManagment;
