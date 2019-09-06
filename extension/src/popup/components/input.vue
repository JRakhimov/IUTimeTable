<template>
  <div class="input" :class="{ focus: isFocus, disabled }">
    <label :for="idFor" :class="{ disabled }">{{ label }}</label>
    <input
      :placeholder="placeholder"
      :class="{ disabled }"
      :required="required"
      :disabled="disabled"
      :type="type"
      :ref="idFor"
      :id="idFor"
      :value="value"
      @focus="onFocus"
      @input="onInput"
      @blur="onBlur"
    />
  </div>
</template>

<script>
export default {
  name: "Input",

  data() {
    return {
      isFocus: false
    };
  },

  props: {
    value: {
      type: String
    },
    placeholder: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: "❔"
    },
    idFor: {
      type: String,
      default: "input"
    }
  },

  methods: {
    onFocus() {
      this.isFocus = true;
    },

    onBlur() {
      this.isFocus = false;
    },

    onInput(e) {
      this.$emit("input", this.$refs[this.idFor].value);
    }
  }
};
</script>

<style lang="scss">
@import "../scss/style.scss";

.input {
  transition: all 0.4s ease;
  display: flex;
  border-bottom: 1.5px solid #cbcbcb;
  vertical-align: middle;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
  padding: 0 5px;
  box-sizing: border-box;

  label {
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
    margin-right: 6px;
  }

  input {
    transition: all 0.4s ease;
    border: none;
    outline: none;
    padding: 10px 10px 5px 0px;
    background: white;
    color: #cbcbcb;
    font-weight: 700;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
  }

  input:focus,
  input:active {
    color: $danger;
  }

  input::placeholder {
    color: #cbcbcb;
  }
}

.input.focus {
  border-bottom: 1.5px solid $danger;
}

.input.disabled,
input.disabled,
label.disabled {
  cursor: not-allowed;
}
</style>