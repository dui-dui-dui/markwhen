<template>
  <!-- <button
    role="button"
    class="
      flex flex-row
      items-center
      mr-2
      md:px-2 md:py-0
      p-1
      rounded
      bg-slate-50
      hover:bg-slate-200
      transition
      dark:bg-gray-800
      dark:text-gray-400
      dark:hover:text-gray-100
      dark:hover:bg-gray-600
      tagButton
    "
    @click="filterTag"
  > -->
  <div 
    :class="[
      'flex', 'flex-row',
      'items-center',
      'mr-2',
      'p-1',
      'rounded',
      'transition',
      'cursor-pointer',
      'border-red-500',
      'border-dashed',
      { 'border-2': tag == active}
      ]
    "
    @click="filterTag"
  >
    <div class="h-4 w-4 rounded" :style="buttonStyle">
      <svg
        v-if="isThisTagInFilter"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-gray-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  </div>
    <!-- <span class="ml-2">{{ tag }}</span> -->
  <!-- </button> -->
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapState } from "vuex";

export default Vue.extend({
  props: ["tag", "current"],
  data() {
    return {
      active: ''
    }
  },
  computed: {
    isThisTagInFilter(): boolean {
      return this.filter.includes(this.tag);
    },
    ...mapGetters(["tags", "settings"]),
    filter(): string[] {
      return this.settings.filter;
    },
    buttonStyle(): string {
      const tagColor = this.tags[this.tag];
      // return `background-color: rgba(${tagColor}, 1)`;
      return `background-color: ${tagColor}`;
    },
  },
  watch: {
    current(val) {
      console.log(val, '颜色')
      this.active = val
    }
  },
  methods: {
    filterTag() {
      this.$emit("filterTag", this.tag);
      // this.$store.commit("filterTag", this.tag);
    },
  },
});
</script>

<style>
</style>