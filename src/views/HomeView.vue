<template>
  <div>
    <div class="page-title">
      <h3>{{ $filters.localize("account") }}</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>
    <app-loader v-if="loading"></app-loader>
    <div v-else class="row">
      <div class="col s12 m6 l4">
        <WidgetAccount :rates="currency.rates" />
      </div>

      <div class="col s12 m6 l8">
        <WidgetExchangeRate :rates="currency.rates" :date="currency.date" />
      </div>
    </div>
  </div>
</template>
<script setup>
import WidgetAccount from "@/components/Widgets/WidgetAccount.vue";
import WidgetExchangeRate from "@/components/Widgets/WidgetExchangeRate.vue";
import { ref, onMounted, inject } from "vue";
import { useStore } from "vuex";

const store = useStore();
const $filters = inject("$filters");
const loading = ref(true);
const currency = ref({});

const refresh = async () => {
  loading.value = true;
  currency.value = await store.dispatch("fetchCurrency");
  loading.value = false;
};

onMounted(async () => {
  currency.value = await store.dispatch("fetchCurrency");
  loading.value = false;
});
</script>
