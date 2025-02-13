<template>
  <div
    class="
      flex flex-row
      text-gray-500
      dark:text-gray-400
      absolute
      pr-8
      moveWidgets
      items-center
      justify-center
      p-2
      mt-6
    "
  >
    <div
      class="flex flex-row mr-1 items-center justify-center"
      v-if="sort === 'none' && (!filter || !filter.length)"
    >
      <button
        title="Edit event"
        class="
          mr-1
          transition
          dark:hover:text-slate-100
          hover:text-black
          rounded-sm
          p-px
        "
        @click="$emit('edit')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
          />
        </svg>
      </button>
      <button
        title="Move up"
        class="
          transition
          dark:hover:text-slate-100
          hover:text-black
          rounded-sm
          p-px
        "
        @click="$emit('moveUp')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <button
        title="Move down"
        class="
          transition
          dark:hover:text-slate-100
          hover:text-black
          rounded-sm
          p-px
        "
        @click="$emit('moveDown')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <div
      title="Drag to move"
      class="
        handle
        flex
        items-center
        justify-center
        cursor-crosshair
        touch-none
        hover:text-black
        dark:hover:text-slate-100
        transition
      "
      @touchstart="move"
      @mousedown.prevent.stop="move"
    >
      <svg
        class="w-4 h-4"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { Sort } from "~/src/Sort";

export default Vue.extend({
  computed: {
    ...mapGetters(["settings"]),
    sort(): Sort {
      return this.settings.sort;
    },
    filter(): string {
      return this.settings.filter;
    },
    style(): string {
      return "margin-top: 1.5rem"
      return this.showMoveButtons ? "left: -6rem" : "left: -2.2rem;";
    },
    showMoveButtons(): boolean {
      return this.sort === "none" && (!this.filter || !this.filter.length);
    },
  },
  methods: {
    move(e: MouseEvent | TouchEvent) {
      this.$emit("move", e);
    },
  },
});
</script>

<style>
.moveWidgets {
  display: inline-flex;
}
</style>