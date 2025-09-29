<template>
  <div>
    <div class="space-y-2">
      <NuxtLink
        to="/users"
        class="flex items-center gap-2 text-headingColor text-sm"
      >
        <Icon name="material-symbols:arrow-back-rounded" />
        <span> Users </span>
      </NuxtLink>
      <h1 class="text-headingColor text-3xl">Create a new User</h1>
    </div>

    <div class="flex gap-6 pt-6 w-full">
      <div class="flex flex-col items-center bg-darkForground p-6 rounded-xl w-[20%]">
        <h3 class="pb-5 text-headingColor text-2xl text-center">Profile Picture</h3>

        <div class="flex justify-center items-center bg-[#292D32] rounded-full w-60 min-h-60">
          <Icon name="material-symbols:person" class="w-36 h-36 text-darkBackground" />
        </div>

        <div class="flex flex-col justify-center items-center gap-4 pt-6">
          <div
            class="group bg-gradient-to-r from-[#00B9FF] to-[#4E47FF] p-px rounded-lg w-fit"
          >
            <button
              class="flex bg-darkForground group-hover:bg-transparent px-4 py-2 rounded-lg w-full text-white text-sm transition-all"
            >
              Upload Photo
            </button>
          </div>
          <p class="opacity-50 max-w-48 text-[#E2E2E2] text-sm text-center">
            at least 536 x 300px PNG or JPG file.
          </p>
        </div>
      </div>
      <div class="bg-darkForground p-6 rounded-xl w-[60%]">
        <h3 class="pb-5 text-headingColor text-2xl">User information</h3>

        <form action="" class="gap-5 grid grid-cols-2">
          <div class="flex flex-col gap-2 col-span-1">
            <label for="first_name" class="text-headingColor">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-1">
            <label for="last_name" class="text-headingColor">Last Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-2">
            <label for="email" class="text-headingColor">Email</label>
            <input
              type="email"
              placeholder="Enter email adress"
              class="bg-darkBackground placeholder:opacity-30 px-4 py-3 rounded-lg text-headingColor text-sm"
            />
          </div>
          
          
          <div class="flex flex-col gap-2 col-span-2">
            <label for="description" class="text-headingColor"
              >Bio</label
            >
            <textarea
              placeholder="Enter bio"
              rows="6"
              class="bg-darkBackground px-4 py-3 rounded-lg placeholder:text-headingColor/30 text-sm text-white"
              name="description"
              id="desc"
            ></textarea>
          </div>

          <div class="pt-3">
            <button
              class="bg-[#292D32] px-5 py-2.5 rounded-lg text-headingColor"
            >
              Save as draft
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
