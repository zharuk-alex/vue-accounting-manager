<template>
  <div>
    <div>
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{
          $filters.localize("history")
        }}</router-link>
        <a v-if="record?.type" @click.prevent class="breadcrumb">
          {{ record.type }}
        </a>
      </div>
      <app-loader v-if="loading"></app-loader>
      <div v-else-if="!Object.keys(record).length" class="row">
        <div class="col s12 m6">
          <div class="card-panel yellow lighten-1">
            <p class="flow-text">This record does not exist.</p>
            <router-link :to="{ name: 'record' }"> add new record </router-link>
          </div>
        </div>
      </div>
      <div v-else class="row">
        <div class="col s12 m6">
          <div class="card" :class="[record.typeClass]">
            <div class="card-content white-text">
              <p>
                {{ $filters.localize("description") }}: {{ record.description }}
              </p>
              <p>{{ $filters.localize("amount") }}: {{ record.amount }}</p>
              <p>{{ $filters.localize("category") }}: {{ category.title }}</p>
              <small>{{ record.datetime }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const $filters = inject("$filters");

const category = ref(null);
const record = ref(null);
const loading = ref(true);

onMounted(async () => {
  const recordId = route.params.id;
  const rcrd = await store.dispatch("fetchRecordById", recordId);
  record.value = {
    ...rcrd,
    typeClass: rcrd.type === "income" ? "green" : "red",
    datetime: $filters.date(Date.parse(rcrd.updated_at), "datetime"),
  };

  category.value = await store.dispatch("fetchCategoryById", rcrd.categoryId);
  loading.value = false;
});
</script>
