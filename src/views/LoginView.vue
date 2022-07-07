<template>
  <form @submit.prevent="submitHandler" class="card auth-card">
    <div class="card-content">
      <span class="card-title">Домашняя бухгалтерия</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model.trim="state.email"
          @blur="v$.email.$touch"
          :class="[invalidClass('email')]"
        />
        <label for="email">Email</label>
        <template v-if="v$.email.$dirty">
          <small
            v-for="error in v$.email.$silentErrors"
            :key="error.$validator"
            class="helper-text"
            :class="[invalidClass('email')]"
          >
            {{ error.$message }}
          </small>
        </template>
      </div>
      <div class="input-field">
        <input
          id="password"
          :type="passwordIsVisible ? 'text' : 'password'"
          v-model.trim="state.password"
          :class="[invalidClass('password')]"
          @blur="v$.password.$touch"
        />

        <a
          v-show="state.password.length"
          href="#"
          style="display: block; margin-left: calc(100% - 28px)"
          @click.prevent="togglePasswordVisibility"
        >
          <i
            class="material-icons prefix text-darken-1"
            :class="[passwordIsVisible ? 'green-text' : 'grey-text']"
          >
            visibility
          </i>
        </a>
        <label for="password">Password</label>
        <template v-if="v$.password.$dirty">
          <small
            v-for="error in v$.password.$silentErrors"
            :key="error.$validator"
            class="helper-text"
            :class="[invalidClass('password')]"
          >
            {{ error.$message }}
          </small>
        </template>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          type="submit"
          :class="{ disabled: isSubmiting }"
          :disabled="isSubmiting"
        >
          Sign in
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Don't have an account yet?
        <router-link to="/signup">Sign up</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { ref, reactive, onMounted, defineComponent, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import messages from "@/utils/messages";

export default defineComponent({
  name: "Login",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const toast = inject("toast");
    const state = reactive({
      email: "",
      password: "",
    });

    const rules = {
      email: { required, email },
      password: { required, minLength: minLength(6) },
    };

    const v$ = useVuelidate(rules, state);

    const isSubmiting = ref(false);
    const passwordIsVisible = ref(false);

    const togglePasswordVisibility = () => {
      passwordIsVisible.value = !passwordIsVisible.value;
    };

    const submitHandler = async () => {
      if (v$.value.$invalid) {
        v$.value.$touch();
        return;
      }

      isSubmiting.value = true;

      try {
        await store.dispatch("login", {
          email: state.email,
          password: state.password,
        });
        router.push({ name: "home" });
      } catch (err) {
        console.log(err);
      }

      isSubmiting.value = false;
    };

    const invalidClass = (field) => {
      return v$.value[field].$invalid && v$.value[field].$dirty
        ? "invalid"
        : "";
    };

    onMounted(() => {
      if (messages[route.query.message]) {
        toast(messages[route.query.message]);
      }
    });

    return {
      state,
      v$,
      isSubmiting,
      passwordIsVisible,
      submitHandler,
      invalidClass,
      togglePasswordVisibility,
    };
  },
});
</script>
