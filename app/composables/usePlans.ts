export const usePlans = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();

  const getPlans = async () => {
    const token = getAccessToken();

    if (!token) {
      return { error: "No access token available", data: null };
    }

    try {
      const res = await $fetch(`${config.public.API_BASE_URL}api/subscription/plans/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      return { data: res, error: null };
    } catch (error: any) {
      return { error: error?.data?.error || "Failed to fetch plans", data: null };
    }
  };

  return {
    getPlans,
  };
};