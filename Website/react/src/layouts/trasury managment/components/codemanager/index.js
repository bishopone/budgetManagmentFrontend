// ContigencyCodeTable.js
import React, { useState, useEffect } from "react";
import DataTable from "examples/Tables/DataTable";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import api from "api";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";

const ContigencyCodeTable = () => {
  const [contigencyCodes, setContigencyCodes] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", type: "" });
  const [latestBalance, setLatestBalance] = useState([]);
  const [previousData, setPreviousData] = useState(null);
  const permissions = JSON.parse(localStorage.getItem("permission")) ?? [];
  const ContengencyCreate = permissions.includes("ContengencyCreate");

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/contigency-code",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
        formData
      );
      // Refresh the data after creation
      fetchData();
      // Close the dialog
      setOpenCreateDialog(false);
    } catch (error) {
      console.error("Error creating contigency code:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/contigency-code/edit/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
        formData
      );
      // Refresh the data after edit
      fetchData();
      // Close the dialog
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error editing contigency code:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleOpenEdit = (e) => {
    setOpenEditDialog(true);
    setFormData(e);
  };
  function getEventSourceUrl() {
    const token = localStorage.getItem("token");
    return `${process.env.REACT_APP_API_BASE_URL}/treasury/total-balance?token=${token}`;
  }
  useEffect(() => {
    fetchData();
    const eventSource = new EventSource(getEventSourceUrl());
    eventSource.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (JSON.stringify(data) !== JSON.stringify(previousData)) {
        setLatestBalance(data);
        setPreviousData(data);
        fetchData();
      }
    };

    eventSource.onerror = (error) => {
      // setLatestBalance("Connecting ....");
      console.error("SSE error:", error);
    };

    return () => {
      // Cleanup the EventSource when the component unmounts
      eventSource.close();
    };
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("contigency-code/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const contigencyarray = [];
      response.data.forEach((x) => {
        const transformedUser = {
          ...x,
          latestamount: latestBalance,
          actions: (
            <>
              {ContengencyCreate ? (
                <IconButton color="success" onClick={() => handleOpenEdit(x)}>
                  <Icon>edit</Icon>
                </IconButton>
              ) : null}
              {ContengencyCreate ? (
                <IconButton color="primary" onClick={() => handleDelete(x.id)}>
                  <Icon>delete</Icon>
                </IconButton>
              ) : null}
            </>
          ),
        };

        // Push the transformed object to the contigencyarray array
        contigencyarray.push(transformedUser);
      });
      console.log("contigencyarray", contigencyarray);
      setContigencyCodes(contigencyarray);
    } catch (error) {
      console.error("Error fetching contigency codes:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/contigency-code/delete/${id.replaceAll("/", "-")}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the data after deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting contigency code:", error);
    }
  };

  return (
    <MDBox
      // pt={2}
      // px={2}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="start"
    >
      {ContengencyCreate ? (
        <MDButton
          color="white"
          bgColor="info"
          borderRadius="lg"
          shadow="lg"
          opacity={1}
          px={10}
          py={5}
          onClick={() => setOpenCreateDialog(true)}
        >
          Create
        </MDButton>
      ) : null}
      <DataTable
        table={{
          columns: [
            { Header: "ID", accessor: "id", width: "10%" },
            { Header: "Name", accessor: "name", width: "30%" },
            { Header: "Type", accessor: "type", width: "20%" },
            { Header: "Initial Amount", accessor: "amount", width: "15%" },
            { Header: "Amount", accessor: "latestamount", width: "15%" },
            { Header: "Actions", accessor: "actions", width: "30%" },
          ],
          rows: [
            ...contigencyCodes.map((x) => ({
              ...x,
              latestamount:
                latestBalance?.filter((y) => y.contigency_id === x.id)[0]?.total_balance ?? "0",
            })),
          ],
        }}
      />
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Create Contigency Code</DialogTitle>
        <DialogContent>
          <TextField
            label="Id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {/* Define options for the dropdown */}
            <MenuItem value="capital">Capital</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpenCreateDialog(false)} color="primary">
            Cancel
          </MDButton>
          <MDButton onClick={handleCreate} color="primary">
            Create
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Contigency Code</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {/* Define options for the dropdown */}
            <MenuItem value="CAPITAL">Capital</MenuItem>
            <MenuItem value="RECURRENT">Normal</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </MDButton>
          <MDButton onClick={() => handleEdit(formData.id)} color="primary">
            Save
          </MDButton>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
};

export default ContigencyCodeTable;
