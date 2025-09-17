<template>
            <h1 class="text-3xl text-headingColor">Instructors</h1>

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
        class="block bg-darkForground px-4 py-2 rounded-lg w-60 min-h-10 focus:outline-none dark:text-neutral-400 text-sm disabled:pointer-events-none"
      >
        <option selected="">Filters</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
     
    </div>
</template>