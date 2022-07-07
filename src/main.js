import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import toast from "./utils/toast.plugin";
import AppLoader from "./components/App/Loader";
import tooltipDirective from "./directives/tooltip.directive";
import filters from "@/filters/";
import "materialize-css/dist/js/materialize.js";
import { auth } from "@/firebase/config.js";
import { createMetaManager } from "vue-meta";

let app;
auth.onAuthStateChanged(() => {
  // Initialize Vue
  if (!app) {
    app = createApp(App);
    app
      .use(store)
      .use(router)
      .use(toast)
      .use(createMetaManager())
      .provide("$filters", filters)
      .component("app-loader", AppLoader)
      .directive("tooltip", tooltipDirective)
      .mount("#app");
  }
});
