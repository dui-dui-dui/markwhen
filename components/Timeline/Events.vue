<template>
  <div
    id="events"
    class="flex flex-col relative"
    :style="`min-width: 100vh;`"
  >
    <div class="h-14"></div>
    <!-- <div
      v-if="shouldShowNow"
      class="absolute h-full dark:bg-slate-400 bg-blue-300"
      :style="`width: 1px; left: ${distanceFromBaselineLeftmostDate(now)}px`"
    ></div> -->
    <div v-if="eventType === 'region'">
      <template v-for="event in getRegions">
        <template v-if="Array.isArray(event)">
          <event-group
            :key="
              event.length ? event[0].eventString.substring(0, 50) : 'newGroup'
            "
            :eventGroup="event"
            :eventType="eventType"
          />
        </template>
      </template>
    </div>

    <div v-else>
      <template v-for="event in filteredEvents">
        <template v-if="Array.isArray(event)">
          <event-group
            :key="
              event.length ? event[0].eventString.substring(0, 50) : 'newGroup'
            "
            :eventGroup="event"
            :eventType="eventType"
          />
        </template>
        <event-row
          v-else
          :key="event.eventString.substring(0, 50)"
          :event="event"
          @edit="edit"
        ></event-row>
      </template>
    </div>
    <div class="w-full relative mt-2" v-if="$store.state.editable && eventType === 'rule'">
      <button
        title="Click and drag to create new event"
        class="
          h-3
          rounded-full
          border
          flex
          items-center
          justify-center
          flex-shrink-0
          relative
          border-transparent
          bg-transparent
          hover:border-white hover:bg-white
          text-slate-600
          hover:bg-white
          border-white
          dark:text-slate-100 dark:hover:border-gray-600 dark:hover:bg-gray-600
        "
        :class="
          creating
            ? 'dark:border-gray-600 dark:bg-gray-600 bg-white border-white'
            : ''
        "
        :style="`left: ${newEventPosition[0].left}px; width: ${
          newEventPosition[1].left - newEventPosition[0].left
        }px;`"
        @mousedown.prevent.stop="$emit('startMakingEvent', $event)"
        @touchstart.prevent.stop="$emit('startMakingEvent', $event)"
      >
        +
      </button>
    </div>
    <!-- <div style="height: 90vh"></div> -->
  </div>
</template>

<script lang="ts">
import EventRow from "./EventRow.vue";
import Vue from "vue";
import { Event } from "~/src/Types";
import DrawerHeader from "../Drawer/DrawerHeader.vue";
import { mapGetters } from "vuex";
import EventGroup from "./EventGroup/EventGroup.vue";
import { DateTime } from "luxon";

export default Vue.extend({
  props: ["newEventPosition", "creating", "eventType"],
  components: { EventRow, DrawerHeader, EventGroup },
  computed: {
    now(): DateTime {
      return DateTime.now();
    },
    // shouldShowNow(): boolean {
    //   if (this.$store.state.sidebar.hideNowLine) {
    //     return false;
    //   }
    //   return (
    //     this.now > (this.baselineLeftmostDate as DateTime) &&
    //     this.now < (this.baselineRightmostDate as DateTime)
    //   );
    // },
    ...mapGetters([
      "distanceBetweenBaselineDates",
      "filteredEvents",
      "distanceFromBaselineLeftmostDate",
      "baselineLeftmostDate",
      "baselineRightmostDate",
      "getRegions"
    ]),
  },
  watch: {
    filteredEvents(val) {
      console.log(val, 'filteredEvents')
    },
    getRegions(prev, cur) {
      console.log('getRegions====',prev, cur, prev=== cur)
    }
  },
  methods: {
    clic() {
      console.log("click");
    },
    edit(data: Event) {
      console.log(data, '编辑获取的值');
      (this.$refs.RuleFormModal as Vue & {showModal:Function}).showModal(data);
    }
  },
});
</script>

<style>
/* appearing */
.eventRow-enter-active {
  transition: all 400ms ease-out;
}

/* disappearing */
.eventRow-leave-active {
  transition: all 200ms ease-in;
  position: absolute;
}

/* appear at / disappear to */
.eventRow-enter-from,
.eventRow-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.eventTitle {
  font-family: system-ui;
  font-size: 80%;
  white-space: nowrap;
}
</style>