const indicatorModule = {
  namespaced: true,

  state: {
    text: "",
    theme: ""
  },

  mutations: {
    set(state, indicatorData) {
      state.text = indicatorData.text;
      state.theme = indicatorData.theme;
    }
  }
};

export default indicatorModule;
