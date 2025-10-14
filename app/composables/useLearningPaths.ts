export const useLearningPath = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();

  const getLearningPaths = async (
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
      if (filters.published) queryParams.is_active = filters.published;
      if (filters.ordering) queryParams.ordering = filters.ordering;

      const res = await $fetch(
        `${config.public.API_BASE_URL}api/lms/roadmaps/`,
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

  return {
    getLearningPaths,
  };
};
