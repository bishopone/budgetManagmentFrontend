// index.js
import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchDevices, updateDeviceState, deleteDevice } from "./api";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import ErrorComponent from "examples/Error";
import Grid from "@mui/material/Grid";

const DeviceTable = () => {
  const queryClient = useQueryClient();

  const { data: devices, isLoading, isError } = useQuery("devices", fetchDevices);

  const toggleDeviceState = useMutation(
    ({ deviceId, newState }) => updateDeviceState(deviceId, newState),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("devices");
      },
    }
  );

  const deleteDeviceMutation = useMutation((deviceId) => deleteDevice(deviceId), {
    onSuccess: () => {
      queryClient.invalidateQueries("devices");
    },
  });

  const handleSwitchChange = (deviceId, currentState) => {
    const newState = currentState === "enabled" ? "disabled" : "enabled";
    toggleDeviceState.mutate({ deviceId, newState });
  };

  const handleDelete = (deviceId) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      deleteDeviceMutation.mutate(deviceId);
    }
  };

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3} id="grid-container">
        <MDBox>
          <DataTable
            canSearch
            table={{
              columns: [
                { Header: "Name", accessor: "Name", width: "20%" },
                { Header: "Username", accessor: "Username", width: "20%" },
                { Header: "Role", accessor: "roleName", width: "20%" },
                { Header: "Device ID", accessor: "device_id", width: "20%" },
                { Header: "State", accessor: "state", width: "20%" },
                { Header: "Option", accessor: "option", width: "20%" },
                { Header: "Actions", accessor: "actions", width: "20%" },
              ],
              rows: devices
                ? devices.map((device) => ({
                    ...device,
                    option: (
                      <Switch
                        key={device.device_id}
                        checked={device.state === "enabled"}
                        onChange={() => handleSwitchChange(device.device_id, device.state)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    ),
                    actions: (
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(device.device_id)}
                        disabled={deleteDeviceMutation.isLoading}
                      >
                        {deleteDeviceMutation.isLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    ),
                  }))
                : [],
            }}
          />
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default DeviceTable;
