export const useModules = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();

  // Get all modules with pagination and filters
  const getModules = async (page: number = 1, pageSize: number = 10, filters: any = {}) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const queryParams: any = {
        page,
        page_size: pageSize,
        published: 'all',
      };

      // Add optional filters
      if (filters.search) queryParams.search = filters.search;
      if (filters.published !== undefined && filters.published !== 'all') {
        queryParams.published = filters.published;
      }
      if (filters.ordering) queryParams.ordering = filters.ordering;

      const res = await $fetch(`${config.public.API_BASE_URL}api/lms/modules/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        query: queryParams,
        credentials: "include",
      });
      return { data: res, error: null };
    } catch (error: any) {
      return { error: error?.data?.error || "Failed to fetch modules", data: null };
    }
  };

  // Get recently created modules (last 5)
  const getRecentModules = async () => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(`${config.public.API_BASE_URL}api/lms/modules/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        query: {
          page: 1,
          page_size: 4,
          published: true,
          ordering: "-created_at", // Order by creation date, newest first
        },
        credentials: "include",
      });
      return { data: res, error: null };
    } catch (error: any) {
      return { error: error?.data?.error || "Failed to fetch recent modules", data: null };
    }
  };

  // Get a single module by slug
  const getModule = async (moduleSlug: string) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(`${config.public.API_BASE_URL}api/lms/modules/${moduleSlug}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      return { data: res, error: null };
    } catch (error: any) {
      return { error: error?.data?.error || "Failed to fetch module", data: null };
    }
  };

  // Create a new module
  const createModule = async (moduleData: any) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const hasFile = moduleData.photo instanceof File;
      
      let body;
      let headers: any = {
        Authorization: `Bearer ${token}`,
      };

      if (hasFile) {
        const formData = new FormData();
        Object.keys(moduleData).forEach(key => {
          if (moduleData[key] !== null && moduleData[key] !== undefined) {
            formData.append(key, moduleData[key]);
          }
        });
        body = formData;
      } else {
        headers["Content-Type"] = "application/json";
        body = moduleData;
      }

      const res = await $fetch(`${config.public.API_BASE_URL}api/lms/modules/`, {
        method: "POST",
        headers,
        body,
        credentials: "include",
      });
      return { data: res, error: null };
    } catch (error: any) {
      return { error: error?.data?.error || "Failed to create module", data: null };
    }
  };

  // Update an existing module
  const updateModule = async (moduleSlug: string, moduleData: any) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const hasFile = moduleData.photo instanceof File;
      
      let body;
      let headers: any = {
        Authorization: `Bearer ${token}`,
      };

      if (hasFile) {
        const formData = new FormData();
        Object.keys(moduleData).forEach(key => {
          if (moduleData[key] !== null && moduleData[key] !== undefined) {
            formData.append(key, moduleData[key]);
          }
        });
        body = formData;
      } else {
        headers["Content-Type"] = "application/json";
        body = moduleData;
      }

      const res = await $fetch(`${config.public.API_BASE_URL}api/lms/modules/${moduleSlug}/`, {
        method: "PUT",
        headers,
        body,
        credentials: "include",
      });
      return { data: res, error: null };
    } catch (error: any) {
      return { error: error?.data?.error || "Failed to update module", data: null };
    }
  };

  // Delete a module
  const deleteModule = async (moduleSlug: string) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      await $fetch(`${config.public.API_BASE_URL}api/lms/modules/${moduleSlug}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      return { data: "Module deleted successfully", error: null };
    } catch (error: any) {
      return { error: error?.data?.error || "Failed to delete module", data: null };
    }
  };

  // Toggle module published status
  const toggleModuleStatus = async (moduleSlug: string, published: boolean) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(`${config.public.API_BASE_URL}api/lms/modules/${moduleSlug}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { published },
        credentials: "include",
      });
      return { data: res, error: null };
    } catch (error: any) {
      return { error: error?.data?.error || "Failed to toggle module status", data: null };
    }
  };

  return {
    getModules,
    getRecentModules,
    getModule,
    createModule,
    updateModule,
    deleteModule,
    toggleModuleStatus,
  };
};