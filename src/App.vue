<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content} | SITE_NAME` : `SITE_NAME`
    }}</template>
  </metainfo>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>
<script>
import EmptyLayout from "./layouts/EmptyLayout.vue";
import MainLayout from "./layouts/MainLayout.vue";
import { watchEffect, computed, inject } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useMeta } from "vue-meta";

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const $filters = inject("$filters");
    const toast = inject("toast");
    const error = computed(() => store.getters.error);
    const layout = computed(() => (route.meta.layout || "empty") + "-layout");

    useMeta({
      title: $filters.localize("app_name"),
      htmlAttrs: { lang: "en", amp: true },
    });

    watchEffect(() => {
      if (error.value === null) return;
      toast(error.value, "error");
    });

    return { layout, error };
  },
  components: {
    EmptyLayout,
    MainLayout,
  },
};
</script>
<style lang="scss">
@import "~materialize-css/dist/css/materialize.min.css";
@import "assets/index.css";
</style>
