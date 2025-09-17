<template>
  <div class="flex items-center gap-3 mb-1">
    <Icon
      name="material-symbols:arrow-back"
      class="w-4 h-4 text-headingColor cursor-pointer"
      @click="$router.back()"
    />
    <h3 class="text-md text-headingColor">Instructors</h3>
  </div>
  <div>
    <div class="flex justify-between items-center">
      <h1 class="text-3xl text-headingColor">Create a new instructor</h1>
      <button
        class="flex items-center gap-2 bg-[linear-gradient(to_right,_#00B9FF,_#4E47FF)] px-5 py-2 rounded-lg text-[#FFFFFF] font-medium transition-all"
      >
        <Icon name="material-symbols:add" />
        Create
      </button>
    </div>
    <div class="w-full h-[1px] mt-6 bg-[#303347]"></div>
  </div>
  <div class="flex gap-6 justify-center items-center ">
    <div class="w-[220px] h-[400px] bg-[#1E1F23] flex flex-col mt-7">
        <div class="flex flex-col gap-4 justify-center items-center">
        <h1 class="text-headingColor text-2xl font-normal py-2 mt-5 ">Profile Picture</h1>
        <div class="flex flex-col items-center gap-4 bg-[#292D32] w-[150px] h-[150px] mx-auto justify-center rounded-full">
            <Icon name="material-symbols:person" class="w-28 h-28 text-[#15161A]" />
        </div>
       <div class="flex flex-col justify-center items-center gap-3 ">
          <div
            class="group bg-gradient-to-r from-[#00B9FF] to-[#4E47FF] p-px mt-2 rounded-lg w-fit"
          >
            <button
              class="flex bg-darkForground group-hover:bg-transparent px-5 py-2 rounded-lg w-full text-white text-sm transition-all"
            >
              Upload Photo
            </button>
          </div>
          <p class="opacity-50 max-w-32  text-[#E2E2E2] text-sm text-center">
            at least 256 x 256px PNG or JPG file.
          </p>
        </div>
        </div>
    </div>
    <div class="w-[648px] bg-[#1E1F23] h-[400px] mt-7 p-6">
      <h1>Instructor information</h1>
    </div>
  </div>
</template>
