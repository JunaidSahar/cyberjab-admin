<script setup lang="ts">
import DataTable from "~/components/global/data-table.vue";
const router = useRouter()

const columns = [
  { key: "first_name", title: "First Name" },
  { key: "last_name", title: "Last Name" },
  { key: "email", title: "Email" },
  { key: "roles", title: "Roles" },
  { key: "status", title: "Status" },
  { key: "last_login", title: "Last Login" },
  { key: "created_at", title: "Date Created" },
  { key: "action", title: "Action", align: "end" },
];

const data = [
  {
    first_name: "John",
    last_name: "Brown",
    email: "johnbrown@gmail.com",
    roles: "Student",
    status: "Active",
    last_login: "Sep 1, 2025",
    created_at: "Jan 1, 2024"
  },
  {
    first_name: "Shaheer",
    last_name: "Haider",
    email: "shaheerhaider@gmail.com",
    roles: "Editor",
    status: "Inactive",
    last_login: "Sep 1, 2025",
    created_at: "Jan 1, 2024"
  },
];
</script>

<template>
  <div class="w-full h-full">
    <div class="flex justify-between items-center w-full">
      <h1 class="text-headingColor text-3xl">Users</h1>
      <button
      @click="() => router.push('/users/create-user')"
        class="flex items-center gap-2 bg-[#292D32] hover:bg-darkForground px-5 py-2.5 rounded-lg font-semibold text-headingColor transition-all"
      >
        <Icon name="material-symbols:add" />
        Create
      </button>
    </div>

    <div class="flex items-center gap-4 pt-5">
      <div
        class="flex flex-1 items-center gap-2 bg-darkForground px-4 py-2 rounded-lg min-h-10"
      >
        <input
          type="text"
          placeholder="Search module by name..."
          class="bg-transparent focus:outline-none w-full text-headingColor text-sm"
        />
        <Icon
          class="w-5 h-5 text-headingColor"
          name="streamline:interface-search-glass-search-magnifying"
        />
      </div>

      <select
        class="block bg-darkForground px-4 py-2 rounded-lg w-60 min-h-10 dark:text-neutral-400 text-sm disabled:pointer-events-none"
      >
        <option selected>Filters</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
    </div>

    <div class="pt-5">
      <DataTable :columns="columns" :data="data" />
    </div>
  </div>
</template>
