<template>
  <div class="container">
    <h1>Edit Page</h1>
  </div>
</template>

<script>
import Preloader from "../../components/preloader.vue";

export default {
  data() {
    return {};
  },
  components: {
    Preloader
  },
  methods: {},

  mounted() {},

  computed: {}
};
</script>

<style lang="scss" scoped>
$primary: #6c63ff;
$pending: #ffc107;
$danger: #f50057;

.container {
  width: 320px;
  font-family: "Montserrat", sans-serif;
  padding: 10px;
}
</style>
