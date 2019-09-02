<template>
  <button
    class="j-button"
    :class="buttonThemeClasses"
    @click="$emit('click', $event)"
    :disabled="disabled"
  >{{ text }}</button>
</template>

<script>
export default {
  name: "Button",

  props: {
    text: {
      type: String,
      default: "Button"
    },

    disabled: {
      type: Boolean,
      default: false
    },

    theme: {
      type: String,
      default: "default"
    }
  },

  computed: {
    buttonThemeClasses() {
      return {
        default: this.theme === "default",
        danger: this.theme === "danger",
        pending: this.theme === "pending",
        info: this.theme === "info"
      };
    }
  }
};
</script>

<style lang="scss">
@import "../scss/style.scss";

.j-button {
  transition: all 0.4s ease;
  width: 100%;
  border-radius: 14px;
  border: none;
  outline: none;
  color: white;
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.j-button.default {
  background-color: $primary;
  box-shadow: 0 6px 18px 0 rgba($primary, 0.5);
}
.j-button.default:hover {
  box-shadow: 0 6px 18px 0 rgba($primary, 0.8);
}
.j-button.default:active {
  background-color: lighten($primary, 8%);
  box-shadow: 0 6px 18px 0 rgba(lighten($primary, 8%), 0.8);
}

.j-button.danger {
  background-color: $danger;
  box-shadow: 0 6px 18px 0 rgba($danger, 0.5);
}
.j-button.danger:hover {
  box-shadow: 0 6px 18px 0 rgba($danger, 0.8);
}
.j-button.danger:active {
  background-color: lighten($danger, 8%);
  box-shadow: 0 6px 18px 0 rgba(lighten($danger, 8%), 0.8);
}

.j-button.pending {
  background-color: $pending;
  box-shadow: 0 6px 18px 0 rgba($pending, 0.5);
}
.j-button.pending:hover {
  box-shadow: 0 6px 18px 0 rgba($pending, 0.8);
}
.j-button.pending:active {
  background-color: lighten($pending, 8%);
  box-shadow: 0 6px 18px 0 rgba(lighten($pending, 8%), 0.8);
}

.j-button.info {
  background-color: $info;
  box-shadow: 0 6px 18px 0 rgba($info, 0.5);
}
.j-button.info:hover {
  box-shadow: 0 6px 18px 0 rgba($info, 0.8);
}
.j-button.info:active {
  background-color: lighten($info, 8%);
  box-shadow: 0 6px 18px 0 rgba(lighten($info, 8%), 0.8);
}

.j-button:disabled,
.j-button.default:disabled,
.j-button.danger:disabled,
.j-button.pending:disabled,
.j-button.info:disabled,
.j-button[disabled] {
  background-color: white;
  box-shadow: 0 6px 18px 0 rgba(#cbcbcb, 0.7);
  cursor: not-allowed;
  color: #cbcbcb;
}
</style>