/* eslint-disable react/prop-types */
import React, { useCallback, useRef } from "react";
import { Modal, Button, Grid } from "@mui/material";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from "react-flow-renderer";
import "react-flow-renderer/dist/style.css";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DownloadButton from "./downloadbutton";
import { ReactFlowProvider } from "reactflow";
import ErrorComponent from "examples/Error";
import CircularProgress from "@mui/material/CircularProgress";
import { useBudgetHistory } from "./api";
import ImgMediaCard from "./ImgMediaCard";

const nodeTypes = {
  ImgMediaCard: ImgMediaCard,
};

const HorizontalFlow = ({ id }) => {
  const { data, isLoading, isError, error } = useBudgetHistory(id);
  const [nodes, _, onNodesChange] = useNodesState([...data?.nodes] || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState([...data?.edges] || []);
  const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

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
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-left"
        className="download-image"
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={2} size={1} />
        <DownloadButton />
      </ReactFlow>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const FlowModal = ({ setIsOpen, isOpen, handleClose, id }) => {
  console.log("id: ", id);
  const flowRef = useRef();
  return (
    <MDBox>
      <Modal open={isOpen} onClose={handleClose}>
        <MDBox width="90%" height="90%">
          <MDBox display="flex" justifyContent="space-between">
            <MDButton onClick={handleClose}>Close Modal</MDButton>
            <MDButton onClick={handleClose}>download Image</MDButton>
          </MDBox>
          <ReactFlowProvider>
            <HorizontalFlow id={id} ref={flowRef} />
          </ReactFlowProvider>
        </MDBox>
      </Modal>
    </MDBox>
  );
};

export default FlowModal;
