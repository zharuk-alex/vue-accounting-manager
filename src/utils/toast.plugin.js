import M from "materialize-css";

export default {
  install: (app) => {
    const toast = (html, flag) => {
      let options = {
        html,
        classes: "card-panel ",
      };

      if (flag == "error") {
        options.classes += "red lighten-2";
      } else if (flag == "success") {
        options.classes += "green lighten-2";
      }

      M.toast(options);
    };

    app.provide("toast", toast);
  },
};
