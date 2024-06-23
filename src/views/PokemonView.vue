<script setup>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

import { onBeforeMount, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import pokemon from "@/api/pokemon";
import Spinner from "@/components/Spinner.vue";

const data = reactive({
  pokemon: null,
  hasError: false,
  isLoading: false,
});

const refMain = ref(null);

const pokemonName = useRoute().params.pokemonName;

const methods = {
  getPokemon() {
    data.isLoading = true;
    pokemon
      .getItem(pokemonName)
      .then((p) => {
        // т.к. данные покемона большие и не отображаются развернутыми из-за настроек vue-json-pretty
        // то по умолчанию мы кликаем на общий объект покемона, чтобы раскрыть его
        // а дальше работает наше ограничение collapsedNodeLength=10 и у нас не будут развернуты все объекты и массивы если они очень длинные
        data.pokemon = p;
        setTimeout(() => {
          if (refMain !== null) {
            refMain.value
              .querySelector(".vjs-tree")
              .querySelector("span")
              .click();
          }
        }, 0);
      })
      .catch((e) => {
        data.hasError = true;
        console.error(e);
      })
      .finally(() => {
        setTimeout(() => {
          data.isLoading = false;
        }, 500);
      });
  },
};

onBeforeMount(() => {
  if (data.pokemon === null) {
    methods.getPokemon();
  }
});
</script>

<template>
  <main ref="refMain">
    <Spinner v-if="data.isLoading" />
    <router-link to="/">Вернуться в список</router-link>
    <h1>Покемон {{ pokemonName }}</h1>
    <div v-if="data.hasError" class="alert-error">
      Ошибка! Такого покемона нету!
    </div>
    <vue-json-pretty
      v-else-if="data.pokemon !== null"
      :data="data.pokemon"
      :collapsed-node-length="10"
      :show-icon="true"
    />
  </main>
</template>

<style scoped>
main {
  > a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
      color: #0056b3;
    }
  }

  > .alert-error {
    background-color: #f44336;
    color: white;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 15px;
  }
}
</style>
