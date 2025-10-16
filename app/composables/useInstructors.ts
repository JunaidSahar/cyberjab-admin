import { useAuth } from "#imports";

export const useInstructors = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();

  // Get all instructors with pagination and filters
  const getInstructors = async (
    page: number = 1,
    pageSize: number = 10,
    filters: any = {}
  ) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const queryParams: any = {
        page,
        page_size: pageSize,
      };

      // Add optional filters
      if (filters.search) queryParams.search = filters.search;
      if (filters.is_active !== undefined)
        queryParams.is_active = filters.is_active;
      if (filters.ordering) queryParams.ordering = filters.ordering;

      const res = await $fetch(
        `${config.public.API_BASE_URL}api/instructors/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          query: queryParams,
          credentials: "include",
        }
      );
      return { data: res, error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to fetch instructors",
        data: null,
      };
    }
  };

  // Get recently created instructors (last 5)
  const getRecentInstructors = async () => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/instructors/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          query: {
            page: 1,
            page_size: 5,
            ordering: "-created_at", // Order by creation date, newest first
          },
          credentials: "include",
        }
      );
      return { data: res, error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to fetch recent instructors",
        data: null,
      };
    }
  };

  // Get a single instructor by slug
  const getInstructor = async (instructorSlug: string) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/instructors/${instructorSlug}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      return { data: res, error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to fetch instructor",
        data: null,
      };
    }
  };

  // Search instructors by name
  const searchInstructorsByName = async (
    name: string,
    page: number = 1,
    pageSize: number = 10
  ) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/instructors/search_by_name/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          query: {
            name,
            page,
            page_size: pageSize,
          },
          credentials: "include",
        }
      );
      return { data: res, error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to search instructors",
        data: null,
      };
    }
  };

  // Create a new instructor
  const createInstructor = async (instructorData: any) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      // Check if we have a file to upload
      const hasFile = instructorData.profile_image instanceof File;

      let body;
      let headers: any = {
        Authorization: `Bearer ${token}`,
      };

      if (hasFile) {
        // Use FormData for file uploads
        const formData = new FormData();
        Object.keys(instructorData).forEach((key) => {
          if (
            instructorData[key] !== null &&
            instructorData[key] !== undefined
          ) {
            formData.append(key, instructorData[key]);
          }
        });
        body = formData;
        // Don't set Content-Type header, let browser set it for FormData
      } else {
        // Use JSON for regular data
        headers["Content-Type"] = "application/json";
        body = instructorData;
      }

      const res = await $fetch(
        `${config.public.API_BASE_URL}api/instructors/`,
        {
          method: "POST",
          headers,
          body,
          credentials: "include",
        }
      );
      return { data: res, error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to create instructor",
        data: null,
      };
    }
  };

  // Update an existing instructor
  const updateInstructor = async (
    instructorSlug: string,
    instructorData: any
  ) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      // Check if we have a file to upload
      const hasFile = instructorData.profile_image instanceof File;

      let body;
      let headers: any = {
        Authorization: `Bearer ${token}`,
      };

      if (hasFile) {
        // Use FormData for file uploads
        const formData = new FormData();
        Object.keys(instructorData).forEach((key) => {
          if (
            instructorData[key] !== null &&
            instructorData[key] !== undefined
          ) {
            formData.append(key, instructorData[key]);
          }
        });
        body = formData;
        // Don't set Content-Type header, let browser set it for FormData
      } else {
        // Use JSON for regular data
        headers["Content-Type"] = "application/json";
        body = instructorData;
      }

      const res = await $fetch(
        `${config.public.API_BASE_URL}api/instructors/${instructorSlug}/`,
        {
          method: "PUT",
          headers,
          body,
          credentials: "include",
        }
      );
      return { data: res, error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to update instructor",
        data: null,
      };
    }
  };

  // Delete an instructor
  const deleteInstructor = async (instructorSlug: string) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      await $fetch(
        `${config.public.API_BASE_URL}api/instructors/${instructorSlug}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      return { data: "Instructor deleted successfully", error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to delete instructor",
        data: null,
      };
    }
  };

  // Bulk delete instructors
  const bulkDeleteInstructors = async (instructorIds: number[]) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/instructors/bulk_delete/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: { ids: instructorIds },
          credentials: "include",
        }
      );
      return { data: res, error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to delete instructors",
        data: null,
      };
    }
  };

  // Toggle instructor status
  const toggleInstructorStatus = async (
    instructorSlug: string,
    isActive: boolean
  ) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/instructors/${instructorSlug}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: { is_active: isActive },
          credentials: "include",
        }
      );
      return { data: res, error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to toggle instructor status",
        data: null,
      };
    }
  };

  return {
    getInstructors,
    getRecentInstructors,
    getInstructor,
    searchInstructorsByName,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    bulkDeleteInstructors,
    toggleInstructorStatus,
  };
};
