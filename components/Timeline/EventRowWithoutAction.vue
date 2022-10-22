<template>
  <div
    :style="eventRowStyle"
  >
    <div class="flex flex-row">
      <div
        class="eventItem flex-row items-center flex rounded -mx-2 px-2 py-1"
        :class="eventClass"
      >
        <EventBarWithoutAction
          :event="event"
          :width="width"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DateRange, Event } from "../../src/Types";
import Vue from "vue";
import { mapGetters, mapState } from "vuex";
import EventBarWithoutAction from "./EventBarWithoutAction.vue";
import { DateTime } from "luxon";
import { roundDateTime } from "~/store";
export const EVENT_HEIGHT_PX = 10;

export default Vue.extend({
  components: { EventBarWithoutAction },
  props: {
    event: Event,
  },
  data() {
    return {
      imageStatus: "not loaded",
      images: [],
      showingMeta: false,
      hover: false,
      tempTo: undefined as DateTime | undefined,
      tempFrom: undefined as DateTime | undefined,
      barHover: false,
    };
  },
  watch: {
    hover(val) {
      this.$store.commit("setHovering", val ? this.event : null);
    },
  },
  computed: {
    ...mapGetters(["distanceFromBaselineLeftmostDate"]),
    ...mapState({
      isHoveredInEditor(state: any) {
        return (state.hoveringEvent as Event) === (this.event as Event);
      },
    }),
    eventClass(): string {
      let c = "";
      if (this.barHover) {
        if (this.hasMeta) {
          return "dark:bg-gray-800 bg-white shadow-lg cursor-pointer ";
        }
      }
      if (this.showingMeta) {
        c += "dark:bg-gray-900 bg-white shadow-lg ";
      }
      if (
        (this.hovering || this.isHoveredInEditor) &&
        this.$store.state.editable
      ) {
        c += "bg-gray-200/50 dark:bg-gray-800/25 ";
      }
      return c;
    },
    hovering(): boolean {
      return this.hover || !!this.tempTo || !!this.tempFrom;
    },
    locations(): string[] {
      return this.event.event.locations.map(
        (location: string) =>
          `https://www.google.com/maps/embed/v1/place?key=AIzaSyCWzyvdh_bxpqGgmNTjTZ833Dta4_XzKeU&q=${location}`
      );
    },
    supplemental(): string[] {
      return this.event.event.supplemental;
    },
    canShowMeta(): boolean {
      if (this.images.length > 0) {
        return this.showingMeta && this.imageStatus === "loaded";
      }
      if (this.hasLocations || this.hasSupplemental) {
        return this.showingMeta;
      }
      return false;
    },
    hasMeta(): boolean {
      return this.hasImages || this.hasLocations || this.hasSupplemental;
    },
    hasLocations(): boolean {
      return this.event.event.locations.length > 0;
    },
    hasImages(): boolean {
      return !!this.event.event.googlePhotosLink;
    },
    hasSupplemental(): boolean {
      return !!this.supplemental.length;
    },
    eventRowStyle(): string {
      const leftMargin = this.distanceFromBaselineLeftmostDate(
        this.tempFrom ? this.tempFrom : this.event.ranges.date.fromDateTime
      );
      return `margin-left: ${leftMargin}px; position: absolute; padding-top: 1rem`;
    },
    photoBarClass(): string {
      let c = "photoBar transition rounded-lg shadow ";
      const tag = this.event.event.tags[0];
      if (!this.$store.getters.tags[tag]) {
        c += `bg-gray-300 `;
      }
      if (this.hovering) {
        c += `opacity-80 shadow-lg `;
      }
      return c;
    },
    barColor(): string {
      let style = "";
      const tag = this.event.event.tags[0];
      if (this.$store.getters.tags[tag]) {
        style += ` background-color: rgba(${this.$store.getters.tags[tag]}, 0.6)`;
      }
      return style;
    },
    photoBarStyle(): string {
      return `width: 10px; ${this.barColor}; top: calc(0.5rem + 3px)`;
    },
    width(): number {
      if (this.tempTo && this.tempFrom) {
        return this.getWidthForRange({
          fromDateTime: this.tempFrom,
          toDateTime: this.tempTo,
        });
      }
      if (this.tempTo) {
        return this.getWidthForRange({
          fromDateTime: this.event.ranges.date.fromDateTime,
          toDateTime: this.tempTo,
        });
      }
      if (this.tempFrom) {
        return this.getWidthForRange({
          fromDateTime: this.tempFrom,
          toDateTime: this.event.ranges.date.toDateTime,
        });
      }
      return this.getWidthForRange(this.event.ranges.date);
    },
  },
  methods: {
    edit() {
      console.log('我是编辑')
      // const vm = this;
      // vm.$store.commit("sidebar/setVisibility", true);
      // if (vm.$store.state.sidebar.selectedComponent !== "editor") {
      //   vm.$store.commit("sidebar/setSelectedComponent", "editor");
      // }
      // Vue.nextTick(() => {
      //   vm.$store.dispatch("moveCursorToEvent", vm.event);
      // });
      this.$emit('edit', this.event)
    },
    moveUp() {
      this.$store.dispatch("moveEventUpOrDown", {
        up: true,
        event: this.event,
      });
    },
    moveDown() {
      this.$store.dispatch("moveEventUpOrDown", {
        up: false,
        event: this.event,
      });
    },
    startResizeLeft(e: MouseEvent | TouchEvent) {
      const vm = this;
      const moveListener = (e: MouseEvent | TouchEvent) => {
        let x;
        if (e instanceof TouchEvent) {
          x = e.touches[0].clientX;
        } else {
          x = e.clientX;
          e.preventDefault();
        }
        const date = this.$store.getters.dateFromClientLeft(x) as DateTime;
        const rounded = roundDateTime(
          date,
          this.$store.getters.nextMostGranularScaleOfViewportDateInterval
        );
        vm.tempFrom = rounded;
      };
      const upListener = (ev: MouseEvent | TouchEvent) => {
        if (ev instanceof TouchEvent) {
        } else {
          ev.preventDefault();
        }
        vm.$store.dispatch("updateEventDateRange", {
          event: vm.event,
          from: vm.tempFrom,
          to: (vm.event as Event).ranges.date.toDateTime,
        });
        vm.tempFrom = undefined;
        document.removeEventListener("mousemove", moveListener);
        document.removeEventListener("mouseup", upListener);
        document.removeEventListener("touchmove", moveListener);
        document.removeEventListener("touchend", upListener);
        vm.$store.commit("clearGlobalClass");
      };
      document.addEventListener("mousemove", moveListener);
      document.addEventListener("mouseup", upListener);
      document.addEventListener("touchmove", moveListener);
      document.addEventListener("touchend", upListener);
      vm.$store.commit(
        "setGlobalClass",
        "pointer-events-none cursor-ew-resize"
      );
    },
    startResizeRight(e: MouseEvent) {
      const vm = this;
      vm.tempTo = (vm.event as Event).ranges.date.toDateTime;
      const moveListener = (e: MouseEvent | TouchEvent) => {
        let x;
        if (e instanceof TouchEvent) {
          x = e.touches[0].clientX;
        } else {
          x = e.clientX;
          e.preventDefault();
        }
        const date = this.$store.getters.dateFromClientLeft(x) as DateTime;
        const rounded = roundDateTime(
          date,
          this.$store.getters.nextMostGranularScaleOfViewportDateInterval
        );
        vm.tempTo = rounded;
      };
      const upListener = (ev: MouseEvent | TouchEvent) => {
        ev.preventDefault();
        vm.$store.dispatch("updateEventDateRange", {
          event: vm.event,
          to: vm.tempTo,
          from: (vm.event as Event).ranges.date.fromDateTime,
        });
        vm.tempTo = undefined;
        document.removeEventListener("mousemove", moveListener);
        document.removeEventListener("mouseup", upListener);
        document.removeEventListener("touchmove", moveListener);
        document.removeEventListener("touchend", upListener);
        vm.$store.commit("clearGlobalClass");
      };
      document.addEventListener("mousemove", moveListener);
      document.addEventListener("mouseup", upListener);
      document.addEventListener("touchmove", moveListener);
      document.addEventListener("touchend", upListener);
      vm.$store.commit(
        "setGlobalClass",
        "pointer-events-none cursor-ew-resize"
      );
    },
    move() {
      const vm = this;
      vm.tempFrom = (vm.event as Event).ranges.date.fromDateTime;
      vm.tempTo = (vm.event as Event).ranges.date.toDateTime;
      const diff = vm.tempTo.diff(vm.tempFrom).as("days");

      const moveListener = (e: MouseEvent | TouchEvent) => {
        let x;
        if (e instanceof TouchEvent) {
          x = e.touches[0].clientX;
        } else {
          e.preventDefault();
          x = e.clientX;
        }
        // + 18 because of where the handle is
        const date = this.$store.getters.dateFromClientLeft(x + 18) as DateTime;
        const rounded = roundDateTime(
          date,
          this.$store.getters.nextMostGranularScaleOfViewportDateInterval
        );
        vm.tempFrom = rounded;
        vm.tempTo = rounded.plus({ days: diff });
      };

      const moveEnd = (e: MouseEvent | TouchEvent) => {
        if (e instanceof TouchEvent) {
        } else {
          e.preventDefault();
        }
        vm.$store.dispatch("updateEventDateRange", {
          event: vm.event,
          from: vm.tempFrom,
          to: vm.tempTo,
        });
        vm.tempTo = undefined;
        vm.tempFrom = undefined;
        document.removeEventListener("touchmove", moveListener);
        document.removeEventListener("mousemove", moveListener);
        document.removeEventListener("mouseup", moveEnd);
        document.removeEventListener("touchend", moveEnd);
        vm.$store.commit("clearGlobalClass");
      };
      document.addEventListener("mousemove", moveListener);
      document.addEventListener("touchmove", moveListener);
      document.addEventListener("mouseup", moveEnd);
      document.addEventListener("touchend", moveEnd);
      vm.$store.commit(
        "setGlobalClass",
        "pointer-events-none cursor-ew-resize"
      );
    },
    async loadImages() {
      this.imageStatus = "loading";
      const imagesResponse = await fetch(
        `https://k.npkn.net/google-photos/${this.event.event.googlePhotosLink}`
      );
      this.images = await imagesResponse.json();
      this.imageStatus = "loaded";
    },
    togglePhotos(e: MouseEvent) {
      if (e.target instanceof HTMLAnchorElement) {
        return;
      }
      e.preventDefault();
      this.showingMeta = !this.showingMeta;
      if (this.imageStatus === "not loaded" && this.hasImages) {
        this.loadImages();
      }
    },
    getWidthForRange(range: DateRange): number {
      const distance = this.$store.getters.distanceBetweenDates(
        range.fromDateTime,
        range.toDateTime
      );
      const newWidth = Math.max(EVENT_HEIGHT_PX, distance);
      return newWidth;
    },
  },
});
</script>

<style>
.photoBar {
  width: 10px;
}
/* .eventRow {
  padding-top: 2px;
  padding-bottom: 20px;
} */

.eventDate {
  color: #93979a;
  font-family: system-ui;
  font-size: 80%;
  margin: 0px 0px 0px 8px;
  white-space: nowrap;
}

/* .eventRow:hover .eventBar {
  @apply opacity-80 shadow-lg;
} */

/* .eventRow:hover .photoBar {
  @apply opacity-80 shadow-lg;
}

.eventRow:hover .percentBar {
  @apply opacity-100
} */
</style>