import { Component, Emit, Vue } from "vue-property-decorator";

@Component
export default class VueOffline extends Vue {
  isOnline: boolean = false;
  isOffline: boolean = false;

  @Emit("online")
  onlineHandler() {
    this.isOnline = true;
    this.isOffline = false;
  }

  @Emit("offline")
  offlineHandler() {
    this.isOnline = false;
    this.isOffline = true;
  }

  mounted() {
    if (typeof window !== "undefined") {
      navigator.onLine ? (this.isOnline = true) : (this.isOffline = true);

      window.addEventListener("online", this.onlineHandler);
      window.addEventListener("offline", this.offlineHandler);

      this.$once("hook:beforeDestroy", () => {
        window.removeEventListener("online", this.onlineHandler);
        window.removeEventListener("offline", this.offlineHandler);
      });
    }
  }
}
