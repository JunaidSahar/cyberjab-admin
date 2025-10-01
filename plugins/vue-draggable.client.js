import draggable from "vuedraggable";

export default defineNuxtPlugin((nuxtApp: any) => {
  nuxtApp.vueApp.component("draggable", draggable);
});
