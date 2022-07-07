<template>
  <div>
    <div class="page-title">
      <h3>Planning</h3>
      <h4>{{ $filters.currency(bill) }}</h4>
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
    <section v-else>
      <div v-for="category in categories" :key="category.id">
        <p>
          <strong>{{ category.title }}:</strong>
          {{ category.spend }} of {{ category.limit }}
        </p>
        <div class="progress" v-tooltip="category.tooltip">
          <div
            class="determinate"
            :class="[category.progressColor]"
            :style="{ width: `${category.progressPercent}%` }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import { useStore } from "vuex";

const $filters = inject("$filters");
const loading = ref(true);
const records = ref([]);
const categories = ref([]);
const store = useStore();
const bill = computed(() => store.getters.info.bill);

onMounted(async () => {
  records.value = await store.dispatch("fetchRecords");
  categories.value = await store.dispatch("fetchCategories").then((res) => {
    return res.map((category) => {
      const spend = records.value
        .filter((record) => record.categoryId == category.id)
        .filter((record) => record.type == "outcome")
        .reduce((acc, record) => (acc += +record.amount), 0);

      const percent = (100 * spend) / category.limit;
      const progressPercent = percent > 100 ? 100 : percent;
      const progressColor =
        percent < 60 ? "green" : percent < 100 ? "yellow" : "red";

      const tooltipValue = category.limit - spend;
      const tooltip = `${
        tooltipValue < 0 ? "Limit exceeded by" : "Balance"
      } ${$filters.currency(Math.abs(tooltipValue))}`;

      return {
        ...category,
        progressPercent,
        progressColor,
        spend,
        tooltip,
      };
    });
  });
  loading.value = false;
});
</script>

<style></style>
