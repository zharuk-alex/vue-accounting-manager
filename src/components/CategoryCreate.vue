<template>
  <div>
    <div class="page-subtitle">
      <h4>{{ $filters.localize("new_category") }}</h4>
    </div>
    <form @submit.prevent="submitHandler">
      <div class="input-field">
        <input
          id="name"
          type="text"
          :class="{ invalid: v$.title.$dirty && v$.title.$invalid }"
          v-model="state.title"
          @blur="v$.title.$touch"
        />
        <label for="name">
          {{ $filters.localize("title") }}
        </label>
        <template v-if="v$.title.$dirty && v$.title.$invalid">
          <small
            v-for="error in v$.title.$silentErrors"
            :key="error.$validator"
            class="helper-text"
            :class="{ invalid: v$.title.$invalid }"
          >
            {{ error.$message }}
          </small>
        </template>
      </div>

      <div class="input-field">
        <input
          id="limit"
          type="number"
          :class="{ invalid: v$.limit.$dirty && v$.limit.$invalid }"
          v-model.number="state.limit"
          @blur="v$.limit.$touch"
        />
        <label for="limit">
          {{ $filters.localize("limit") }}
        </label>
        <template v-if="v$.limit.$dirty && v$.limit.$invalid">
          <small
            v-for="error in v$.limit.$silentErrors"
            :key="error.$validator"
            class="helper-text"
            :class="{ invalid: v$.limit.$invalid }"
          >
            {{ error.$message }}
          </small>
        </template>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ $filters.localize("add") }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, inject, onMounted } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import M from "materialize-css";
import { useStore } from "vuex";

const store = useStore();

const state = reactive({
  title: "",
  limit: 1,
});

const rules = {
  title: { required },
  limit: { required, minValue: minValue(1) },
};

const v$ = useVuelidate(rules, state);
const toast = inject("toast");
const $filters = inject("$filters");

const submitHandler = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }

  try {
    await store.dispatch("createCategory", state);
    state.title = "";
    state.limit = 1;
    v$.value.$reset();
    toast("Category successfully created", "success");
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => M.updateTextFields());
</script>

<style lang="scss" scoped></style>
