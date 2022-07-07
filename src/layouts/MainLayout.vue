<template>
  <div class="app-main-layout">
    <Navbar @click-menu="sidebarIsOpen = !sidebarIsOpen" />

    <Sidebar v-model="sidebarIsOpen" />
    <app-loader v-if="loading"></app-loader>
    <main v-else class="app-content" :class="{ full: !sidebarIsOpen }">
      <div class="app-page">
        <router-view></router-view>
      </div>
    </main>
    <div class="fixed-action-btn">
      <router-link class="btn-floating btn-large blue" to="/record">
        <i class="large material-icons">add</i>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import Navbar from "@/components/App/Navbar.vue";
import Sidebar from "@/components/App/Sidebar.vue";

const sidebarIsOpen = ref(true);
const store = useStore();

const loading = ref(true);

onMounted(async () => {
  if (!Object.keys(store.getters.info).length) {
    await store.dispatch("fetchInfo");
  }

  loading.value = false;
});
</script>
