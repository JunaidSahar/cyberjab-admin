<template>
  <div class="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 min-h-screen">
    <div class="space-y-6 p-5 md:p-10">
      <NuxtLink to="/" class="">
        <img src="/logo.svg" class="w-auto h-10 md:h-16" alt="CyberJab Admin" />
      </NuxtLink>
      <div class="flex justify-center items-center gap-6 mx-auto w-full max-w-[1200px] min-h-[calc(100vh-180px)]">
        <div class="flex flex-col bg-white/10 shadow-2xl backdrop-blur-lg p-6 md:p-10 border border-white/20 rounded-xl w-full h-fit">
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