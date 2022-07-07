<template>
  <div>
    <div class="page-title">
      <h3>{{ $filters.localize("profile") }}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model.trim="state.name"
          @blur="v$.name.$touch"
          :class="[invalidClass('name')]"
        />
        <label for="name">{{ $filters.localize("name") }}</label>
        <template v-if="v$.name.$dirty">
          <small
            v-for="error in v$.name.$silentErrors"
            :key="error.$validator"
            class="helper-text"
            :class="[invalidClass('name')]"
          >
            {{ error.$message }}
          </small>
        </template>
      </div>
      <div class="input-field">
        <select ref="select_el" v-model="state.locale">
          <option
            v-for="(locale, index) in locales"
            :value="locale.value"
            :key="index"
          >
            {{ locale.title }}
          </option>
        </select>
        <label>{{ $filters.localize("select_lang") }}</label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ $filters.localize("update") }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script setup>
import M from "materialize-css";
import { reactive, ref, onMounted, onBeforeUnmount, inject } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { useStore } from "vuex";

const store = useStore();
const toast = inject("toast");
const $filters = inject("$filters");

const select_el = ref(null);
let select_m = null;
const state = reactive({
  name: store.getters.info.name,
  locale: store.getters.info.locale || "en-EN",
});

const rules = {
  name: { required, minLength: minLength(3) },
};

const locales = ref([
  {
    value: "en-EN",
    title: "English",
  },
  {
    value: "ua-UA",
    title: "Українська",
  },
]);

const isSubmiting = ref(false);
const v$ = useVuelidate(rules, state);
const invalidClass = (field) => {
  return v$.value[field].$invalid && v$.value[field].$dirty ? "invalid" : "";
};

const submitHandler = async function () {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }

  isSubmiting.value = true;

  try {
    await store.dispatch("updateInfo", {
      name: state.name,
      locale: state.locale,
    });
    toast("Profile successfully updated", "success");
  } catch (error) {
    console.log(error);
  }

  isSubmiting.value = false;
};

onMounted(async () => {
  select_m = M.FormSelect.init(select_el.value);
  M.updateTextFields();
});

const destroySelect = () => {
  if (select_m && select_m.destroy) {
    select_m.destroy();
    select_m = null;
  }
};

onBeforeUnmount(() => {
  destroySelect();
});
</script>
