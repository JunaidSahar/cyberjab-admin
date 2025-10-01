export const useLesson = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();

  // Get all lessons with pagination and filters
  const getLessons = async (
    page: number = 1,
    pageSize: number = 10,
    moduleId: string
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
        `${config.public.API_BASE_URL}api/lms/modules/${moduleId}/lessons/`,
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
        error: error?.data?.error || "Failed to fetch modules",
        data: null,
      };
    }
  };

  //create a new lesson
  const createLesson = async (lessonData: any) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/lms/lessons/`,
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
      return { data: res, error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to create lesson",
        data: null,
      };
    }
  };

  //update lesson by slug
  const updateLesson = async (lessonSlug: string, lessonData: any) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/lms/lessons/${lessonSlug}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: lessonData,
          credentials: "include",
        }
      );
      return { data: res, error: null };
    } catch (error: any) {
      return {
        error: error?.data?.error || "Failed to update lesson",
        data: null,
      };
    }
  };

  const deleteLesson = async (lessonSlug: string) => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(
        `${config.public.API_BASE_URL}api/lms/lessons/${lessonSlug}/`,
        {
          method: "DELETE",
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
        error: error?.data?.error || "Failed to delete lesson",
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
