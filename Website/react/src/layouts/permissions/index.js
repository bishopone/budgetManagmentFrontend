// PermissionManager.js
import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import {
  useRoles,
  usePermissionsByRole,
  useUpdateRolePermissions,
  usePermissions,
  useAddPermission,
  useAddRole,
  useDeletePermission,
  useDeleteRole,
} from "./api";
import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ErrorComponent from "examples/Error";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const PermissionManager = () => {
  const updateRolePermissions = useUpdateRolePermissions();
  const addPermissionMutation = useAddPermission();
  const addRoleMutation = useAddRole();
  const deletePermissionMutation = useDeletePermission(); // New mutation for deleting permissions
  const deleteRoleMutation = useDeleteRole(); // New mutation for deleting roles
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRoleModalOpen, setRoleModalOpen] = useState(false);
  const [newPermissionName, setNewPermissionName] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const {
    data: roles,
    isLoading: rolesLoading,
    isError: isrolesError,
    error: rolesError,
  } = useRoles();
  const {
    data: rolePermissions,
    isLoading: permissionsLoading,
    isError: ispermissionsError,
    error: permissionsError,
  } = usePermissionsByRole(selectedRole);
  const {
    data: allPermissions,
    isLoading: allPermissionsLoading,
    isError: isallPermissionsError,
    error: allPermissionsError,
  } = usePermissions();

  const handleDeletePermission = async (permissionId) => {
    try {
      if (window.confirm("are you sure you want to delete this permission!!")) {
        await deletePermissionMutation.mutateAsync(permissionId);
      }
    } catch (error) {
      console.error("Error deleting permission:", error.message);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      if (window.confirm("are you sure you want to delete this Role!!")) {
        await deleteRoleMutation.mutateAsync(roleId);
      }
    } catch (error) {
      console.error("Error deleting role:", error.message);
    }
  };

  const handleAddRole = async () => {
    try {
      // You may need to provide the necessary role data here
      await addRoleMutation.mutateAsync({
        roleName: newRoleName,
      });
      handleRoleModalClose();
    } catch (error) {
      // Handle the specific error case if needed
      console.error("Error adding role:", error.message);
    }
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNewPermissionName(""); // Clear the input field when the modal is closed
  };
  const handleRoleModalClose = () => {
    setRoleModalOpen(false);
    setNewRoleName(""); // Clear the input field when the modal is closed
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleRoleModalOpen = () => {
    setRoleModalOpen(true);
  };

  const handleAddPermission = async () => {
    try {
      await addPermissionMutation.mutateAsync({
        permissionName: newPermissionName.trimEnd(),
      });
      handleModalClose();
    } catch (error) {
      // Handle the specific error case if needed
      console.error("Error adding permission:", error.message);
    }
  };

  const handleRoleClick = (roleId) => {
    setSelectedRole(roleId);
  };

  const handlePermissionToggle = (permissionId) => {
    if (!rolePermissions || !allPermissions) {
      return; // Data not loaded yet, do nothing
    }
    const ispresent =
      rolePermissions?.some((rolePermission) => rolePermission.permissionID === permissionId) ??
      false;
    updateRolePermissions.mutate({
      roleId: selectedRole,
      permissions: permissionId,
      ispresent: ispresent,
    });
  };

  if (rolesLoading || permissionsLoading || allPermissionsLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
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
      </DashboardLayout>
    );
  }

  if (isrolesError || ispermissionsError || isallPermissionsError) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <ErrorComponent error={rolesError || permissionsError || allPermissionsError} />
          </Grid>
        </Grid>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox display="flex" justifyContent="space-between">
          <MDTypography variant="h1">Roles</MDTypography>
          <MDButton onClick={handleRoleModalOpen}>Add Role</MDButton>
        </MDBox>
        {roles && (
          <Grid container spacing={3}>
            {roles.map((role) => (
              <Grid item key={role.roleID} xs={6} md={3} lg={2}>
                <MDButton
                  color={role.roleID === selectedRole ? "success" : "secondary"}
                  onClick={() => handleRoleClick(role.roleID)}
                >
                  {role.roleName}
                </MDButton>
                <MDButton onClick={() => handleDeleteRole(role.roleID)}>Delete</MDButton>
              </Grid>
            ))}
          </Grid>
        )}
        {/* Display permissions for the selected role */}
        <MDBox py={3}>
          <MDTypography variant="h1">Permissions</MDTypography>
          {permissionsLoading || allPermissionsLoading ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <Grid container spacing={3}>
              {allPermissions.map((permission) => (
                <Grid item key={permission.permissionID} xs={6} md={4} lg={3}>
                  <MDButton
                    style={{ width: "250px" }}
                    size={"medium"}
                    color={
                      rolePermissions?.some(
                        (rolePermission) => rolePermission.permissionID === permission.permissionID
                      )
                        ? "success"
                        : "light"
                    }
                    onClick={() => handlePermissionToggle(permission.permissionID)}
                  >
                    {permission.permissionName}
                  </MDButton>
                  <IconButton onClick={() => handleDeletePermission(permission.permissionID)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          )}
        </MDBox>
        <MDButton onClick={handleModalOpen}>Add Permission</MDButton>

        {/* Modal for adding a new permission */}
        <Dialog maxWidth={false} open={isModalOpen} onClose={handleModalClose}>
          <DialogTitle>Create A New Permisssion</DialogTitle>
          <DialogContent>
            <MDBox>
              <TextField
                label="Permission Name"
                variant="outlined"
                value={newPermissionName}
                onChange={(e) => setNewPermissionName(e.target.value)}
              />
              <MDButton onClick={handleAddPermission}>Add</MDButton>
            </MDBox>
          </DialogContent>
        </Dialog>
        <Dialog maxWidth={false} open={isRoleModalOpen} onClose={handleRoleModalClose}>
          <DialogTitle>Create A New Role</DialogTitle>
          <DialogContent>
            <MDBox>
              <TextField
                label="Role Name"
                variant="outlined"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
              <MDButton onClick={handleAddRole}>Add</MDButton>
            </MDBox>
          </DialogContent>
        </Dialog>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default PermissionManager;
