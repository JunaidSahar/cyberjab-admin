<template>
  <div>
    <div class="space-y-2">
      <NuxtLink to="/users" class="flex items-center gap-2 text-headingColor text-sm">
        <Icon name="material-symbols:arrow-back-rounded" />
        <span> Users </span>
      </NuxtLink>
      <h1 class="text-headingColor text-3xl">
        {{ isEdit ? "Edit User" : "Create a new User" }}
      </h1>
    </div>

    <div class="flex gap-6 pt-6 w-full">
      <!-- Profile Picture Section -->
      <div class="flex flex-col items-center bg-darkForground p-6 rounded-xl w-[20%]">
        <h3 class="pb-5 text-headingColor text-2xl text-center">Profile Picture</h3>
        <div class="flex justify-center items-center bg-[#292D32] rounded-full w-60 min-h-60">
          <Icon
            v-if="!profilePicture && !form.profile_picture"
            name="material-symbols:person"
            class="w-36 h-36 text-darkBackground"
          />
          <img
            v-else
            :src="previewImage"
            alt="preview"
            class="rounded-full w-60 h-60 object-cover"
          />
        </div>
        <div class="flex flex-col justify-center items-center gap-4 pt-6">
          <input
            type="file"
            accept="image/*"
            id="profileUpload"
            class="hidden"
            @change="handleFileChange"
          />
          <label
            for="profileUpload"
            class="cursor-pointer bg-gradient-to-r from-[#00B9FF] to-[#4E47FF] px-4 py-2 rounded-lg text-white text-sm"
          >
            Upload Photo
          </label>
          <p class="opacity-50 max-w-48 text-[#E2E2E2] text-sm text-center">
            at least 536 x 300px PNG or JPG file.
          </p>
        </div>
      </div>

      <!-- User Info Form -->
      <div class="bg-darkForground p-6 rounded-xl w-[60%]">
        <h3 class="pb-5 text-headingColor text-2xl">User information</h3>
        <form @submit.prevent="submitForm" class="gap-5 grid grid-cols-2">
          <div class="flex flex-col gap-2 col-span-1">
            <label for="first_name" class="text-headingColor">First Name</label>
            <input
              v-model="form.first_name"
              type="text"
              placeholder="Enter first name"
              class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-1">
            <label for="last_name" class="text-headingColor">Last Name</label>
            <input
              v-model="form.last_name"
              type="text"
              placeholder="Enter last name"
              class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-2">
            <label for="email" class="text-headingColor">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Enter email address"
              class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm"
            />
          </div>

          <!-- Password only for Create Mode -->
          <div v-if="!isEdit" class="flex flex-col gap-2 col-span-2">
            <label for="password" class="text-headingColor">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Enter password"
              class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm"
            />
          </div>

          <div class="flex flex-col gap-2 col-span-2">
            <label for="bio" class="text-headingColor">Bio</label>
            <textarea
              v-model="form.bio"
              placeholder="Enter bio"
              rows="6"
              class="bg-darkBackground px-4 py-3 rounded-lg placeholder:text-headingColor/30 text-sm text-white"
              id="bio"
            ></textarea>
          </div>
          <div class="pt-3 col-span-2">
            <button
              type="submit"
              :disabled="loading"
              class="bg-[#292D32] px-5 py-2.5 rounded-lg text-headingColor"
            >
              {{ loading ? "Saving..." : isEdit ? "Update User" : "Save User" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const props = defineProps({
  id: {
    type: [String, Number],
    default: null
  }
});

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();
const BASE_URL = config.public.API_BASE_URL;
const TOKEN = config.public.API_TOKEN;

// prefer prop id (when page /users/create-user/[id].vue passes it), otherwise fallback to route.params.id
const userId = computed(() => {
  return props.id ?? route.params.id ?? null;
});

const isEdit = computed(() => !!userId.value); // agar id h to edit mode

const form = ref({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  bio: "",
  profile_picture: ""
});

const profilePicture = ref<File | null>(null);

const previewImage = computed(() => {
  if (profilePicture.value) return URL.createObjectURL(profilePicture.value);
  if (form.value.profile_picture) return form.value.profile_picture;
  return "";
});

function handleFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) profilePicture.value = f;
}

const loading = ref(false);

async function fetchUser() {
  try {
    const res = await fetch(`${BASE_URL}api/users/admin/users/${userId.value}/`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    const data = await res.json();
    form.value = {
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      email: data.email || "",
      password: "",
      bio: data.bio || "",
      profile_picture: data.profile_picture || ""
    };
  } catch (err) {
    console.error("❌ Fetch user error:", err);
  }
}

onMounted(() => {
  if (isEdit.value) fetchUser();
});

async function submitForm() {
  loading.value = true;
  try {
    const fd = new FormData();
    fd.append("first_name", form.value.first_name);
    fd.append("last_name", form.value.last_name);
    fd.append("email", form.value.email);
    if (!isEdit.value && form.value.password) fd.append("password", form.value.password); // sirf create me
    fd.append("bio", form.value.bio);

    if (profilePicture.value) {
      fd.append("profile_picture", profilePicture.value);
    }

    const url = isEdit.value
      ? `${BASE_URL}api/users/admin/users/${userId.value}/`
      : `${BASE_URL}api/users/admin/users/`;

    const method = isEdit.value ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: fd,
    });

    const result = await res.json().catch(() => ({}));
    console.log("API Result:", result);

    if (!res.ok) throw new Error(`API Error: ${res.status}`);

    router.push("/users");
  } catch (err: any) {
    console.error("❌ Error submitting user:", err);
    alert("Error: " + (err?.message || err));
  } finally {
    loading.value = false;
  }
}
</script>
