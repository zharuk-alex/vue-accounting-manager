<template>
  <ul class="sidenav app-sidenav" :class="{ open: props.modelValue }">
    <router-link
      v-for="link in links"
      :to="{ name: link.name }"
      :key="link.route"
      custom
      v-slot="{ href, isActive, isExactActive }"
    >
      <li :class="[isActive && 'active', isExactActive && 'exact-active']">
        <a :href="href" class="waves-effect waves-orange pointer">
          {{ $filters.localize(link.meta.title) }}
        </a>
      </li>
    </router-link>
  </ul>
</template>

<script setup>
import { defineProps, computed, inject } from "vue";
import { useRouter } from "vue-router";

const $filters = inject("$filters");
const router = useRouter();

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
});

const links = computed(() =>
  router.options.routes.filter(
    (route) => route.meta?.at_sidebar && route.meta?.title
  )
);
</script>
