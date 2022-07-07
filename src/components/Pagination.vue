<template>
  <ul class="pagination">
    <li
      :class="{ disabled: currentPage == 1 }"
      :disabled="currentPage == 1"
      @click="setActive(currentPage - 1)"
    >
      <a href="#!" @click.prevent><i class="material-icons">chevron_left</i></a>
    </li>
    <li
      v-for="page in pagesArray"
      :key="page"
      :class="{ active: page == currentPage }"
      @click="setActive(page)"
    >
      <a href="#!" @click.prevent>{{ page }}</a>
    </li>
    <li
      :class="{ disabled: pagesTotal == currentPage }"
      @click="setActive(currentPage + 1)"
      :disabled="pagesTotal == currentPage"
    >
      <a href="#!" @click.prevent>
        <i class="material-icons">chevron_right</i>
      </a>
    </li>
  </ul>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const emit = defineEmits(["change"]);

const props = defineProps({
  pagesTotal: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
});

const setActive = function (num) {
  if (props.currentPage == num || num == 0 || num > props.pagesTotal) {
    return;
  }
  emit("change", num);
};

const pagesArray = [...Array(props.pagesTotal).keys()].map((i) => i + 1);
</script>

<style lang="scss" scoped></style>
