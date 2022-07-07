<template>
  <table class="highlight responsive-table">
    <thead>
      <tr>
        <th>#</th>
        <th>{{ $filters.localize("amount") }}</th>
        <th>{{ $filters.localize("date") }}</th>
        <th>{{ $filters.localize("category") }}</th>
        <th>{{ $filters.localize("type") }}</th>
        <th>{{ $filters.localize("show") }}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="record in paginatedRecords" :key="record.id">
        <td>{{ record.num }}</td>
        <td>{{ $filters.currency(record.amount) }}</td>
        <td>{{ record.datetime }}</td>
        <td>{{ record.categoryName }}</td>
        <td>
          <span class="white-text badge" :class="[record.typeClass]">
            {{ record.typeText }}
          </span>
        </td>
        <td>
          <button
            class="btn-small btn"
            @click="router.push('/record-detail/' + record.id)"
            v-tooltip="'show detail'"
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <Pagination
    v-if="pagesTotal > 1"
    :pages-total="pagesTotal"
    :current-page="currentPage"
    @change="paginationHandler"
  />
</template>

<script setup>
import Pagination from "./Pagination.vue";

import { computed, defineProps, onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

const $filters = inject("$filters");
const route = useRoute();
const router = useRouter();
const props = defineProps({
  records: {
    type: Array,
    required: true,
  },
});
const pagesTotal = ref(1);
const pageSize = ref(5);
const currentPage = ref(1);

const paginatedRecords = computed(() => {
  let test = props.records.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
  return test;
});

const paginationHandler = function (value) {
  currentPage.value = value;
  router.push({ name: "history", query: { page: value } });
};

onMounted(() => {
  if (route.query?.page) {
    currentPage.value = +route.query?.page;
  }
  pagesTotal.value = Math.ceil(props.records.length / pageSize.value);
});
</script>
