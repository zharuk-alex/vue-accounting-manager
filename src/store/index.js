import { createStore } from "vuex";
import auth from "@/store/auth";
import info from "@/store/info";
import category from "@/store/category";
import record from "@/store/record";

export default createStore({
  state: {
    error: null,
  },
  getters: {
    error: (state) => state.error,
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    },
  },
  actions: {
    async fetchCurrency() {
      const res = await fetch(
        "https://api.exchangerate.host/latest?symbols=USD,EUR,UAH"
      );
      return await res.json();
    },
  },
  modules: {
    auth,
    info,
    category,
    record,
  },
});
