<template>
  <span>{{ clock }}</span>
</template>

<script>
export default {
  name: "Preloader",
  data() {
    return {
      clockBin: "",
      clocks: [
        "🕐",
        "🕑",
        "🕒",
        "🕓",
        "🕔",
        "🕕",
        "🕖",
        "🕗",
        "🕘",
        "🕙",
        "🕚",
        "🕛"
      ]
    };
  },
  methods: {
    clockPreloader() {
      this.clockBin = this.clocks[
        Math.floor((Date.now() / 100) % this.clocks.length)
      ];

      setTimeout(this.clockPreloader, 50);
    }
  },
  mounted() {
    this.clockPreloader();
  },

  computed: {
    clock() {
      return this.clockBin;
    }
  }
};
</script>
