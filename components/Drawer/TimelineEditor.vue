<template>
  <div class="w-full dark:bg-gray-900 bg-slate-200 h-full flex flex-col">
    <div class="ml-2">
      <h3 class="text-xl font-bold ml-1 text-gray-500 px-2 pt-2">Edit</h3>
      <div class="flex-shrink-0 ml-3 flex">
        <cascade-buttons :shadowed="false" />
      </div>
    </div>
    <div class="flex-grow overflow-scroll">
      <client-only>
        <code-mirror />
      </client-only>
    </div>
    <div
      class="
        flex flex-row
        text-gray-300
        ml-2
        flex-shrink-0
        pb-2
        md:pb-7
        pt-2
        justify-center
      "
    >
      <share-button
        @click="share"
        :buttonTitle="buttonTitle"
        :disabled="buttonDisabled"
      />
      <save-locally-button @click="saveLocally" />
    </div>
  </div>
</template>

<script lang="ts">
import ShareButton from "./ShareButton.vue";
import SaveLocallyButton from "./SaveLocallyButton.vue";
import { getApp } from "firebase/app";
import { onSnapshot, doc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, Unsubscribe } from "firebase/auth";
import Vue from "vue";
import CodeMirror from "./CodeMirror.vue";
import CascadeButtons from "./CascadeButtons.vue";

export default Vue.extend({
  components: { SaveLocallyButton, ShareButton, CodeMirror, CascadeButtons },
  data() {
    return {
      userId: "" as string | undefined,
      username: "",
      usernameListener: undefined as Unsubscribe | undefined,
      sharing: false,
    };
  },
  computed: {
    buttonTitle(): string {
      if (this.sharing) {
        return "Sharing...";
      }
      if (!!this.userId) {
        if (!!this.username) {
          return "Share...";
        } else {
          return "Create a username to share";
        }
      }
      return "Sign in to share";
    },
    buttonDisabled(): boolean {
      return this.sharing;
    },
  },
  methods: {
    doc(path: string) {
      return doc(getFirestore(getApp()), path);
    },
    async share() {
      if (!this.userId) {
        this.$store.commit("sidebar/setSelectedComponent", "profile");
        return;
      }
      const name = prompt(
        `To share to \ncascade.page/${this.username}, share as ${this.username}. \n\nOtherwise, cascades will be shared from \ncascade.page/${this.username}/[timeline name].`,
        this.username
      );
      if (!name) {
        return;
      }
      this.sharing = true;
      try {
        await this.$rpc.post("/api/share", {
          timeline: this.$store.state.eventsString,
          name,
        });
        this.sharing = false;
        this.$router.push(
          `/${this.username}${name === this.username ? "" : "/" + name}`
        );
      } catch (err) {
        console.error(err);
        alert("Unable to share timeline :(");
      }
    },
    saveLocally() {
      const timelineName = prompt(
        "Save cascade as: ",
        this.$store.state.currentTimelineName
      );
      if (timelineName) {
        this.$store.commit("saveTimeline", timelineName);
      }
    },
  },
  watch: {
    userId(val, oldVal) {
      const vm = this;
      if (val) {
        this.usernameListener = onSnapshot(
          this.doc(`users/${val}`),
          (snapshot) => {
            if (!snapshot.exists()) {
              return;
            }
            vm.username = snapshot.data().username;
          }
        );
      } else if (this.usernameListener) {
        this.usernameListener();
      }
    },
  },
  mounted() {
    const vm = this;
    onAuthStateChanged(getAuth(), function (user) {
      vm.userId = user?.uid;
    });
  },
});
</script>

<style>
</style>