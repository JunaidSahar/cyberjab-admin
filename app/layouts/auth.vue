<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    <div class="md:p-10 p-5 space-y-6">
      <NuxtLink to="/" class="">
        <img src="/logo.svg" class="md:h-16 h-10 w-auto" alt="CyberJab Admin" />
      </NuxtLink>
      <div class="flex items-center mx-auto justify-center gap-6 w-full min-h-[calc(100vh-180px)] max-w-[1200px]">
        <div class="flex flex-col w-full h-fit bg-white/10 backdrop-blur-lg md:p-10 p-6 rounded-xl border border-white/20 shadow-2xl">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Handle toast notifications for auth flow
const toastMap = {
  "account-verification-passed": {
    title: "Account Verified",
    description: "Your account has been successfully verified. You can now sign in.",
    color: "success",
  },
};

const query = useRoute().query;

// Extract the parameter from the route
const toastInfo = toastMap[query.result];
if (toastInfo && import.meta.client) {
  console.log(`${toastInfo.title}: ${toastInfo.description}`);
}
</script>