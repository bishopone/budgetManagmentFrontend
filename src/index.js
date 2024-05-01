/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "App";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import { QueryClient, QueryClientProvider } from "react-query";

const container = document.getElementById("app");
const root = createRoot(container);

const queryClient = new QueryClient();

root.render(
  <I18nextProvider i18n={i18n}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <MaterialUIControllerProvider>
          <App />
        </MaterialUIControllerProvider>
      </Router>
    </QueryClientProvider>
  </I18nextProvider>
);
