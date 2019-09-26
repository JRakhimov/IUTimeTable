import { Module, VuexModule, Mutation } from "vuex-module-decorators";

import store from "@/store";

@Module({ name: "General", store })
export default class Profile extends VuexModule {
  public showUpdateDialog: Boolean = false;

  get getShowUpdateDialogState() {
    return this.showUpdateDialog;
  }

  @Mutation
  setUpdateDialogState(state: Boolean) {
    this.showUpdateDialog = state;
  }
}
