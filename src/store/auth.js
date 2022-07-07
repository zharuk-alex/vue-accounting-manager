//Firebase imports
import { auth, database } from "@/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { ref, set } from "firebase/database";

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async signup({ dispatch, commit }, { email, password, name }) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        const uid = await dispatch("getUid");
        await set(ref(database, `/users/${uid}/info`), {
          bill: 10000,
          name,
          locale: "en-EN",
        });
      } catch (error) {
        commit("setError", error);
        throw new Error(error);
      }
    },

    async login({ commit }, { email, password }) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        commit("setError", error);
        throw new Error(error);
      }
    },

    async logout({ commit }) {
      await signOut(auth);
      commit("clearInfo");
    },

    getUid() {
      const user = auth.currentUser;
      return user ? user.uid : null;
    },
  },
};
