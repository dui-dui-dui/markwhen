<template>
  <Main />
</template>

<script lang="ts">
import Vue from "vue";
import Main from "~/components/Main.vue";
import { mapGetters } from "vuex";
import { NuxtCookies } from "cookie-universal-nuxt";

export default Vue.extend({
  async asyncData({ app }) {
    let { data: configData } = await app.$axios.get('http://127.0.0.1:8080/config')
    let { data: regionData } = await app.$axios.get('http://127.0.0.1:8080/region')
    let groups = configData.groups
    let markdown = configData.markdown
    let labels = configData.labels
    let schemas = configData.schemas
    return {
      result: configData,
      groups,
      markdown,
      labels,
      schemas,
      regions: regionData
    }
  },
  head() {
    const meta = [
      {
        name: "viewport",
        content: "width=device-width, user-scalable=no",
      },
    ];
    if (this.metadata.description) {
      meta.push({
        name: "description",
        content: this.metadata.description,
      });
    }
    return {
      title: "Placement Rules",
      meta,
    };
  },
  middleware(context) {
    const theme = context.app.$cookies.get("theme");
    if (theme) {
      context.store.commit("sidebar/setDarkMode", theme);
    }
    const sidebarSide = context.app.$cookies.get("sbs");
    if (sidebarSide) {
      context.store.commit("sidebar/setPosition", sidebarSide);
    }
    const width = context.app.$cookies.get("sbw");
    if (width) {
      context.store.commit("sidebar/setWidth", parseInt(width));
    }
    const hideNowLine = context.app.$cookies.get('hnl')
    if (hideNowLine) {
      context.store.commit('sidebar/setHideNowLine', hideNowLine)
    }
  },
  components: { Main },
  data() {
    return {
      markdown: '',
      groups: [],
      result: '',
      labels: [],
      schemas: [],
      regions: []
    }
  },
  computed: mapGetters(["metadata"]),
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$store.commit("setEventsString", this.markdown);
      this.$store.commit("setGroups", this.groups)
      this.$store.commit("setSchemas", this.schemas)
      this.$store.commit('setRegions', this.regions)
    },
  }
});
</script>
