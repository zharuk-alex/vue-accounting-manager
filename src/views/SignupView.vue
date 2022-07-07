<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">Accountant manager</span>
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
      <div class="input-field">
        <input
          id="confirmPassword"
          type="password"
          v-model.trim="state.confirmPassword"
          :class="[invalidClass('confirmPassword')]"
          @blur="v$.confirmPassword.$touch"
        />
        <label for="confirmPassword">Confirm password</label>
        <template v-if="v$.confirmPassword.$dirty">
          <small
            v-for="error in v$.confirmPassword.$silentErrors"
            :key="error.$validator"
            class="helper-text"
            :class="[invalidClass('confirmPassword')]"
          >
            {{ error.$message }}
          </small>
        </template>
      </div>
      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model.trim="state.name"
          @blur="v$.name.$touch"
          :class="[invalidClass('name')]"
        />
        <label for="name">Name</label>
        <template v-if="v$.name.$dirty">
          <small
            v-for="error in v$.name.$silentErrors"
            :key="error.$validator"
            class="helper-text"
            :class="[invalidClass('name')]"
          >
            {{ error.$message }}
          </small>
        </template>
      </div>

      <div>
        <label>
          <input type="checkbox" v-model="state.agree" />
          <span>Agree with terms and conditions</span>
        </label>
        <div v-if="v$.agree.$dirty">
          <small
            v-for="error in v$.agree.$silentErrors"
            :key="error.$validator"
            class="helper-text"
            :class="[invalidClass('agree')]"
          >
            {{ error.$message }}
          </small>
        </div>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          :class="{ disabled: isSubmiting }"
          type="submit"
          :disabled="isSubmiting"
        >
          Sign up
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Has account?
        <router-link :to="{ name: 'login' }">Login!</router-link>
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  sameAs,
  helpers,
} from "@vuelidate/validators";

const $router = useRouter();
const store = useStore();

const state = reactive({
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  agree: false,
});

const passwordRef = computed(() => state.password);

const isSubmiting = ref(false);

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(6) },
  confirmPassword: {
    required,
    sameAsPassword: sameAs(passwordRef),
  },
  name: { required, minLength: minLength(3) },
  agree: {
    checked: helpers.withMessage(
      "You must agree to the terms and conditions",
      (value) => !!value
    ),
  },
};

const v$ = useVuelidate(rules, state);

const passwordIsVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordIsVisible.value = !passwordIsVisible.value;
};

const submitHandler = async function () {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }

  isSubmiting.value = true;

  try {
    await store.dispatch("signup", {
      email: state.email,
      password: state.password,
      name: state.name,
    });
    $router.push({ name: "home" });
  } catch (error) {
    console.log(error);
  }

  isSubmiting.value = false;
};

const invalidClass = (field) => {
  return v$.value[field].$invalid && v$.value[field].$dirty ? "invalid" : "";
};
</script>

<style></style>
