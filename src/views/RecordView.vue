<template>
  <div class="page-title">
    <h3>{{ $filters.localize("new_record") }}</h3>
  </div>
  <app-loader v-if="loading"></app-loader>

  <div v-else-if="!categories.length" class="row">
    <div class="col s12 m6">
      <div class="card-panel yellow lighten-1">
        <p class="flow-text">Category doesn't exist.</p>
        <router-link :to="{ name: 'categories' }">
          add new category
        </router-link>
      </div>
    </div>
  </div>

  <form v-else class="form" @submit.prevent="submitHandler">
    <div class="input-field">
      <select ref="select_el" v-model="categoryId">
        <option
          v-for="category in categories"
          :value="category.id"
          :key="category.id"
        >
          {{ category.title }}
        </option>
      </select>
      <label>{{ $filters.localize("select_category") }}</label>
    </div>

    <p>
      <label>
        <input
          class="with-gap"
          name="type"
          type="radio"
          value="income"
          v-model="state.type"
        />
        <span>{{ $filters.localize("income") }}</span>
      </label>
    </p>

    <p>
      <label>
        <input
          class="with-gap"
          name="type"
          type="radio"
          value="outcome"
          v-model="state.type"
        />
        <span>{{ $filters.localize("outcome") }}</span>
      </label>
    </p>

    <div class="input-field">
      <input
        id="amount"
        type="number"
        v-model.number="state.amount"
        :class="{ invalid: v$.amount.$dirty && v$.amount.$invalid }"
        @blur="v$.amount.$touch"
      />
      <label for="amount">{{ $filters.localize("amount") }}</label>
      <template v-if="v$.amount.$dirty && v$.amount.$invalid">
        <small
          v-for="error in v$.amount.$silentErrors"
          :key="error.$validator"
          class="helper-text"
          :class="{ invalid: v$.amount.$invalid }"
        >
          {{ error.$message }}
        </small>
      </template>
    </div>

    <div class="input-field">
      <input
        id="description"
        type="text"
        v-model="state.description"
        :class="{ invalid: v$.description.$dirty && v$.description.$invalid }"
        @blur="v$.description.$touch"
      />
      <label for="description">{{ $filters.localize("description") }}</label>
      <template v-if="v$.description.$dirty && v$.description.$invalid">
        <small
          v-for="error in v$.description.$silentErrors"
          :key="error.$validator"
          class="helper-text"
          :class="{ invalid: v$.description.$invalid }"
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
</template>

<script setup>
import {
  reactive,
  inject,
  onMounted,
  ref,
  onBeforeUnmount,
  nextTick,
  computed,
} from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import M from "materialize-css";
import { useStore } from "vuex";

const $filters = inject("$filters");
const store = useStore();
const select_el = ref(null);
const loading = ref(true);
const categories = ref([]);
const categoryId = ref(null);
let select_m = null;
const userBill = computed(() => store.getters.info.bill);

const state = reactive({
  amount: 1,
  description: "",
  type: "income",
});

const rules = {
  description: { required },
  amount: { required, minValue: minValue(1) },
};

const v$ = useVuelidate(rules, state);
const toast = inject("toast");

const recordIsPossible = computed(() => {
  if (state.type == "income") {
    return true;
  }

  return userBill.value >= state.amount;
});

const submitHandler = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }

  try {
    if (recordIsPossible.value) {
      try {
        await store.dispatch("createRecord", {
          ...state,
          categoryId: categoryId.value,
          updated_at: new Date().toJSON(),
        });

        const bill =
          state.type == "income"
            ? userBill.value + state.amount
            : userBill.value - state.amount;

        await store.dispatch("updateInfo", { bill });
        toast("Record created", "success");
        v$.value.$reset();
        state.amount = 1;
        state.description = "";
      } catch (error) {
        console.log(error);
      }
    } else {
      toast(
        `You don't have enough money in your account!(${
          state.amount - userBill.value
        })`,
        "error"
      );
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  categories.value = await store.dispatch("fetchCategories");
  if (categories.value.length) {
    categoryId.value = categories.value[0].id;
  }
  loading.value = false;
  nextTick(() => {
    select_m = M.FormSelect.init(select_el.value);
    M.updateTextFields();
  });
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
