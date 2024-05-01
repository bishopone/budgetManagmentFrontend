/* eslint-disable react/prop-types */
import React from "react";
import { Button, CircularProgress, Modal, Backdrop, Fade } from "@mui/material";

const LoadingSpinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <CircularProgress />
  </div>
);

const LoadingModal = ({ isVisible, onClose }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const showLoading = () => {
    onClose();
    setIsLoading(true);

    // Simulate an asynchronous action (e.g., API request) that takes some time
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const hideLoading = () => {
    onClose();
    setIsLoading(false);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isVisible}
      onClose={hideLoading}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isVisible}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <LoadingSpinner />
        </div>
      </Fade>
    </Modal>
  );
};

export default LoadingModal;
