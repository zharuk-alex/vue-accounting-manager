<template>
  <div class="page-subtitle">
    <h4>{{ $filters.localize("edit") }}</h4>
  </div>

  <form @submit.prevent="submitHandler">
    <div class="input-field">
      <select ref="select_el" v-model="categoryId">
        <option
          v-for="category in props.categories"
          :value="category.id"
          :key="category.id"
        >
          {{ category.title }}
        </option>
      </select>
      <label>{{ $filters.localize("select_category") }}</label>
    </div>

    <div class="input-field">
      <input
        id="name"
        type="text"
        :class="{ invalid: v$.title.$dirty && v$.title.$invalid }"
        v-model="state.title"
        @blur="v$.title.$touch"
      />
      <label for="name">{{ $filters.localize("title") }}</label>
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
      <label for="limit">{{ $filters.localize("limit") }}</label>
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
      {{ $filters.localize("update") }}
      <i class="material-icons right">send</i>
    </button>
  </form>
</template>

<script setup>
import M from "materialize-css";
import {
  onMounted,
  ref,
  onBeforeUnmount,
  defineProps,
  reactive,
  inject,
  watch,
  watchPostEffect,
} from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import { useStore } from "vuex";
import { defineEmits } from "vue";

const emit = defineEmits(["update"]);
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
});
const $filters = inject("$filters");
const store = useStore();

const select_el = ref(null);
let select_m = null;
const state = reactive({
  title: props.categories[0].title,
  limit: props.categories[0].limit,
});
const categoryId = ref(props.categories[0].id);

const rules = {
  title: { required },
  limit: { required, minValue: minValue(1) },
};

const v$ = useVuelidate(rules, state);
const toast = inject("toast");

const submitHandler = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }

  const categoryData = {
    title: state.title,
    limit: state.limit,
    id: categoryId.value,
  };

  try {
    await store.dispatch("updateCategory", categoryData);
    emit("update", categoryData);
    setTimeout(() => {
      destroySelect();
      select_m = M.FormSelect.init(select_el.value);
    }, 0);
    toast("Category successfully updated", "success");
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
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

watch(categoryId, (newvalue) => {
  let { title, limit } = props.categories.find((c) => c.id == newvalue);
  state.title = title;
  state.limit = limit;
});
watchPostEffect(() => {
  M.updateTextFields();
});
</script>

<style lang="scss" scoped></style>
