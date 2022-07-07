<template>
  <div>
    <div class="page-title">
      <h3>Категории</h3>
    </div>
    <app-loader v-if="loading"></app-loader>
    <section v-else>
      <div class="row">
        <div class="col s12 m6">
          <CategoryCreate />
        </div>
        <div class="col s12 m6">
          <CategoryEdit
            v-if="categories.length"
            :categories="categories"
            @update="updateCategories"
          />
          <div v-else class="card-panel cyan lighten-3">
            <p>Category doesn't exist</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted } from "vue";
import CategoryCreate from "../components/CategoryCreate.vue";
import CategoryEdit from "@/components/CategoryEdit.vue";
import { useStore } from "vuex";

const store = useStore();

const categories = ref([]);
const loading = ref(true);

function updateCategories(category) {
  const idx = categories.value.findIndex((c) => c.id == category.id);
  categories.value[idx] = category;
}

onMounted(async () => {
  categories.value = await store.dispatch("fetchCategories");
  loading.value = false;
});
</script>
