import { Module, VuexModule, Mutation } from "vuex-module-decorators";

import store from "@/store";

export enum AppTheme {
  Light = "Light",
  Dark = "Dark"
}

@Module({ name: "General", store })
export default class Profile extends VuexModule {
  public showUpdateDialog: Boolean = false;
  public appTheme: AppTheme = AppTheme.Light;

  get getShowUpdateDialogState() {
    return this.showUpdateDialog;
  }

  @Mutation
  setUpdateDialogState(state: Boolean) {
    this.showUpdateDialog = state;
  }

  get getAppTheme() {
    return this.appTheme;
  }

  @Mutation
  inverseAppTheme() {
    this.appTheme = this.appTheme === AppTheme.Light ? AppTheme.Dark : AppTheme.Light;
  }
}
