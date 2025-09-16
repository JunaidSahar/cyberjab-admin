<template>
  <div
    v-if="editor"
    class="bg-darkBackground rounded-b-lg overflow-hidden"
  >
    <div class="flex items-center gap-0 bg-[#292D32]">
      <div class="p-3 border-r border-border text-sm">
        <select
          v-model="selectedFontSize"
          @change="setFontSize"
          class="bg-[#292D32]"
        >
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="20px">20</option>
        </select>
      </div>
      <div class="flex items-center gap-4 p-3 border-r border-border text-headingColor text-sm">
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
          :class="{ 'italic': editor.isActive('italic') }"
          type="button"
          class="font-serif"
        >
          I
        </button>
        <button
          @click="editor.chain().focus().toggleUnderline().run()"
          :disabled="!editor.can().chain().focus().toggleUnderline().run()"
          :class="{ 'underline': editor.isActive('underline') }"
          type="button"
        >
          U
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'strike': editor.isActive('strike') }"
          type="button"
        >
          S
        </button>
      </div>
      <div class="flex items-center gap-4 p-3 border-r border-border text-headingColor text-sm">
        <p
          @click="editor.chain().focus().setTextAlign('left').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
        >
          <Icon class="w-5 h-5" name="meteor-icons:align-left" />
        </p>
        <p
          @click="editor.chain().focus().setTextAlign('center').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
        >
          <Icon class="w-5 h-5" name="meteor-icons:align-center" />
        </p>
        <p
          @click="editor.chain().focus().setTextAlign('right').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
        >
          <Icon class="w-5 h-5" name="meteor-icons:align-right" />
        </p>
        
      </div>
      
    </div>
    <TiptapEditorContent :editor="editor" class="text-headingColor" />
  </div>
</template>

<script setup>
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
const editor = useEditor({
  content: "<p>Content</p>",
  extensions: [TiptapStarterKit, TextStyle, FontSize, Underline, TextAlign.configure({
    types: ['heading', 'paragraph']
  })],
});

const selectedFontSize = ref("16px");

function setFontSize() {
  editor.value.chain().focus().setFontSize("28px").run();
}

onBeforeUnmount(() => {
  unref(editor).destroy();
});
</script>

