import React, { useState, useEffect } from "react";
import api from "../../api.js";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const PermissionManager = () => {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState({ RoleID: "", Action: "" });

  useEffect(() => {
    // Fetch permissions from the backend when the component mounts
    api
      .get("/api/permissions")
      .then((response) => {
        setPermissions(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleCreatePermission = () => {
    // Implement the logic to create a new permission
    api
      .post("/api/permissions", newPermission)
      .then((response) => {
        setPermissions([...permissions, response.data]);
        setNewPermission({ RoleID: "", Action: "" });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeletePermission = (permissionID) => {
    // Implement the logic to delete a permission
    api
      .delete(`/api/permissions/${permissionID}`)
      .then(() => {
        const updatedPermissions = permissions.filter((perm) => perm.PermissionID !== permissionID);
        setPermissions(updatedPermissions);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div>
        <h2>Permission Manager</h2>
        <ul>
          {permissions.map((permission) => (
            <li key={permission.PermissionID}>
              {permission.RoleID} - {permission.Action}
              <button onClick={() => handleDeletePermission(permission.PermissionID)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div>
          <input
            type="text"
            placeholder="RoleID"
            value={newPermission.RoleID}
            onChange={(e) => setNewPermission({ ...newPermission, RoleID: e.target.value })}
          />
          <input
            type="text"
            placeholder="Action"
            value={newPermission.Action}
            onChange={(e) => setNewPermission({ ...newPermission, Action: e.target.value })}
          />
          <button onClick={handleCreatePermission}>Create Permission</button>
        </div>
      </div>

      <Footer />
    </DashboardLayout>
  );
};

export default PermissionManager;
