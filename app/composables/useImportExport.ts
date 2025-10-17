import { useAuth } from "#imports";
import JSZip from "jszip";

interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
}

export const useImportExport = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();

  /**
   * Upload file directly to S3 using pre-signed URL
   * Extracts content-type from URL and includes it in the request
   */
  const uploadToS3 = async (
    uploadUrl: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Extract content-type from URL query parameters
      let contentType = file.type || "application/zip";
      try {
        const url = new URL(uploadUrl);
        const contentTypeParam = url.searchParams.get("content-type");
        if (contentTypeParam) {
          contentType = contentTypeParam;
        }
      } catch (e) {
        console.warn("Failed to parse content-type from URL", e);
      }

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded * 100) / event.total);
          onProgress({
            progress,
            loaded: event.loaded,
            total: event.total,
          });
        }
      });

      // Handle successful upload
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(
            new Error(
              `S3 upload failed with status ${xhr.status}: ${xhr.responseText}`
            )
          );
        }
      });

      // Handle errors
      xhr.addEventListener("error", () =>
        reject(new Error("Network error during S3 upload"))
      );
      xhr.addEventListener("abort", () =>
        reject(new Error("S3 upload aborted"))
      );

      // Configure request
      xhr.open("PUT", uploadUrl, true);
      
      // IMPORTANT: Set Content-Type header to match what's in the URL
      xhr.setRequestHeader("Content-Type", contentType);

      xhr.send(file);
    });
  };

  /**
   * Import file - uploads zip to S3 and triggers backend processing
   */
  const importFile = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      // Step 1: Get pre-signed upload URL from backend
      const res: any = await $fetch(
        `${config.public.API_BASE_URL}api/lms/import/upload-url/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const uploadUrl = res?.upload_url;

      if (!uploadUrl) {
        return { error: "Failed to get upload URL", data: null };
      }

      // Step 2: Upload file directly to S3 using pre-signed URL
      await uploadToS3(uploadUrl, file, onProgress);

      // Step 3: Construct the full S3 URL from the upload URL
      // Extract the S3 URL without query parameters
      const s3Url = uploadUrl.split("?")[0];

      // Step 4: Notify backend that upload is complete (trigger processing)
      try {
        const importRes = await $fetch(
          `${config.public.API_BASE_URL}api/lms/import/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              zip_url: s3Url,
            }),
            credentials: "include",
          }
        );

        return { data: importRes, error: null };
      } catch (error: any) {
        return {
          error: error?.data?.error || "Failed to process import",
          data: null,
        };
      }
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to upload file",
        data: null,
      };
    }
  };

  /**
   * Export data
   */
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