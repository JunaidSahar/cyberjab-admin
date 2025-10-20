<template>
  <div class="bg-black min-h-[100vh] bg-darkBackground flex justify-center items-center">
    <div
      class="flex flex-col bg-darkForeground shadow-2xl backdrop-blur-lg p-6 md:p-10 border border-white/20 rounded-xl h-fit w-fit">

      <div class="flex justify-center items-center bg-transparent min-h-96">
        <div class="space-y-8 p-8 w-full max-w-md">
          <div class="text-center">
            <img class="mx-auto w-auto h-12" src="/logo.svg" alt="CyberJab Admin" />
            <h2 class="mt-6 font-extrabold text-white text-3xl">
              SSO Authentication Needed
            </h2>
            <p class="mt-2 text-gray-200 text-sm">
              Single Sign-On Authentication Portal
            </p>
          </div>

          <div v-if="isLoading" class="flex flex-col items-center justify-center space-y-4">
            <div class="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <p class="text-gray-200">Authenticating...</p>
          </div>

          <div v-else-if="error" class="bg-red-900/30 p-4 border border-red-500/50 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <Icon name="heroicons:exclamation-circle" class="w-5 h-5 text-red-400" />
              </div>
              <div class="ml-3">
                <h3 class="font-medium text-red-200 text-sm">Authentication Failed</h3>
                <div class="mt-2 text-red-300 text-sm">
                  <p>{{ error }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="bg-darkBackground p-4 border border-white/20 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <Icon name="heroicons:information-circle" class="w-5 h-5 text-blue-400" />
              </div>
              <div class="ml-3">
                <h3 class="font-medium text-gray-200 text-sm">Authentication Required</h3>
                <div class="mt-2 text-gray-400 text-sm">
                  <p>You need to login to <a href="https://cyberjab.org/home" target="_blank"
                      class="text-blue-400">cyber jab</a> then click admin from navbar to access this application
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});


const { login, getUser } = useAuth();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const error = ref<string | null>(null);
const isLoading = ref<boolean>(false);

const handleSSOAuthentication = async () => {
  const token = route.query.token as string;

  if (!token) {
    console.log("No token found in query parameters");
    error.value = "No authentication token found. Please login through the main website.";
    return;
  }

  error.value = null;
  isLoading.value = true;

  try {
    // Step 1: Set the token
    await login(token);

    // Step 2: Fetch user data to verify token validity
    const { data: userData, error: userError } = await getUser();

    if (userError) {
      throw new Error(userError);
    }

    // Step 3: Update user store with fetched data
    if (userData) {
      userStore.setUser(userData);
    }

    // Step 5: Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/');
    }, 1500);

  } catch (err: any) {
    error.value = err.message || "Authentication failed. Please try again.";
    console.error("SSO Authentication error:", err);
  } finally {
    isLoading.value = false;
  }
};

// Start authentication process when component mounts
onMounted(() => {
  handleSSOAuthentication();
});
</script>