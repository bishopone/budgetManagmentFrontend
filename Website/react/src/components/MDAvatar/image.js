/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

function CustomHeaderImage({ imageUrl, token }) {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    // Set custom headers in the fetch request
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);

    // Fetch the image with custom headers
    fetch(imageUrl, {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Image not found or not authorized");
        }
      })
      .then((blob) => {
        const objectURL = URL.createObjectURL(blob);
        setImageSrc(objectURL); // Set the image source once the blob is received
      })
      .catch((error) => {
        console.error(error);
        // Handle errors or show a placeholder image
      });
  }, [imageUrl, token]);

  return <img src={imageSrc} alt="Custom Header Image" />;
}

export default CustomHeaderImage;
