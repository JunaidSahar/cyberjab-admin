export const useLesson = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();

  // Get all lessons with pagination and filters
  const getLessons = async (
    page: number = 1,
    pageSize: number = 10,
    moduleSlug: string
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
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/lms/modules/${moduleSlug}/lessons/`,
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
      console.error("Error fetching lessons:", error);
      return {
        error: error?.data?.error || error?.message || "Failed to fetch lessons",
        data: null,
      };
    }
  };

  //create a new lesson
  const createLesson = async (lessonData: any, moduleSlug: string) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      console.log("Creating lesson with data:", lessonData);
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/lms/modules/${moduleSlug}/lessons/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: lessonData,
          credentials: "include",
        }
      );
      console.log("Lesson created successfully:", res);
      return { data: res, error: null };
    } catch (error: any) {
      console.error("Error creating lesson:", error);
      return {
        error: error?.data?.error || error?.message || "Failed to create lesson",
        data: null,
      };
    }
  };

  //update lesson by slug
  const updateLesson = async (moduleSlug: string, lessonSlug: string, lessonData: any) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      console.log(`Updating lesson ${lessonSlug} in module ${moduleSlug} with data:`, lessonData);
      
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/lms/modules/${moduleSlug}/lessons/${lessonSlug}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: lessonData,
          credentials: "include",
        }
      );
      console.log("Lesson updated successfully:", res);
      return { data: res, error: null };
    } catch (error: any) {
      console.error("Error updating lesson:", error);
      console.error("Error details:", {
        status: error?.status,
        statusText: error?.statusText,
        data: error?.data,
      });
      
      return {
        error: error?.data?.error || error?.data?.detail || error?.message || "Failed to update lesson",
        data: null,
      };
    }
  };

  const deleteLesson = async (moduleSlug: string, lessonSlug: string) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      console.log(`Deleting lesson: ${lessonSlug} from module: ${moduleSlug}`);
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/lms/modules/${moduleSlug}/lessons/${lessonSlug}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      console.log("Lesson deleted successfully");
      return { data: res, error: null };
    } catch (error: any) {
      console.error("Error deleting lesson:", error);
      return {
        error: error?.data?.error || error?.message || "Failed to delete lesson",
        data: null,
      };
    }
  };

  return {
    getLessons,
    createLesson,
    updateLesson,
    deleteLesson,
  };
};