<template>
  <div class="w-full h-full">
    <div class="flex justify-between items-center w-full">
      <h1 class="text-headingColor text-3xl">Leads</h1>
      <button
        class="flex items-center gap-2 bg-[#292D32] hover:bg-darkForeground px-5 py-2.5 rounded-lg font-semibold text-headingColor transition-all"
      >
        <Icon name="material-symbols:cloud-download-outline" class="w-5 h-5" />
        Export Leads
      </button>
    </div>
    <div class="flex items-center gap-4 pt-5">
      <div
        class="flex flex-1 items-center gap-2 bg-darkForeground px-4 py-2 rounded-lg min-h-10"
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
        class="block bg-darkForeground px-4 py-2 rounded-lg w-60 min-h-10 dark:text-neutral-400 text-sm disabled:pointer-events-none"
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

<script setup lang="ts">
import DataTable from "~/components/global/data-table.vue";

const columns = [
  { key: "email", title: "Email" },
  { key: "status", title: "Status" },
  { key: "name", title: "Name" },
  { key: "date_added", title: "Date Added" },
  { key: "source", title: "Source" },
];

const data = [
  {
    email: "johnbrown@gmail.com",
    roles: "Student",
    name: "John",
    status: "Pending",
    date_added: "Sep 1, 2025",
    source: "Student",
  },
   {
    email: "shaheerhaider@gmail.com",
    roles: "Student",
    name: "Shaheer",
    status: "Paid",
    date_added: "Sep 1, 2025",
    source: "Student",
  },
];
</script>
