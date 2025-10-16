import { useAuth } from "#imports";
import JSZip from "jszip";

export const useImportExport = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();
  const importFile = async (file: File) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    // api/lms/import/upload-url/
    try {
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/lms/import/upload-url/`,
        {
          method: "POST",
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
        error: error?.data?.error || "Failed to fetch upload URL",
        data: null,
      };
    }
  };

  const exportData = async () => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(`${config.public.API_BASE_URL}api/lms/export/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      return { data: res, error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to export data",
        data: null,
      };
    }
  };

  return { importFile, exportData };
};
