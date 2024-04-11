// api.js
import api from "api";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Fetch all roles
const getRoles = async () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const response = await api.get(`/roles`, { headers });
  return response.data;
};

// Fetch permissions for a specific role
const getPermissionsByRole = async (roleId) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const response = await api.get(`/roles/${roleId}/permissions`, { headers });
  return response.data;
};

// Update permissions for a role
const updateRolePermissions = async (roleId, permissions, ispresent) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (ispresent) {
    const response = await api.delete(`/roles/${roleId}/permissions/${permissions}`, { headers });
    return response.data;
  }
  const response = await api.put(`/roles/${roleId}/permissions`, { permissions }, { headers });
  return response.data;
};
const getPermissions = async () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const response = await api.get(`/permissions`, { headers });
  return response.data;
};
const addPermission = async (permissionData) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await api.post("/permissions", permissionData, { headers });
    return response.data;
  } catch (error) {
    throw new Error(`Error adding permission: ${error.message}`);
  }
};

export const usePermissions = () => {
  return useQuery("permissions", getPermissions);
};
export const useRoles = () => {
  return useQuery("roles", getRoles);
};

export const usePermissionsByRole = (roleId) => {
  return useQuery(["permissions", roleId], () => getPermissionsByRole(roleId), {
    enabled: !!roleId,
  });
};
export const useAddPermission = () => {
  const queryClient = useQueryClient();

  return useMutation((permissionData) => addPermission(permissionData), {
    onSuccess: () => {
      // Invalidate and refetch the permissions query after a successful addition
      queryClient.invalidateQueries("permissions");
    },
  });
};
export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ roleId, permissions, ispresent }) => updateRolePermissions(roleId, permissions, ispresent),
    {
      onSuccess: () => {
        // Invalidate and refetch the roles and permissions queries after a successful update
        queryClient.invalidateQueries("roles");
        queryClient.invalidateQueries("permissions");
      },
    }
  );
};
const addRole = async (roleData) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await api.post("/roles", roleData, { headers });
    return response.data;
  } catch (error) {
    throw new Error(`Error adding role: ${error.message}`);
  }
};

export const useAddRole = () => {
  const queryClient = useQueryClient();

  return useMutation((roleData) => addRole(roleData), {
    onSuccess: () => {
      // Invalidate and refetch the roles query after a successful addition
      queryClient.invalidateQueries("roles");
    },
  });
};

const deletePermission = async (permissionId) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await api.delete(`/permissions/${permissionId}`, { headers });
  return response.data;
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation((permissionId) => deletePermission(permissionId), {
    onSuccess: () => {
      // Invalidate and refetch the permissions query after a successful deletion
      queryClient.invalidateQueries("permissions");
    },
  });
};

// Delete a role
const deleteRole = async (roleId) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await api.delete(`/roles/${roleId}`, { headers });
  return response.data;
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation((roleId) => deleteRole(roleId), {
    onSuccess: () => {
      // Invalidate and refetch the roles query after a successful deletion
      queryClient.invalidateQueries("roles");
    },
  });
};
