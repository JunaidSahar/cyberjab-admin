<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <img class="mx-auto h-12 w-auto" src="/logo.svg" alt="CyberJab Admin" />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          {{ pageTitle }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ pageMessage }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="text-gray-600">Processing authentication...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="heroicons:x-circle" class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Authentication Failed</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
            <div class="mt-4">
              <button 
                @click="retryAuthentication" 
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Authentication Successful</h3>
            <div class="mt-2 text-sm text-green-700">
              <p>Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Access Required State -->
      <div v-else-if="route.query.message === 'access_required'" class="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="heroicons:information-circle" class="h-5 w-5 text-blue-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">Authentication Required</h3>
            <div class="mt-2 text-sm text-blue-700">
              <p>You need to login to cyber jab application then click admin from navbar to access this application</p>
            </div>
          </div>
        </div>
      </div>

      <!-- No Token State -->
      <div v-else class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-yellow-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">No Authentication Token</h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>Please access this page through your SSO provider with a valid authentication token.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const { login, getUser } = useAuth();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const pageTitle = computed(() => {
  if (loading.value) return "Authenticating...";
  if (error.value) return "Authentication Failed";
  if (success.value) return "Welcome!";
  return "SSO Authentication";
});

const pageMessage = computed(() => {
  if (loading.value) return "Please wait while we verify your credentials";
  if (error.value) return "There was an issue with your authentication";
  if (success.value) return "You have been successfully authenticated";
  
  // Check if user was redirected from a protected page
  if (route.query.message === 'access_required') {
    return "You need to login to cyber jab application then click admin from navbar to access this application";
  }
  
  return "Single Sign-On Authentication Portal";
});

const retryAuthentication = () => {
  error.value = null;
  handleSSOAuthentication();
};

const handleSSOAuthentication = async () => {
  const token = route.query.token as string;
  
  if (!token) {
    return; // Show no token state
  }

  loading.value = true;
  error.value = null;

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

    // Step 4: Show success state briefly
    success.value = true;
    
    // Step 5: Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/');
    }, 1500);

  } catch (err: any) {
    error.value = err.message || "Authentication failed. Please try again.";
    console.error("SSO Authentication error:", err);
  } finally {
    loading.value = false;
  }
};

// Start authentication process when component mounts
onMounted(() => {
  handleSSOAuthentication();
});

// Watch for route changes (in case token is added later)
watch(() => route.query.token, (newToken) => {
  if (newToken && !loading.value && !success.value) {
    handleSSOAuthentication();
  }
});
</script>