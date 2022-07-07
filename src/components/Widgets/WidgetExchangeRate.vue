<template>
  <div class="card orange darken-3 bill-card">
    <div class="card-content white-text">
      <div class="card-header">
        <span class="card-title">
          {{ $filters.localize("exchange_rate") }}
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>{{ $filters.localize("currency") }}</th>
            <th>{{ $filters.localize("rate") }}</th>
            <th>{{ $filters.localize("date") }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="currency in currencies" :key="currency">
            <td>{{ currency }}</td>
            <td>{{ props.rates[currency].toFixed(5) }}</td>
            <td>{{ $filters.date(new Date(props.date)) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { defineProps, inject } from "vue";

const props = defineProps({
  rates: Object,
  date: String,
});

const $filters = inject("$filters");

const currencies = ["UAH", "USD", "EUR"];
</script>
