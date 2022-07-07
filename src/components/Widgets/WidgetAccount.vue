<template>
  <div class="card light-blue bill-card">
    <div class="card-content white-text">
      <span class="card-title">{{
        $filters.localize("currency_account")
      }}</span>

      <p v-for="currency in currencies" :key="currency" class="currency-line">
        <span>
          {{ $filters.currency(calculateCurrency(currency), currency) }}
        </span>
      </p>
    </div>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { computed, defineProps, inject } from "vue";

const $filters = inject("$filters");
const props = defineProps({
  rates: Object,
});

const store = useStore();

const currencies = ["UAH", "USD", "EUR"];

const base = computed(
  () => store.getters.info.bill / (props.rates["UAH"] / props.rates["EUR"])
);

const calculateCurrency = (currency) => {
  return Math.floor(base.value * props.rates[currency]);
};
</script>
<style lang="scss" scoped></style>
