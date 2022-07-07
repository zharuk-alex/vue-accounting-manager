<template>
  <div>
    <div class="page-title">
      <h3>{{ $filters.localize("history") }}</h3>
    </div>
    <app-loader v-if="loading"></app-loader>
    <div v-else-if="!records.length" class="row">
      <div class="col s12 m6">
        <div class="card-panel yellow lighten-1">
          <p class="flow-text">Records doesn't exist.</p>
          <router-link :to="{ name: 'record' }"> add new record </router-link>
        </div>
      </div>
    </div>
    <section v-else>
      <div class="history-chart">
        <HistoryChart :chart-data="chartData" />
      </div>
      <HistoryTable :records="records" />
    </section>
  </div>
</template>

<script setup>
import HistoryTable from "@/components/HistoryTable.vue";
import HistoryChart from "@/components/HistoryChart.vue";
import { onMounted, ref, reactive, inject } from "vue";
import { useStore } from "vuex";

const loading = ref(true);
const records = ref([]);
const categories = ref([]);
const store = useStore();
const $filters = inject("$filters");

const chartData = reactive({
  labels: [],
  datasets: [
    {
      label: "Outcome by categories",
      backgroundColor: [],
      data: [],
    },
  ],
});

onMounted(async () => {
  console.log($filters);
  const rcrds = await store.dispatch("fetchRecords");
  categories.value = await store.dispatch("fetchCategories");

  records.value = rcrds.map((record, index) => ({
    ...record,
    num: index + 1,
    categoryName: categories.value.find((c) => c.id == record.categoryId).title,
    typeClass: record.type == "income" ? "green" : "red",
    typeText: record.type == "income" ? "income" : "outcome",
    datetime: $filters.date(Date.parse(record.updated_at), "datetime"),
  }));

  // chart
  const randomeHexColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);
  chartData.labels = categories.value.map((c) => c.title);
  chartData.datasets[0].data = categories.value.map((c) => {
    return records.value.reduce((acc, r) => {
      if (c.id == r.categoryId && r.type == "outcome") {
        acc += +r.amount;
        chartData.datasets[0].backgroundColor.push(randomeHexColor());
      }
      return acc;
    }, 0);
  });

  loading.value = false;
});
</script>
