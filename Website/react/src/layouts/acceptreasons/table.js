/* eslint-disable react/prop-types */
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import {
  useRejectReasons,
  useDeleteRejectReason,
  useUpdateRejectReason,
  useCreateRejectReason,
} from "./api";
import { CircularProgress, Grid, MenuItem } from "@mui/material";
import ErrorComponent from "examples/Error";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormHelperText,
} from "@mui/material";

const valueOptions = [
  { value: "1", label: "Recurrent Budget" },
  { value: "2", label: "Capital Own Budget" },
  { value: "3", label: "Contingency Budget" },
  { value: "4", label: "Internal Budget" },
  { value: "5", label: "Capital Other Budget" },
];

function EditToolbar() {
  const [open, setOpen] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [inputError, setInputError] = useState(false);
  const createRejectReason = useCreateRejectReason(); // New mutation for deleting permissions
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (!input1 || !input2) {
      setInputError(true);
      return;
    }
    createRejectReason.mutateAsync({ type: input2, reason: input1 });
    setOpen(false);
  };

  return (
    <>
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Record</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
          />
          <TextField
            select
            margin="dense"
            label="Type"
            fullWidth
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            error={inputError && !input2}
          >
            {valueOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {inputError && !input2 && <FormHelperText error>Please select a type</FormHelperText>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rowModesModel, setRowModesModel] = useState({});
  const { data, isLoading, isError, error } = useRejectReasons();
  const deleteRejectReason = useDeleteRejectReason(); // New mutation for deleting permissions
  const updateRejectReason = useUpdateRejectReason(); // New mutation for deleting permissions

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    console.log(id);
    deleteRejectReason.mutate({ rejectReasonID: id });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    updateRejectReason.mutateAsync({
      rejectReasonID: newRow.id,
      reason: newRow.reason,
      type: newRow.type,
    });
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "reason", headerName: "Reason", width: 180, editable: true },
    {
      field: "type",
      headerName: "Type",
      width: 220,
      editable: true,
      type: "singleSelect",
      valueOptions: [
        { value: "1", label: "Reccurent Budget" },
        { value: "2", label: "Capital Own Budget" },
        { value: "3", label: "Contingency Budget" },
        { value: "4", label: "Internal Budget" },
        { value: "5", label: "Capital Other Budget" },
      ],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={id}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  if (isLoading) {
    return (
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
    );
  }

  if (isError) {
    return (
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
    );
  }
  console.log(data);
  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={data}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRowModesModel },
        }}
      />
    </Box>
  );
}
