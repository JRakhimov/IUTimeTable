/* tslint:disable:no-console */

import { register } from "register-service-worker";

import { GeneralModule } from "./store";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      GeneralModule.setUpdateDialogState(false);

      console.log("App is being served from cache by a service worker.\n");
    },
    registered() {
      GeneralModule.setUpdateDialogState(false);

      console.log("Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated() {
      console.log("New content is available; please refresh.");
      GeneralModule.setUpdateDialogState(true);
    },
    offline() {
      console.log("No internet connection found. App is running in offline mode.");
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    }
  });
}
