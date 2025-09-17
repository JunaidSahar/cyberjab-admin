<template>
  <div v-if="editor" class="bg-darkBackground rounded-b-lg overflow-hidden">
    <div class="flex items-center gap-0 bg-[#292D32]">
      <div class="p-3 border-r border-border text-sm">
        <select
          v-model="selectedFontSize"
          @change="(e) => setFontSize(e.target.value)"
          class="bg-[#292D32]"
        >
          <option value="12">12</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
          <option value="20">20</option>
        </select>
      </div>
      <div
        class="flex items-center gap-4 p-3 border-r border-border text-headingColor text-sm"
      >
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'font-bold': editor.isActive('bold') }"
          type="button"
        >
          B
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ italic: editor.isActive('italic') }"
          type="button"
          class="font-serif"
        >
          I
        </button>
        <button
          @click="editor.chain().focus().toggleUnderline().run()"
          :disabled="!editor.can().chain().focus().toggleUnderline().run()"
          :class="{ underline: editor.isActive('underline') }"
          type="button"
        >
          U
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ strike: editor.isActive('strike') }"
          type="button"
        >
          S
        </button>
      </div>
      <div
        class="flex items-center gap-4 p-3 border-r border-border text-headingColor text-sm"
      >
        <p
          @click="editor.chain().focus().setTextAlign('left').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
        >
          <Icon class="w-4 h-4" name="meteor-icons:align-left" />
        </p>
        <p
          @click="editor.chain().focus().setTextAlign('center').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
        >
          <Icon class="w-4 h-4" name="meteor-icons:align-center" />
        </p>
        <p
          @click="editor.chain().focus().setTextAlign('right').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
        >
          <Icon class="w-4 h-4" name="meteor-icons:align-right" />
        </p>
      </div>

      <div
        class="flex items-center gap-4 p-3 border-r border-border text-headingColor text-sm"
      >
        <p
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          <Icon name="material-symbols:format-list-bulleted-rounded" />
        </p>

        <p
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          <Icon name="tabler:list-numbers" />
        </p>
      </div>

      <div
        class="flex items-center gap-4 p-3 border-r border-border text-headingColor text-sm"
      >
        <button type="button" @click="addImage">
          <Icon name="material-symbols:broken-image-outline" />
        </button>

        <button type="button" @click="setLink">
          <Icon name="mdi:link-variant" />
        </button>
      </div>
    </div>
    <TiptapEditorContent :editor="editor" class="text-headingColor" />
  </div>
</template>

<script setup>
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

// import { Dropcursor } from "@tiptap/extensions";

const editor = useEditor({
  content: "<p>Content</p>",
  extensions: [
    TiptapStarterKit,
    TextStyle,
    FontSize,
    Underline,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    BulletList,
    ListItem,
    OrderedList,
    Image,
    Link.configure({
      openOnClick: true,
      defaultProtocol: "https",
    }),

  ],
});

const selectedFontSize = ref("16");

function setFontSize(fontSize) {
  editor.value.chain().focus().setFontSize(`${fontSize}px`).run();
}

function addImage() {
  const url = window.prompt("URL");

  if (url) {
    this.editor.chain().focus().setImage({ src: url }).run();
  }
}

function setLink() {
  const previousUrl = editor.value.getAttributes("link").href;
  const url = window.prompt("URL", previousUrl);

  // cancelled
  if (url === null) {
    return;
  }

  // empty
  if (url === "") {
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  // update link
  editor.value
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: url })
    .run();
}

onBeforeUnmount(() => {
  unref(editor).destroy();
});
</script>
