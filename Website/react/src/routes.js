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
import Users from "layouts/users";
import NormalRequests from "layouts/request/normal request";
import CapitalRequests from "layouts/request/capital request";
import CapitalOwnRequests from "layouts/request/capital other request";
import TreasuryRequests from "layouts/request/treasury request";
import TreasuryManagment from "layouts/trasury managment/index";
import App from "layouts/ordering";
import Permission from "layouts/permissions";
import Departments from "layouts/departments";
import Devices from "layouts/devices";
import RequiredDocuments from "layouts/required documents";
import Profile from "layouts/profile";
import UserForm from "layouts/users/components/userform";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
import Language from "layouts/language";

const isAuthenticated = localStorage.getItem("token");
const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    permission: "AccessDashboard",
  },
  {
    type: "collapse",
    name: "Language",
    key: "language",
    icon: <Icon fontSize="small">language</Icon>,
    route: "/language",
    component: <Language />,
    permission: "AccessLanguage",
  },
  {
    type: "collapse",
    name: "Recurrent Budget",
    key: "recurrent",
    typename: "Recurrent Budget",
    icon: <Icon fontSize="small">paid</Icon>,
    route: "/recurrent",
    component: <NormalRequests budgettype="1" />,
    permission: "AccessRecurrent",
  },
  {
    type: "collapse",
    name: "Capital Budget",
    key: "capital",
    typename: "Capital Own Budget",
    icon: <Icon fontSize="small">location_city</Icon>,
    route: "/capital",
    component: <CapitalRequests budgettype="2" />,
    permission: "AccessCapital",
  },
  {
    type: "collapse",
    name: "Capital Other Budget",
    key: "other-capital",
    typename: "Capital Other Budget",
    icon: <Icon fontSize="small">domain_add</Icon>,
    route: "/other-capital",
    component: <CapitalOwnRequests budgettype="5" />,
    permission: "AccessCapitalOther",
  },
  {
    type: "collapse",
    name: "Contingency Budget",
    typename: "Contingency Budget",
    key: "contingency",
    icon: <Icon fontSize="small">account_balance</Icon>,
    route: "/contingency",
    component: <TreasuryRequests budgettype="3" />,
    permission: "AccessContingency",
  },
  {
    type: "collapse",
    name: "Analytics",
    key: "analytics",
    icon: <Icon fontSize="small">analytics</Icon>,
    route: "/analytics",
    component: <Analytics />,
    permission: "AccessAnalytics",
  },
  {
    type: "collapse",
    name: "Contingency Managment",
    key: "contingency-managment",
    icon: <Icon fontSize="small">account_balance_wallet</Icon>,
    route: "/contingency-managment",
    component: <TreasuryManagment />,
    permission: "AccessContingencyManagment",
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
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/users",
    component: <Users />,
    permission: "AccessUserManagment",
  },
  {
    type: "collapse",
    name: "Authority",
    key: "authority",
    icon: <Icon fontSize="small">list_alt</Icon>,
    route: "/authority",
    component: <App />,
    permission: "AccessAuthorityManagment",
  },
  {
    type: "collapse",
    name: "Permissions",
    key: "permissions",
    icon: <Icon fontSize="small">shield</Icon>,
    route: "/permissions",
    component: <Permission />,
    permission: "AccessPermissionManagment",
  },
  {
    type: "collapse",
    name: "Departments",
    key: "departments",
    icon: <Icon fontSize="small">grading</Icon>,
    route: "/departments",
    component: <Departments />,
    permission: "AccessDepartmentsManagment",
  },
  {
    type: "collapse",
    name: "Devices",
    key: "devices",
    icon: <Icon fontSize="small">devices</Icon>,
    route: "/devices",
    component: <Devices />,
    permission: "devicesManagment",
  },
  {
    type: "collapse",
    name: "RequiredDocuments",
    key: "requiredDocuments",
    icon: <Icon fontSize="small">document_scanner</Icon>,
    route: "/requiredDocuments",
    component: <RequiredDocuments />,
    permission: "requiredDocuments",
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    permission: "AccessProfile",
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    icon: <Icon fontSize="small">{isAuthenticated ? "logout" : "login"}</Icon>,
    route: "/sign-in",
    component: <SignIn />,
    permission: "Accesslogout",
  },
];

export default routes;
