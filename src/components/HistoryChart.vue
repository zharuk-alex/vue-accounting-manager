<template>
  <div>
    <Pie
      :chart-options="chartOptions"
      :chart-data="props.chartData"
      :chartId="props.chartId"
      :width="props.width"
      :height="props.height"
      :cssClasses="props.cssClasses"
      :styles="props.styles"
      :plugins="props.plugins"
    />
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { Pie } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartId: {
    type: String,
    default: "pie-chart",
  },
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 400,
  },
  cssClasses: {
    default: "",
    type: String,
  },
  styles: {
    type: Object,
    default: () => {},
  },
  plugins: {
    type: Array,
    default: () => [],
  },
});
//
// setup

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<style lang="scss" scoped></style>
