/* eslint-disable react/prop-types */
// ErrorComponent.js
// ErrorComponent.js

import React from "react";

const ErrorComponent = ({ error }) => {
  const getErrorMessage = () => {
    console.log(error);
    if (error.message.includes("401")) {
      return "Unauthorized. Please sign in again.";
    } else if (error.message.includes("403")) {
      return "Forbidden. You Dont Have The Right To Access This Part.";
    } else if (error.message.includes("Network Error")) {
      return "Network error. Please check your internet connection.";
    } else {
      return "Loading dashboard data failed. Please try again later.";
    }
  };

  return (
    <div>
      <p>{getErrorMessage()}</p>
    </div>
  );
};

export default ErrorComponent;
