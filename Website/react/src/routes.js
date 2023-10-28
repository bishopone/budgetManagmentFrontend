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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Analytics from "layouts/analytics";
import Documents from "layouts/documents";
import Users from "layouts/users";
import Requests from "layouts/requests";
import App from "layouts/ordering";
import Permission from "layouts/permissions";
import Search from "layouts/search";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import Details from "layouts/details";
import Share from "layouts/share";
import UserForm from "layouts/users/components/userform";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
const isAuthenticated = localStorage.getItem("token");
const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Normal Budget",
    key: "normal",
    icon: <Icon fontSize="small">paid</Icon>,
    route: "/normal",
    component: <Requests />,
  },
  {
    type: "collapse",
    name: "Capital Budget",
    key: "capital",
    icon: <Icon fontSize="small">location_city</Icon>,
    route: "/capital",
    component: <Requests />,
  },
  {
    type: "collapse",
    name: "Internal Budget",
    key: "internal",
    icon: <Icon fontSize="small">wallet</Icon>,
    route: "/internal",
    component: <Requests />,
  },
  {
    type: "collapse",
    name: "Treasury Budget",
    key: "treasury",
    icon: <Icon fontSize="small">account_balance</Icon>,
    route: "/treasury",
    component: <Requests />,
  },
  {
    type: "internal",
    name: "User Create",
    key: "usercreate",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/users/create",
    component: <UserForm />,
  },
  {
    type: "collapse",
    name: "User Managment",
    key: "users",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/users",
    component: <Users />,
  },
  {
    type: "collapse",
    name: "Authority Managment",
    key: "authority",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/authority",
    component: <App />,
  },
  {
    type: "collapse",
    name: "Permission Managment",
    key: "permissions",
    icon: <Icon fontSize="small">shield</Icon>,
    route: "/permissions",
    component: <Permission />,
  },
  // {
  //   type: "collapse",
  //   name: "Analytics",
  //   key: "analytics",
  //   icon: <Icon fontSize="small">auto_graph</Icon>,
  //   route: "/analytics",
  //   component: <Analytics />,
  // },
  // {
  //   type: "collapse",
  //   name: "Documents",
  //   key: "documents",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/documents",
  //   component: <Documents />,
  // },
  // {
  //   type: "internal",
  //   name: "Documents",
  //   key: "documents",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/documents/search",
  //   component: <Search />,
  // },
  // {
  //   type: "internal",
  //   name: "Details",
  //   key: "details",
  //   icon: <Icon fontSize="small">details</Icon>,
  //   route: "/documents/search/:id",
  //   component: <Details />,
  // },
  // {
  //   type: "internal",
  //   name: "Details",
  //   key: "details",
  //   icon: <Icon fontSize="small">share</Icon>,
  //   route: "/share/:id/:password",
  //   component: <Share />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "logout",
    key: "logout",
    icon: <Icon fontSize="small">{isAuthenticated ? "logout" : "login"}</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

export default routes;
