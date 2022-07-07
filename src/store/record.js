// createRecord
/* eslint-disable */
import { database } from "@/firebase/config";
import {
  ref, push, get, query,
  orderByKey,
  startAt,
  startAfter,
  limitToFirst,
  limitToLast,
  orderByValue,
} from "firebase/database";

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async createRecord({ commit, dispatch }, record) {
      try {
        const uid = await dispatch("getUid");
        return await push(ref(database, `/users/${uid}/records`), record);
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    },
    async fetchRecords({ commit, dispatch }) {
      try {
        const uid = await dispatch("getUid");
        const result = await get(ref(database, `/users/${uid}/records`)).then(
          snapshot => snapshot.val()
        ) || {};

        return Object.keys(result).map(key => ({ ...result[key], id: key }));
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    },
    async fetchRecordById({ commit, dispatch }, id) {
      try {
        const uid = await dispatch("getUid");
        const result = await get(ref(database, `/users/${uid}/records/${id}`)).then(
          snapshot => snapshot.val()
        ) || {};

        return result;
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    },
  },
};
