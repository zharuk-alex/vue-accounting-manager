import { database } from "@/firebase/config";
import { ref, get, update } from "firebase/database";

export default {
  state: {
    info: {},
  },
  getters: {
    info: (state) => state.info,
  },
  mutations: {
    setInfo: (state, payload) => (state.info = payload),
    clearInfo: (state) => (state.info = {}),
  },
  actions: {
    async fetchInfo({ dispatch, commit }) {
      try {
        const uid = await dispatch("getUid");
        const info = await get(ref(database, `/users/${uid}/info`)).then(
          (snapshot) => snapshot.val()
        );
        commit("setInfo", info);
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateInfo({ dispatch, commit, getters }, toUpdate) {
      try {
        const uid = await dispatch("getUid");
        const updateData = { ...getters.info, ...toUpdate };
        await update(ref(database, `/users/${uid}/info`), updateData);
        commit("setInfo", updateData);
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
