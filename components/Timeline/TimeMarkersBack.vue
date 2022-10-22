<template>
  <div class="absolute inset-0">
    <div class="timeMarkerContainer h-full">
      <div
        class="flex flex-row h-full"
        :style="`margin-left: -${leftMargin}px`"
      >
        <time-marker-back
          v-for="timeMarker in markers"
          :key="timeMarker.ts"
          :opacity="alpha(timeMarker.dateTime)"
          :width="timeMarker.size"
          :borderColor="borderColorForDateTime(timeMarker.dateTime)"
          :backgroundColor="backgroundColorForDateTime(timeMarker.schema)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimeMarkerBack from "./TimeMarkerBack.vue";
import { dateScale, viewportLeftMarginPixels } from "~/store/index";
import { DateTime } from "luxon";
import { mapGetters } from "vuex";
// @ts-ignore
import * as LRU from "lru-cache";
// @ts-ignore
import * as lxt from "~/node_modules/luxon/src/impl/conversions.js";
// @ts-ignore
const weekdayCache = new LRU({ max: 300 });
function getWeekday(dateTime: DateTime): number {
  const key = `${dateTime.year}-${dateTime.month}-${dateTime.day}`;
  const cached = weekdayCache.get(key);
  if (cached) {
    return cached;
  }
  const weekday = lxt.gregorianToWeek(dateTime);
  weekdayCache.set(key, weekday.weekday);
  return weekday;
}

export default Vue.extend({
  components: { TimeMarkerBack },
  props: ["markers"],
  data() {
    return {
      leftMargin: 0,
    };
  },
  computed: {
    ...mapGetters(["timeMarkerWeights", "sidebar/darkMode"]),
  },
  methods: {
    borderColorForDateTime(dateTime: DateTime): string {
      const isDark = this["sidebar/darkMode"] === "dark";
      const a = (this.alpha(dateTime) - 0.3) * 2;
      return isDark ? `rgba(100, 100, 100, ${a})` : `rgba(200, 200, 200, ${a})`;
    },
    scaleForDate(dateTime: DateTime): number {
      return dateScale(dateTime);
    },
    alpha(dateTime: DateTime) {
      const a = this.timeMarkerWeights[this.scaleForDate(dateTime)];
      return a;
    },
    backgroundColorForDateTime(schema: string) {
      if (this.timeMarkerWeights[2]) {
        const isDark = this["sidebar/darkMode"] === "dark";
        const a = this.timeMarkerWeights[3] * 0.1;
        if (schema == "meta" || schema == "system" || schema == "default") {
          return isDark
            ? `rgba(255, 120, 30, ${a})`
            : `rgba(200, 200, 0, ${a})`;
        }
      }
    },
  },
});
</script>

<style>
.timeMarkerContainer {
  position: sticky;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
</style>