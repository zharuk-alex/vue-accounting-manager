import M from "materialize-css";

export default {
  beforeMount: (el, { value }) => {
    M.Tooltip.init(el, { html: value, margin: -10 });
  },
  unmounted: (el) => {
    const tooltip = M.Tooltip.getInstance(el);
    if (tooltip && tooltip.destroy) {
      tooltip.destroy();
    }
  },
};
