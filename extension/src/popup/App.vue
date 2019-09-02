<template>
  <div class="container">
    <div class="indecator" :class="indicatorClasses">
      <h1>
        {{ indicator.text }}
        <Preloader v-if="indicator.theme === 'pending'" />
      </h1>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import Preloader from "./components/preloader";

export default {
  data() {
    return {};
  },

  components: {
    Preloader
  },

  computed: {
    indicator() {
      return this.$store.state.indicator;
    },

    indicatorClasses() {
      const { theme } = this.indicator;

      return {
        default: theme === "default",
        danger: theme === "danger",
        pending: theme === "pending",
        info: theme === "info"
      };
    }
  }
};
</script>

<style lang="scss">
@import "./scss/style.scss";

@mixin colorize-element($color) {
  background-color: $color;
  box-shadow: 0 6px 18px 0 rgba($color, 0.8);
}

body {
  font-family: "Montserrat", sans-serif;
}

.container {
  width: 325px;
  padding: 10px;

  .indecator {
    @include colorize-element($primary);
    transition: all 0.7s ease;
    border-radius: 14px;
    padding: 10px 40px;
    margin-bottom: 10px;

    h1 {
      color: white;
      text-align: center;
    }
  }

  .indecator.default {
    @include colorize-element($primary);
  }

  .indecator.danger {
    @include colorize-element($danger);
  }

  .indecator.pending {
    @include colorize-element($pending);
    cursor: wait;
  }

  .indecator.info {
    @include colorize-element($info);
    cursor: help;
  }
}
</style>
