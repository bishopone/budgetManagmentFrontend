/* eslint-disable react/prop-types */
import React from "react";
import LazyLoad from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; // Import the blur CSS effect

function LazyImage({ src, alt }) {
  return (
    <LazyLoad
      effect="blur" // Use the "blur" effect for the transition
      width="100%"
      height="100%"
      visibleByDefault={false} // Start with a placeholder
    >
      {(src) => (
        <img
          src={src}
          alt={alt}
          style={{ filter: "blur(20px)", transition: "filter 0.5s" }} // Add blur to the placeholder
          className="lazy-load-image" // Add your custom styling here
        />
      )}
    </LazyLoad>
  );
}

export default LazyImage;
