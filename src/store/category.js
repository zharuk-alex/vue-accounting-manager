/* eslint-disable */
import { database } from "@/firebase/config";
import { ref, push, get, update } from "firebase/database";

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async createCategory({ commit, dispatch }, { title, limit }) {
      try {
        const uid = await dispatch("getUid");
        const category = await push(ref(database, `/users/${uid}/categories`), {
          title,
          limit,
        });
        return { title, limit, id: category.key };
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    },
    async fetchCategories({ commit, dispatch }) {
      try {
        const uid = await dispatch("getUid");
        const result = await get(ref(database, `/users/${uid}/categories`)).then(
          snapshot => snapshot.val()
        ) || {};

        return Object.keys(result).map(key => ({ ...result[key], id: key }));
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    },
    async fetchCategoryById({ commit, dispatch }, id) {
      try {
        const uid = await dispatch("getUid");
        const result = await get(ref(database, `/users/${uid}/categories/${id}`)).then(
          snapshot => snapshot.val()
        ) || {};

        return result;
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    },
    async updateCategory({ commit, dispatch }, { title, limit, id }) {
      try {
        const uid = await dispatch("getUid");
        await update(ref(database, `/users/${uid}/categories/${id}`), {
          title,
          limit,
        });

      } catch (error) {
        commit("setError", error);
        throw error;
      }

    },
  },
};
