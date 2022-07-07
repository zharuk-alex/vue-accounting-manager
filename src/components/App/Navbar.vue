<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a href="#" @click.prevent="$emit('click-menu')">
          <i class="material-icons black-text">dehaze</i>
        </a>
        <span class="black-text">{{ $filters.date(date, "datetime") }}</span>
      </div>

      <ul class="right hide-on-small-and-down">
        <li>
          <a
            class="dropdown-trigger black-text"
            href="#"
            data-target="dropdown"
            ref="dropdown_ref"
          >
            {{ userName }}
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id="dropdown" class="dropdown-content">
            <li>
              <router-link to="profile" class="black-text">
                <i class="material-icons">account_circle</i>
                {{ $filters.localize("profile") }}
              </router-link>
            </li>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a href="#" class="black-text" @click.prevent="logout">
                <i class="material-icons">assignment_return</i>
                {{ $filters.localize("logout") }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script setup>
import M from "materialize-css";
import { ref, computed, onMounted, onBeforeUnmount, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
const $filters = inject("$filters");

const dropdown_ref = ref(null);
let dropdown = null;
const date = ref(new Date());
const dateInterval = ref(null);
const userName = computed(() => store.getters.info?.name);

onMounted(() => {
  initDropdown();
  initDateInterval();
});

const initDateInterval = () => {
  dateInterval.value = setInterval(() => {
    date.value = new Date();
  }, 1000);
};

const initDropdown = () => {
  dropdown = M.Dropdown.init(dropdown_ref.value, {
    constrainWidth: false,
  });
};
const destroyDropdown = () => {
  if (dropdown && dropdown.destroy) {
    dropdown.destroy();
  }
};
const logout = async () => {
  await store.dispatch("logout");
  router.push({ name: "login", query: { message: "logout" } });
};

onBeforeUnmount(() => {
  clearInterval(dateInterval.value);
  destroyDropdown();
});
</script>
