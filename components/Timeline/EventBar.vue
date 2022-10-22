
<template>
  <div class="relative">
    <div :class="eventBarClass" :style="eventBarStyle"></div>
    <div
      class="absolute left-0 top-0 bottom-0 rounded-full percentBar transition"
      :class="percentBarColorClass"
      :style="`min-width: 10px; max-width: 100%; ${percentBarColorStyle}; width: ${percent}%;`"
    >{{ ruleDescription }}</div>
    <drag-handle
      v-if="$store.state.editable && hovering"
      @startResize="startResizeLeft"
      :isLeft="true"
    />
    <drag-handle
      v-if="$store.state.editable && hovering"
      @startResize="startResizeRight"
      :isLeft="false"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Event } from "~/src/Types";
import { mapGetters, mapState } from "vuex";
import DragHandle from "./DragHandle.vue";

export default Vue.extend({
  components: { DragHandle },
  props: ["event", "hovering", "width"],
  methods: {
    startResizeLeft(e: MouseEvent) {
      this.$emit("startResizeLeft", e);
    },
    startResizeRight(e: MouseEvent) {
      this.$emit("startResizeRight", e);
    },
  },
  computed: {
    ...mapGetters(["distanceFromBaselineLeftmostDate"]),
    ...mapState({groups: (state: any) => state.groups }),
    tagColor(): string | undefined {
      if (this.event.event.tags[0]) {
        console.log(this.$store.getters.tags, 'tagColor', this.event.event.tags[0])
        return this.$store.getters.tags[this.event.event.tags[0]];
        // return this.$store.getters.tags['pink'];
      }
      console.log(this.event, 'this.event.event.tags[0]this.event.event.tags[0]')
      return undefined;
    },
    percent(): number | undefined {
      return (this.event as Event).event.percent || 100;
    },
    percentBarColorClass(): string {
      let c = "";
      if (!this.tagColor) {
        c += `dark:bg-gray-400 bg-slate-700 `;
      }
      if (this.hovering) {
        c += "opacity-100 shadow-lg ";
      } else {
        c += "opacity-60 ";
      }
      return c;
    },
    rule(): any {
      for (const g of this.groups) {
        for (const r of g.rules) {
          if (r.id === this.event.event.eventDescription) {
            return r;
          }
        }
      }
    },
    ruleDescription(): string {
      let suffix = "";
      if (this.rule.count > 1) {
        suffix = "s";
      }
      return this.rule.id + " (" + this.rule.count + " " + this.rule.role + suffix + ")";
    },
    percentBarColorStyle(): string {
      let style = "color: white; text-align: center;";
      if (this.tagColor) {
        style += ` background-color: rgba(${this.tagColor}, 0.8)`;
      }
      if (this.rule.role === "leader") {
        style += ` background-color: rgba(150,150,0,0.8)`;
      } else if (this.rule.role == "follower") {
        style += ` background-color: rgba(0,50,100,0.8)`;
      } else if (this.rule.role == "voter") {
        style += ` background-color: rgba(20,100,80,0.8)`;
      } else if (this.rule.role === "learner") {
        style += ` background-color: rgba(255,0,0,0.8)`;
      }

      return style;
    },
    eventBarClass(): string {
      let c = "eventBar transition rounded-lg shadow ";
      if (!this.tagColor) {
        c += `dark:bg-slate-400 bg-slate-700 opacity-30 `;
      }
      return c;
    },
    barColorStyle(): string {
      let style = "";
      if (this.tagColor) {
        style += ` background-color: rgba(${this.tagColor}, 0.3)`;
      }
      return style;
    },
    eventBarStyle(): string {
      return `width: ${this.width}px; ${this.barColorStyle}`;
    },
  },
});
</script>

<style>
.eventBar {
  border-radius: 5px;
  height: 20px;
  flex-shrink: 0;
}
</style>