/* eslint-disable react/prop-types */
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button, Box } from "@mui/material";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";

function generateDownload(canvas, crop, savesProfile) {
  if (!crop || !canvas) {
    return;
  }
  canvas.toBlob(
    (blob) => {
      const croppedImage = new File([blob], "cropPreview.png", {
        type: "image/png",
        lastModified: Date.now(),
      });

      // Call the provided callback function to save the cropped image
      if (savesProfile) {
        savesProfile(croppedImage);
      }
    },
    "image/png",
    1
  );
}
function setCanvasImage(image, canvas, crop) {
  if (!crop || !canvas || !image) {
    return;
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const ctx = canvas.getContext("2d");
  // refer https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
  const pixelRatio = window.devicePixelRatio;

  canvas.width = crop.width * pixelRatio * scaleX;
  canvas.height = crop.height * pixelRatio * scaleY;

  // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );
}

function FileUploadButton({ name, formData, setFormData }) {
  const fileInputRef = useRef(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;

    if (name === "ProfilePicture") {
      onSelectFile(event);
    } else {
      setFormData({
        ...formData,
        [name]: selectedFiles,
      });
    }
  };

  const savesProfile = (selectedFile) => {
    setFormData({
      ...formData,
      [name]: selectedFile,
    });
  };

  const [upImg, setUpImg] = useState();

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [crop, setCrop] = useState({ unit: "px", width: 132.28, height: 170.08, aspect: 1.6 });
  const [completedCrop, setCompletedCrop] = useState(null);

  // on selecting file we set load the image on to cropper
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    setCanvasImage(imgRef.current, previewCanvasRef.current, completedCrop);
  }, [completedCrop]);

  return (
    <Box>
      <Button variant="contained" color={"black"} onClick={handleButtonClick}>
        Upload {name}
      </Button>
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileChange}
        multiple={name === "RelatedDocuments"}
        ref={fileInputRef}
        style={{
          display: "none", // Hide the input element
        }}
      />
      {name === "ProfilePicture" && (
        <MDBox display="flex">
          <ReactCrop
            src={upImg}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          />
          <MDBox>
            <canvas
              ref={previewCanvasRef}
              // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
              style={{
                width: Math.round(completedCrop?.width ?? 0),
                height: Math.round(completedCrop?.height ?? 0),
              }}
            />
          </MDBox>
          <MDButton
            type="button"
            disabled={!completedCrop?.width || !completedCrop?.height}
            onClick={() => generateDownload(previewCanvasRef.current, completedCrop, savesProfile)}
          >
            set cropped image as Profile
          </MDButton>
        </MDBox>
      )}
    </Box>
  );
}

export default FileUploadButton;
